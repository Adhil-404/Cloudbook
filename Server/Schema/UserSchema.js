const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true,
    unique: true
  },
  contact: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other'] 
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'blocked', 'suspended', 'deleted'],
    default: 'active'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  deletedAt: {
    type: Date,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for better performance
userSchema.index({ userEmail: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

// Don't return soft-deleted users by default
userSchema.pre(/^find/, function() {
  if (!this.getOptions().includeDeleted) {
    this.find({ deletedAt: null });   // ✅ FIXED
  }
});

module.exports = mongoose.model('User', userSchema);
