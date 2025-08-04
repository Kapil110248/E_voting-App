const jwt = require("jsonwebtoken");
const Voter = require("../models/Voter");

const voterAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const voter = await Voter.findById(decoded.id).select("-password");
    if (!voter) return res.status(404).json({ message: "Voter not found" });

    req.voter = voter;
    req.userId = voter._id; // ✅ Required for castVote
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = voterAuth;
