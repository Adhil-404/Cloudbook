const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    default: function () {
      return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
    }
  },
  items: [{
    id: String,
    title: String,
    author: String,
    category: String,
    price: Number,
    quantity: Number,
    coverImage: mongoose.Schema.Types.Mixed
  }],

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },
  itemCount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);