  const Admin = require("../models/Admin");
  const Campaign = require("../models/Campaign");
  const Candidate = require("../models/Candidate");
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");

  exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        console.log("❌ Admin not found");
        return res.status(400).json({ message: "Admin not found" });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      console.log("✅ bcrypt result:", isMatch);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res
        .cookie("token", token, { httpOnly: true })
        .json({ success: true, message: "Login successful" });
    } catch (error) {
      console.log("🔥 Server error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  exports.createCampaign = async (req, res) => {
    try {
      const { title, startDate, endDate } = req.body;

      if (!title || !startDate || !endDate) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const parsedStart = new Date(startDate);
      const parsedEnd = new Date(endDate);

      if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      if (parsedStart >= parsedEnd) {
        return res.status(400).json({ message: "End date must be after start date" });
      }

      const campaign = new Campaign({
        title,
        startDate: parsedStart,
        endDate: parsedEnd,
      });

      await campaign.save();

      res.status(201).json({ success: true, message: "Campaign created", campaign });
    } catch (error) {
      console.error("🔥 Error creating campaign:", error);
      res.status(500).json({ message: "Error creating campaign" });
    }
  };


  // controllers/adminController.js
  exports.registerAdmin = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({ fullname, email, password: hashedPassword });
      await newAdmin.save();

      res.status(201).json({ success: true, message: "Admin registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  exports.addCandidates = async (req, res) => {
    try {
      const { campaignId, candidates } = req.body;

      if (!campaignId || !Array.isArray(candidates) || candidates.length === 0) {
        return res.status(400).json({ message: "Invalid data" });
      }

      const campaign = await Campaign.findById(campaignId);
      if (!campaign) return res.status(404).json({ message: "Campaign not found" });

      const newCandidates = await Promise.all(
        candidates.map(async (name) => {
          const c = new Candidate({ name, campaignId });
          await c.save();
          return c._id;
        })
      );

      campaign.candidates.push(...newCandidates);
      await campaign.save();

      res.json({ success: true, message: "Candidates added successfully" });
    } catch (err) {
      console.error("Add candidates error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  exports.getAllCampaigns = async (req, res) => {
    try {
      const campaigns = await Campaign.find().select("title _id");
      res.status(200).json({ campaigns });
    } catch (err) {
      console.error("❌ Error fetching campaigns:", err);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  };
  exports.getCampaignsWithCandidates = async (req, res) => {
    try {
      const campaigns = await Campaign.find()
        .populate("candidates", "name votes image")  // 👈 NOTE: image include hona chahiye
        .select("title startDate endDate candidates");

      res.status(200).json({ campaigns });
    } catch (err) {
      console.error("❌ Error fetching campaigns with candidates:", err);
      res.status(500).json({ message: "Failed to fetch campaign data" });
    }
  };

  exports.updateCampaign = async (req, res) => {
    const { id } = req.params;
    const { title, startDate, endDate } = req.body;

    try {
      const updated = await Campaign.findByIdAndUpdate(
        id,
        { title, startDate, endDate },
        { new: true }
      );
      res.json({ success: true, updated });
    } catch (err) {
      res.status(500).json({ message: "Failed to update campaign" });
    }
  };
  exports.deleteCampaign = async (req, res) => {
    const { id } = req.params;
    try {
      await Campaign.findByIdAndDelete(id);
      await Candidate.deleteMany({ campaignId: id }); // clean-up
      res.json({ success: true, message: "Campaign deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  };
  exports.updateCandidate = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const updated = await Candidate.findByIdAndUpdate(id, { name }, { new: true });
      res.json({ success: true, updated });
    } catch (err) {
      res.status(500).json({ message: "Failed to update candidate" });
    }
  };
  exports.deleteCandidate = async (req, res) => {
    const { id } = req.params;
    try {
      await Candidate.findByIdAndDelete(id);
      res.json({ success: true, message: "Candidate deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete candidate" });
    }
  };
  exports.getAdminResults = async (req, res) => {
    try {
      const campaigns = await Campaign.find().populate("candidates");
      res.json({ campaigns });
    } catch (err) {
      console.error("Error loading results:", err);
      res.status(500).json({ message: "Failed to load results" });
    }
  };




  exports.addCandidatesWithImages = async (req, res) => {
    try {
      const { campaignId } = req.body;

      // names[] expected from frontend (same order as images)
      let names = req.body.names;

      // Convert single value to array if only one name is submitted
      if (!Array.isArray(names)) {
        names = [names];
      }

      if (!campaignId || !req.files || req.files.length === 0 || names.length !== req.files.length) {
        return res.status(400).json({ message: "Invalid data. Make sure names and files match." });
      }

      const candidates = [];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const name = names[i];

        const candidate = new Candidate({
          name,
          image: file.path, // Cloudinary image URL
          campaignId,
        });

        await candidate.save();

        // Add to campaign
        await Campaign.findByIdAndUpdate(campaignId, {
          $push: { candidates: candidate._id },
        });

        candidates.push(candidate);
      }

      res.status(201).json({ success: true, message: "✅ Candidates added successfully", candidates });
    } catch (err) {
      console.error("❌ Error adding candidates:", err);
      res.status(500).json({ message: "Server error while adding candidates" });
    }
  };



  exports.getAdminProfile = async (req, res) => {
    try {
      const admin = await Admin.findById(req.adminId).select("-password");
      if (!admin) return res.status(404).json({ message: "Admin not found" });
      res.json({ admin });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
  // controllers/adminController.js

  exports.logoutAdmin = (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      path: "/",
    });
    res.json({ success: true, message: "Logged out successfully" });
  };
