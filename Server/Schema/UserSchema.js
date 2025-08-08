const mongoose = require('mongoose')


 const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('user', userSchema)