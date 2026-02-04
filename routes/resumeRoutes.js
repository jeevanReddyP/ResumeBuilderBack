const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Resume = require("../models/resumeModel");
const generatePDF = require("../utils/pdfGenerator");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ ONLY THIS DOWNLOAD ROUTE
router.get("/:id/download", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { templateId = "classic", theme = "light" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid resume id" });
    }

    const resume = await Resume.findById(id);
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
      `attachment; filename="resume-${templateId}-${id}.pdf"`
    );

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF download error:", error);
    return res.status(500).json({ message: "PDF generation failed" });
  }
});

module.exports = router;
