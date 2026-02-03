const express = require("express");
const authMiddelware = require("../middleware/authMiddleware");

const { RegisterUser, loginUser } =
  require("../controllers/authController");

const {
  createResume,
  getResume,
  getResumeById,
  updateResume,
  deleteResume,
  getmyResume
} = require("../controllers/resumeController")

const router = express.Router();
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
router.get("/resume/:id", authMiddelware, getResumeById);
router.delete("/resume/:id", authMiddelware, deleteResume);


module.exports = router;
