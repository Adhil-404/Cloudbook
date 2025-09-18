const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../Schema/UserSchema");
const sendEmail = require("../Controllers/Sendmail");

const forgotPassword = async (req, res) => {
  try {
const user = await User.findOne({ userEmail: req.body.email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
    await sendEmail(
      user.userEmail,
      "Password Reset Request",
      `<p>Click <a href="${resetURL}">here</a> to reset your password</p>`
    );

    res.json({ message: "Reset email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { forgotPassword, resetPassword };
