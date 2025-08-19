const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require("../Schema/UserSchema"); // Adjust path as needed

const router = express.Router();

// ================== Email Transporter ==================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ================== Utility ==================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ================== 1. User Registration ==================
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, dob, gender, password } = req.body;

    if (!fullName || !email || !phone || !dob || !gender || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ userEmail: email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      userName: fullName,
      userEmail: email,
      contact: phone,
      dob,
      gender,
      password: hash,
      status: 'active' // optional, used in password reset
    });

    const savedUser = await user.save();

    res.status(200).json({
      message: 'Registered successfully',
      user: savedUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ================== 2. User Login ==================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ userEmail: email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { _id: user._id, userEmail: user.userEmail },
      process.env.JWT_KEY || 'default_jwt_key'
    );

    const userData = {
      _id: user._id,
      userName: user.userName,
      userEmail: user.userEmail,
      contact: user.contact
    };

    res.status(200).json({ token, user: userData });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ================== 3. Request Password Reset ==================
router.post('/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ userEmail: email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.status !== 'active') return res.status(403).json({ message: 'Account is not active' });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, { resetOTP: otp, resetOTPExpiry: otpExpiry });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.userName},</p>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP expires in 10 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully to your email address' });

  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ================== 4. Verify OTP ==================
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ userEmail: email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.resetOTP || !user.resetOTPExpiry || new Date() > user.resetOTPExpiry) {
      await User.findByIdAndUpdate(user._id, { resetOTP: null, resetOTPExpiry: null });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const resetToken = jwt.sign(
      { userId: user._id, email: user.userEmail },
      process.env.JWT_SECRET || 'reset_secret',
      { expiresIn: '15m' }
    );

    await User.findByIdAndUpdate(user._id, { resetOTP: null, resetOTPExpiry: null });

    res.status(200).json({ message: 'OTP verified successfully', token: resetToken });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ================== 5. Reset Password ==================
router.post('/reset-password', async (req, res) => {
  try {
    const { password } = req.body;
    const authHeader = req.headers.authorization;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'reset_secret');
    } catch (err) {
      return res.status(401).json({ message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.userEmail,
      subject: 'Password Reset Successful',
      html: `
        <h2>Password Reset</h2>
        <p>Hello ${user.userName},</p>
        <p>Your password was successfully changed.</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.warn('Failed to send confirmation email:', emailErr.message);
    }

    res.status(200).json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ================== 6. Resend OTP ==================
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ userEmail: email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, { resetOTP: otp, resetOTPExpiry: otpExpiry });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Resent OTP for Password Reset',
      html: `
        <h2>New OTP</h2>
        <p>Hello ${user.userName},</p>
        <p>Your new OTP is: <strong>${otp}</strong></p>
        <p>This OTP expires in 10 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP resent successfully' });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
