const mongoose = require("mongoose");
const Resume = require("../models/resumeModel");
const generatePDF = require("../utils/pdfGenerator");

// ✅ CREATE
const createResume = async (req, res) => {
  try {
    const userId = req.user.id;

    const resume = await Resume.create({
      userId,
      personalInfo: req.body.personalInfo || {},
      education: req.body.education || [],
      experience: req.body.experience || [],
      skill: req.body.skill || [],          // ✅ FIXED (skill not skills)
      projects: req.body.projects || [],
    });

    return res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET ALL USER RESUMES
const getResume = async (req, res) => {
  try {
    const userId = req.user.id;

    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.log("getResume error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ GET BY ID (only owner)
const getResumeById = async (req, res) => {
  try {
    const resumeId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ success: false, message: "Invalid resume id" });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ UPDATE
const updateResume = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ success: false, message: "Invalid resume id" });
    }

    const allowedUpdates = ["personalInfo", "education", "experience", "skill", "projects"]; // ✅ FIXED

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume Not Found or access denied" });
    }

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ DELETE
const deleteResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ success: false, message: "Invalid resume id" });
    }

    const resume = await Resume.findOneAndDelete({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume Not Found" });
    }

    return res.status(200).json({
      success: true,
      message: "Resume Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET MY RESUME (latest one)
const getmyResume = async (req, res) => {
  try {
    const userId = req.user.id;

    const resume = await Resume.findOne({ userId }).sort({ updatedAt: -1 });

    if (!resume) {
      return res.status(404).json({ message: "Resume Not Found" });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ DOWNLOAD PDF
const downloadResumePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const { templateId = "classic", theme = "light" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid resume id" });
    }

    const resume = await Resume.findById(id);
    if (!resume) return res.status(404).json({ message: "Resume Not Found" });

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
  } catch (err) {
  console.error("❌ PDF generation failed:", err);
  return res.status(500).json({
    message: err.message,
    stack: err.stack
  });
}


module.exports = {
  createResume,
  getResume,
  getResumeById,
  updateResume,
  deleteResume,
  getmyResume,
  downloadResumePDF,
};
