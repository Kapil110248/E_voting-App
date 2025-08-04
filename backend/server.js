const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

app.use(express.json());

// ✅ Allow cookie-based cross-origin requests from frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Your React + Vite frontend port
    credentials: true,
  })
);

app.use(cookieParser());

// 🔗 DB connection
require("./config/db")();

// 🔀 Routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/voter", require("./routes/voterRoutes")); // ✅ This must point to voterRoutes.js
app.use("/api/vote", require("./routes/voteRoutes"));   // Optional

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
