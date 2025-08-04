const path = require("path");
const importVoters = require("../utils/importVoters");

const filePath = path.join(__dirname, "../uploads/voters.xlsx");
importVoters(filePath);
