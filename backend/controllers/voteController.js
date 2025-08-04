const Campaign = require("../models/Campaign");
const Candidate = require("../models/Candidate");
const Voter = require("../models/Voter");

// controllers/voteController.js
exports.castVote = async (req, res) => {
  try {
    const { campaignId, candidateId } = req.body;
    const voterId = req.userId;

    console.log("🧾 Incoming Vote:", { campaignId, candidateId, voterId });

    if (!voterId || !campaignId || !candidateId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const voter = await Voter.findById(voterId);
    if (!voter) return res.status(404).json({ message: "Voter not found" });

    // ✅ Check if already voted
    if (voter.votedCampaigns?.includes(campaignId)) {
      return res.status(400).json({ message: "You have already voted in this campaign" });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    candidate.votes += 1;
    await candidate.save();

    // ✅ Mark campaign as voted
    voter.votedCampaigns.push(campaignId);
    await voter.save();

    // ✅ Logout user by clearing token
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Vote casted successfully and you have been logged out.",
    });
  } catch (err) {
    console.error("❌ Error in castVote:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getCandidatesByCampaign = async (req, res) => {
  try {
    const campaignId = req.params.campaignId;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // ✅ Correct query
    const candidates = await Candidate.find({ campaignId });

    res.status(200).json({ campaign, candidates });
  } catch (err) {
    console.error("❌ Error getting candidates:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getCampaignWithCandidates = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findById(campaignId).populate("candidates");

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found", campaign: null });
    }

    res.status(200).json({
      success: true,
      campaign,
      candidates: campaign.candidates,
    });
  } catch (err) {
    console.error("Error fetching campaign:", err);
    res.status(500).json({ message: "Server error", campaign: null });
  }
};