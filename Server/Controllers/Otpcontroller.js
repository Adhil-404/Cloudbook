const User = require("../Schema/UserSchema");
const OTP = require("../Schema/OtpSchema");
const bcrypt = require("bcrypt");
const sendMail = require("./Sendmail");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ userEmail: email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpCode = Math.floor(100000 + Math.random() * 900000);

    await OTP.create({ email, otp: otpCode, expiresAt: Date.now() + 5 * 60 * 1000 });

    await sendMail(email, "Password Reset OTP", `Your OTP is ${otpCode}`);

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) return res.status(400).json({ message: "Invalid OTP" });

    if (validOtp.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ userEmail: email }, { password: hashedPassword });

    await OTP.deleteOne({ email, otp });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { forgotPassword, resetPassword };
