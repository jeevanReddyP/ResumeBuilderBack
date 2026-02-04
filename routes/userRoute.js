const express = require("express");
const authMiddelware = require("../middleware/authMiddleware");

const { RegisterUser, loginUser } = require("../controllers/authController");

const {
  createResume,
  getResume,
  getResumeById,
  updateResume,
  deleteResume,
  getmyResume,
  downloadResumePDF, // ✅ include this here
} = require("../controllers/resumeController");

const router = express.Router();
console.log("🔥 userRoute.js LOADED ON RENDER 🔥");
router.get("/debug/pdf", (req, res) => {
  res.json({ ok: true, msg: "debug route live" });
});

router.get("/debug/version", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Test route
router.get("/test", (req, res) => {
  console.log("✅ /api/test HIT");
  res.json({ ok: true });
});

// Auth Routes
router.post("/auth/register", RegisterUser);
router.post("/auth/login", loginUser);

// Resume Routes
router.post("/resume", authMiddelware, createResume);
router.patch("/resume/:id", authMiddelware, updateResume);
router.get("/resume", authMiddelware, getResume);
router.get("/resume/me", authMiddelware, getmyResume);

// ✅ IMPORTANT: keep download BEFORE /resume/:id
router.get("/resume/:id/download", authMiddelware, downloadResumePDF);

router.get("/resume/:id", authMiddelware, getResumeById);
router.delete("/resume/:id", authMiddelware, deleteResume);

module.exports = router;
