const Resume = require("../models/resumeModel")
const User = require("../models/userModel")
const puppeteer=require("puppeteer")

 const createResume = async (req, res) => {
    try {
        const userId = req.user.id

        const resume = await Resume.create({
            userId,
            personalInfo: req.body.personalInfo,
            education: req.body.education,
            experience: req.body.experience,
            skills: req.body.skills,
            projects: req.body.projects,
        })

        res.status(201).json({
            success: true,
            message: "Resume created successfully",
            resume,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


 const getResume = async (req, res) => {
    try {
        const userId = req.user.id
        const resumes = await Resume.find({ userId })
        if(!resumes){
            return res.status(404).json({Msg:"Resumes are not found!"})
        }
        res.status(200).json({
            success: true,
            count: resumes.length,
            resumes
        })
    } catch (error) {
        console.log("Resume.error")
        res.status(500).json({ Msg: error.message })
    }
}

const getResumeById = async (req, res) => {
    try {
        const resumeId = req.params.id
        const resume = await Resume.findOne({
            _id: resumeId,
            userId: req.user.id
        })
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume Not Found"
            })
        }
        res.status(200).json({
            success: true,
            resume,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


 const updateResume = async (req, res) => {
    try {
        const resumeId = req.params.id
        const userId = req.user.id
        const allowedUpdates = [
            "personalInfo",
            "education",
            "experience",
            "skills",
            "projects",
        ];

        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field]) updates[field] = req.body[field];
        });
        const updatedResume = await Resume.findOneAndUpdate(
            { _id: resumeId, userId },
            { $set: updates },
            { new: true, runValidators: true }
        )
        if (!updatedResume) {
            return res.status(404).json({ Msg: "Resume Not Found or access denied" })
        }
        res.status(200).json({
            success: true,
            message: "Resume updated successfully",
            resume: updatedResume
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
 const deleteResume = async (req, res) => {
    try {
        const userId = req.user.id
        const resumeid = req.params.id
        const resume = await Resume.findOneAndDelete(
            { _id: resumeid, userId }
        )
        if (!resume) {
            return res.status(404).json({ success: false, Msg: "Resume Not Found" })
        }
        res.status(200).json({
            success: true,
            message: "Resume Deleted Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            Msg: error.message
        })
    }
}

 const getmyResume = async (req, res) => {
    try {
        const userId = req.user.id
        const resume = await Resume.findOne({ userId })
        if (!resume) {
            return res.status(404).json({ message: "Resume Not Found" })
        }
        res.status(200).json({
            success: true,
            resume
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
  createResume,
  getResume,
  getResumeById,
  updateResume,
  deleteResume,
  getmyResume
}
