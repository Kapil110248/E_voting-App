const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }],
  published: { type: Boolean, default: false },
});

module.exports = mongoose.model("Campaign", campaignSchema);
