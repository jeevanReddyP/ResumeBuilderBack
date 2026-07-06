const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true
        },
        otpHash: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
        purpose: {
            type: String,
            enum: ["REGISTER"],
            default: "REGISTER"
        },
    },
     { timestamps: true }
)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model("Otp", otpSchema);  