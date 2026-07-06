const Resume = require("../models/resumeModel")

const authorizeOwnerOrAdmin = async (req, res, next) => {
    try {
        const { id } = req.params

        if (req.user.role === "admin") return next()

        const resume = await Resume.findById(id)
        if (!resume) return res.status(404).json({ Msg: "Resume Not Found!" })

        if (String(resume.userId) !== String(req.user.id)) {
            return res.status(403).json({ Msg: "Not Your Resume" })
        }
        next()

    } catch (error) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = authorizeOwnerOrAdmin