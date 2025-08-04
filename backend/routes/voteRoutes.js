const express = require("express");
const { castVote 
    , getCandidatesByCampaign
    , getCampaignWithCandidates
} = require("../controllers/voteController");

const router = express.Router();
const voterAuth = require("../middlewares/voterAuth");

router.post("/cast", voterAuth, castVote);
router.get("/:campaignId/candidates", voterAuth, getCandidatesByCampaign);
router.get("/vote/:campaignId/candidates", voterAuth, getCampaignWithCandidates);

module.exports = router;
