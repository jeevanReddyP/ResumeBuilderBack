const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const authorizeOwnerOrAdmin = require("../middleware/authorizeOwnerOrAdmin");

const {
  RegisterUser,
  loginUser,
} = require("../controllers/authController");

const {
  createResume,
  getResume,
  getResumeById,
  updateResume,
  deleteResume,
  getMyResume,
  downloadResumePDF,
} = require("../controllers/resumeController");

const router = express.Router();

// ========================
// Debug Routes
// ========================

router.get("/debug/version", (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
  });
});

router.get("/test", (req, res) => {
  res.json({
    ok: true,
  });
});

// ========================
// Authentication
// ========================

router.post("/auth/register", RegisterUser);

router.post("/auth/login", loginUser);

// ========================
// Resume Routes
// ========================

// Create Resume
router.post(
  "/resume",
  authMiddleware,
  authorizeRoles("user", "admin"),
  createResume
);

// Logged-in User Resume(s)
router.get(
  "/resume/me",
  authMiddleware,
  authorizeRoles("user", "admin"),
  getMyResume
);

// Admin - Get All Resumes
router.get(
  "/resume",
  authMiddleware,
  authorizeRoles("admin"),
  getResume
);

// Get Resume By Id
router.get(
  "/resume/:id",
  authMiddleware,
  authorizeOwnerOrAdmin,
  getResumeById
);

// Update Resume
router.patch(
  "/resume/:id",
  authMiddleware,
  authorizeOwnerOrAdmin,
  updateResume
);

// Delete Resume
router.delete(
  "/resume/:id",
  authMiddleware,
  authorizeOwnerOrAdmin,
  deleteResume
);

// Download Resume
router.get(
  "/resume/:id/download",
  authMiddleware,
  authorizeOwnerOrAdmin,
  downloadResumePDF
);

module.exports = router;