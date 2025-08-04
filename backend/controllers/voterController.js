const Voter = require("../models/Voter");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Campaign = require("../models/Campaign");

exports.loginVoter = async (req, res) => {
  const { voterId, password } = req.body;

  const voter = await Voter.findOne({ voterId });
  if (!voter) return res.status(400).json({ message: "Invalid Voter ID" });

  const isMatch = await bcrypt.compare(password, voter.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong Password" });

  const token = jwt.sign({ id: voter._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "Lax",
    secure: false,
  });

  res.json({ success: true, message: "Login successful", voter });
};

exports.getVoterProfile = async (req, res) => {
  try {
    const voter = await Voter.findById(req.voter._id).select("-password");
    if (!voter) return res.status(404).json({ message: "Voter not found" });

    res.status(200).json({ voter });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.logoutVoter = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};

exports.getAvailableCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("candidates");
    res.json({ campaigns });
  } catch (err) {
    res.status(500).json({ message: "Failed to load campaigns" });
  }
};
