const Order = require('../Schema/OrderSchema');

const orderController = {
  async createOrder(req, res) {
    try {
      const { items, totalAmount, itemCount, orderNumber, paymentMethod } = req.body;
      const userId = req.user._id;

      if (!items || items.length === 0) {
        return res.status(400).json({ 
          message: 'Order must contain at least one item' 
        });
      }

      // Generate order number if not provided
      const generatedOrderNumber = orderNumber || `ORD-${Date.now()}-${userId}`;

      const newOrder = new Order({
        userId,
        orderNumber: generatedOrderNumber,
        items,
        totalAmount,
        itemCount: itemCount || items.length,
        paymentMethod: paymentMethod || 'N/A',
        customerName: req.user.name || req.user.username || 'Guest User',
        customerEmail: req.user.email || 'guest@example.com'
      });
      
      const savedOrder = await newOrder.save();
      
      res.status(201).json({
        message: 'Order placed successfully',
        order: savedOrder
      });
    } catch (error) {
      console.error('Order creation error:', error);
      
      // Handle duplicate order number error
      if (error.code === 11000) {
        return res.status(400).json({
          message: 'Order already exists',
          error: 'Duplicate order number'
        });
      }
      
      res.status(500).json({
        message: 'Failed to place order',
        error: error.message
      });
    }
  },

  async getAllOrders(req, res) {
    try {
      const orders = await Order.find({ userId: req.user._id })
        .sort({ orderDate: -1 })
        .lean(); // Use lean() for better performance
      
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
      }).lean();
      
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
  },

  // NEW: Update order status method
  async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Validate status
      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status',
          validStatuses
        });
      }

      const updatedOrder = await Order.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        { status },
        { new: true, runValidators: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json({
        message: 'Order updated successfully',
        order: updatedOrder
      });
    } catch (error) {
      console.error('Update order error:', error);
      res.status(500).json({
        message: 'Failed to update order',
        error: error.message
      });
    }
  },

  // NEW: Delete order method
  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      
      const deletedOrder = await Order.findOneAndDelete({
        _id: id,
        userId: req.user._id,
        status: { $in: ['cancelled', 'delivered'] } // Only allow deletion of cancelled or delivered orders
      });

      if (!deletedOrder) {
        return res.status(404).json({ 
          message: 'Order not found or cannot be deleted' 
        });
      }

      res.status(200).json({
        message: 'Order deleted successfully'
      });
    } catch (error) {
      console.error('Delete order error:', error);
      res.status(500).json({
        message: 'Failed to delete order',
        error: error.message
      });
    }
  }
};

module.exports = orderController;