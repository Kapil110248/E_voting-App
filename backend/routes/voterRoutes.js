const express = require("express");
const router = express.Router();
const {
  loginVoter,
  getVoterProfile,
  logoutVoter,
  getAvailableCampaigns,
} = require("../controllers/voterController");

const voterAuth = require("../middlewares/voterAuth");

router.post("/login", loginVoter);
router.get("/me", voterAuth, getVoterProfile);
router.post("/logout", voterAuth, logoutVoter);
router.get("/campaigns", voterAuth, getAvailableCampaigns);

module.exports = router;
