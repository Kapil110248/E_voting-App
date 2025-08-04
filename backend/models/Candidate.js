
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  votes: { type: Number, default: 0 },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
});

module.exports = mongoose.model("Candidate", candidateSchema);

