const express = require("express");
const router = express.Router();

const Resume = require("../models/resumeModel");
const generatePDF = require("../utils/pdfGenerator");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ adjust path

// GET /api/resume/:id/download?templateId=classic&theme=light
router.get("/:id/download", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { templateId = "classic", theme = "light" } = req.query;

    // ✅ fetch resume by id
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ message: "Resume Not Found" });
    }

    // ✅ allow only owner to download
    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const pdfBuffer = await generatePDF(resume, templateId, theme);

    // ✅ Send PDF headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="resume-${id}.pdf"`
    );

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF download error:", error);
    return res.status(500).json({ message: "PDF generation failed" });
  }
});
router.post("/download", authMiddleware, async (req, res) => {
  try {
    const { templateId = "classic", theme = "light", resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({ message: "resumeId is required" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume Not Found" });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const pdfBuffer = await generatePDF(resume, templateId, theme);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="resume-${resumeId}.pdf"`
    );

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF download error:", error);
    return res.status(500).json({ message: "PDF generation failed" });
  }
});


module.exports = router;
