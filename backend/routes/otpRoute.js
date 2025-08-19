import express from "express";
import User from "../models/User.js";

const router = express.Router();

// OTP Verify
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        if (user.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired" });

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
