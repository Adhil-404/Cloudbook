import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [
    {
      id: String,
      title: String,
      price: Number,
      quantity: Number,
      author: String,
      image: String
    }
  ],
  totalAmount: Number,
  itemCount: Number,
  orderDate: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
