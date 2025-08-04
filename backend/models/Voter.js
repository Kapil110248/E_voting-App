// models/Voter.js
const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  voterId: { type: String, unique: true },
  votedCampaigns: [String], // ✅ Add this
});

module.exports = mongoose.model("Voter", voterSchema);
