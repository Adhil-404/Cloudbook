const Order = require('../Schema/OrderSchema');

const orderController = {
  async createOrder(req, res) {
    try {
      const { items, totalAmount, itemCount } = req.body;
      const userId = req.user._id;

      if (!items || items.length === 0) {
        return res.status(400).json({ 
          message: 'Order must contain at least one item' 
        });
      }

      const newOrder = new Order({
        userId,
        items,
        totalAmount,
        itemCount
      });
      
      const savedOrder = await newOrder.save();
      
      res.status(201).json({
        message: 'Order placed successfully',
        order: savedOrder
      });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({
        message: 'Failed to place order',
        error: error.message
      });
    }
  },

  async getAllOrders(req, res) {
    try {
      const orders = await Order.find({ userId: req.user._id }).sort({ orderDate: -1 });
      res.status(200).json(orders);
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        message: 'Failed to fetch orders',
        error: error.message
      });
    }
  },

  async getOrderById(req, res) {
    try {
      const order = await Order.findOne({ 
        _id: req.params.id, 
        userId: req.user._id 
      });
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.status(200).json(order);
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({
        message: 'Failed to fetch order',
        error: error.message
      });
    }
  }
};

module.exports = orderController;