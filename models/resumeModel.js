const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    personalInfo: {
      firstname: { type: String, default: "" },
      lastname: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
    },

    education: [
      {
        degree: { type: String, default: "" },
        institution: { type: String, default: "" },
        startYear: { type: Date, default: null },
        endDate: { type: Date, default: null },
      },
    ],

    experience: [
      {
        company: { type: String, default: "" },
        role: { type: String, default: "" },
        startDate: { type: Date, default: null },
        endDate: { type: Date, default: null },
        description: { type: String, default: "" },
      },
    ],

    // ✅ change "skill" to "skills" to match controller
    skills: { type: [String], default: [] },

    projects: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        techStack: { type: [String], default: [] },
      },
    ],
  },
  { timestamps: true }
);

// ✅ THIS IS REQUIRED (so Resume.create works)
module.exports = mongoose.model("Resume", resumeSchema);
