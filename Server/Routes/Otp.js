const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const User = require("../Schema/UserSchema")
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each IP to 3 OTP requests per 5 minutes
  message: {
    success: false,
    message: 'Too many OTP requests, please try again later'
  }
});

// Email Configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    secure: true,
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Utility Functions
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateTokens = (user) => {
  const payload = {
    _id: user._id,
    userEmail: user.userEmail
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  return { accessToken, refreshToken };
};

// ==================== ROUTES ====================

// 1. User Registration
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, dob, gender, password } = req.body;

    // Validation
    if (!fullName || !email || !phone || !dob || !gender || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ userEmail: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new user
    const user = new User({
      userName: fullName.trim(),
      userEmail: email.toLowerCase().trim(),
      contact: phone.trim(),
      dob: new Date(dob),
      gender: gender.toLowerCase(),
      password
    });

    const savedUser = await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(savedUser);

    // Prepare response data
    const userData = {
      _id: savedUser._id,
      userName: savedUser.userName,
      userEmail: savedUser.userEmail,
      contact: savedUser.contact,
      dob: savedUser.dob,
      gender: savedUser.gender,
      status: savedUser.status
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: userData,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

// 2. User Login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ userEmail: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts'
      });
    }

    // Check account status
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Prepare response data
    const userData = {
      _id: user._id,
      userName: user.userName,
      userEmail: user.userEmail,
      contact: user.contact,
      dob: user.dob,
      gender: user.gender,
      status: user.status,
      lastLogin: user.lastLogin
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

// 3. Request Password Reset
router.post('/request-password-reset', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ userEmail: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Generate OTP and set expiry
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP
    await User.findByIdAndUpdate(user._id, {
      resetOTP: otp,
      resetOTPExpiry: otpExpiry,
      resetAttempts: 0
    });

    // Send email
    const transporter = createTransporter();
    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - Your App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello <strong>${user.userName}</strong>,</p>
          <p>You have requested to reset your password. Please use the following OTP:</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p><strong>Important:</strong> This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email address'
    });

  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
});

// 4. Verify OTP
router.post('/verify-reset-otp', authLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const user = await User.findOne({ userEmail: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if OTP exists and hasn't expired
    if (!user.resetOTP || !user.resetOTPExpiry || new Date() > user.resetOTPExpiry) {
      await User.findByIdAndUpdate(user._id, {
        resetOTP: null,
        resetOTPExpiry: null,
        resetAttempts: 0
      });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check reset attempts
    if (user.resetAttempts >= 5) {
      await User.findByIdAndUpdate(user._id, {
        resetOTP: null,
        resetOTPExpiry: null,
        resetAttempts: 0
      });
      return res.status(429).json({
        success: false,
        message: 'Too many invalid attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (user.resetOTP !== otp) {
      await User.findByIdAndUpdate(user._id, {
        $inc: { resetAttempts: 1 }
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id, email: user.userEmail },
      process.env.JWT_RESET_SECRET,
      { expiresIn: '15m' }
    );

    // Clear OTP fields
    await User.findByIdAndUpdate(user._id, {
      resetOTP: null,
      resetOTPExpiry: null,
      resetAttempts: 0
    });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: { resetToken }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed. Please try again.'
    });
  }
});

// 5. Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { password } = req.body;
    const authHeader = req.headers.authorization;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.name === 'TokenExpiredError' ? 'Reset token expired' : 'Invalid reset token'
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password
    user.password = password;
    await user.save();

    // Clear any existing reset fields and login attempts
    await User.findByIdAndUpdate(user._id, {
      resetOTP: null,
      resetOTPExpiry: null,
      resetAttempts: 0,
      loginAttempts: 0,
      lockUntil: null
    });

    // Send confirmation email
    try {
      const transporter = createTransporter();
      const mailOptions = {
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to: user.userEmail,
        subject: 'Password Reset Successful - Your App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Password Reset Successful</h2>
            <p>Hello <strong>${user.userName}</strong>,</p>
            <p>Your password has been successfully reset.</p>
            <p>If you didn't make this change, please contact our support team immediately.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.warn('Failed to send confirmation email:', emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed. Please try again.'
    });
  }
});

// 6. Resend OTP
router.post('/resend-otp', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ userEmail: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      resetOTP: otp,
      resetOTPExpiry: otpExpiry,
      resetAttempts: 0
    });

    // Send email
    const transporter = createTransporter();
    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'New OTP for Password Reset - Your App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New OTP for Password Reset</h2>
          <p>Hello <strong>${user.userName}</strong>,</p>
          <p>Here's your new OTP for password reset:</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p><strong>Important:</strong> This OTP will expire in 10 minutes.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'New OTP sent successfully'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP. Please try again.'
    });
  }
});

// 7. Refresh Token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password');

    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// 8. Get Current User Profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -resetOTP -resetOTPExpiry');

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile'
    });
  }
});

// 9. Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a production environment, you might want to blacklist the token
    // For now, we'll just send a success response
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

module.exports = router;