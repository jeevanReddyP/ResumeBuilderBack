
const express = require("express");
const authMiddelware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const authorizeOwnerOrAdmin = require("../middleware/authorizeOwnerOrAdmin");

const { RegisterUser, loginUser } = require("../controllers/authController");

const {
  createResume,
  getResume,        
  getResumeById,    
  updateResume,     
  deleteResume,     
  getmyResume,      
  downloadResumePDF 
} = require("../controllers/resumeController");

const router = express.Router();
console.log("🔥 userRoute.js LOADED ON RENDER 🔥");

router.get("/debug/chrome", async (req, res) => {
  try {
    const chromium = require("@sparticuz/chromium");
    const puppeteer = require("puppeteer-core");

    const executablePath = await chromium.executablePath();

    return res.json({
      ok: true,
      puppeteerCore: !!puppeteer,
      chromium: !!chromium,
      executablePath: executablePath || null,
      node: process.version,
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      message: e.message,
      stack: e.stack,
    });
  }
});

router.get("/debug/pdf", (req, res) => {
  res.json({ ok: true, msg: "debug route live" });
});

router.get("/debug/version", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

router.get("/test", (req, res) => {
  console.log("✅ /api/test HIT");
  res.json({ ok: true });
});


router.post("/auth/register", RegisterUser);
router.post("/auth/login", loginUser);


router.post("/resume", authMiddelware, authorizeRoles("user", "admin"), createResume);


router.get("/resume/me", authMiddelware, authorizeRoles("user", "admin"), getmyResume);


router.get("/resume", authMiddelware, authorizeRoles("admin"), getResume);


router.get("/resume/:id/download", authMiddelware, authorizeOwnerOrAdmin, downloadResumePDF);


router.get("/resume/:id", authMiddelware, authorizeOwnerOrAdmin, getResumeById);


router.patch("/resume/:id", authMiddelware, authorizeOwnerOrAdmin, updateResume);


router.delete("/resume/:id", authMiddelware, authorizeOwnerOrAdmin, deleteResume);

module.exports = router;
