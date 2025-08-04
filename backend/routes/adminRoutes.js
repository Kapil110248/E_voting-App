const express = require("express");
const {
  adminLogin,
  registerAdmin,
  createCampaign,
  addCandidates, // Optional: For non-image route
  getAllCampaigns,
  getCampaignsWithCandidates,
  updateCampaign,
  deleteCampaign,
  updateCandidate,
  deleteCandidate,
  getAdminResults,
  addCandidatesWithImages,
  getAdminProfile,
  logoutAdmin,
} = require("../controllers/adminController");

const { verifyAdmin } = require("../middlewares/authMiddleware");
const { upload } = require("../utils/cloudinary");
const adminAuth = require("../middlewares/adminAuth");

const router = express.Router();

router.get("/logout", logoutAdmin);
router.get("/me", adminAuth, getAdminProfile);
router.post("/login", adminLogin);
router.post("/register", registerAdmin);
router.post("/campaign", verifyAdmin, createCampaign);
router.post(
  "/add-candidates",verifyAdmin, upload.array("candidates", 10),  addCandidatesWithImages);

router.get("/campaigns", verifyAdmin, getAllCampaigns);
router.get("/campaigns-with-candidates", verifyAdmin, getCampaignsWithCandidates);
router.put("/campaign/:id", verifyAdmin, updateCampaign);
router.delete("/campaign/:id", verifyAdmin, deleteCampaign);
router.get("/results", getAdminResults);
router.put("/candidate/:id", verifyAdmin, updateCandidate);
router.delete("/candidate/:id", verifyAdmin, deleteCandidate);

module.exports = router;
