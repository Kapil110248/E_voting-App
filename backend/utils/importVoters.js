const xlsx = require("xlsx");
const bcrypt = require("bcryptjs");
const Voter = require("../models/Voter");
const mongoose = require("mongoose");
require("dotenv").config();
require("../config/db")(); // DB connect

const importVotersFromExcel = async (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  for (const row of data) {
    const hashedPassword = await bcrypt.hash(row.password, 10);
    await Voter.create({
      name: row.name,
      email: row.email,
      voterId: row.voterId,
      password: hashedPassword,
    });
  }

  console.log("✅ Voters imported successfully.");
  process.exit();
};

module.exports = importVotersFromExcel;
