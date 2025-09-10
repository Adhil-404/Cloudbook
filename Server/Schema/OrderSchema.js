const mongoose = require('mongoose');

// Order Schema (using your existing schema)
const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    customerName: {
        type: String,
        default: 'Guest User'
    },
    customerEmail: {
        type: String,
        required: true
    },
    items: [{
        _id: String,
        title: String,
        author: String,
        price: Number,
        quantity: Number,
        coverImage: String,
        category: String
    }],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    itemCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'confirmed'
    },
    paymentMethod: {
        type: String,
        default: 'N/A'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'India' }
    }
}, {
    timestamps: true
});


orderSchema.index({ userId: 1 });
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ orderDate: -1 });

module.exports = mongoose.model('Order', orderSchema);