const express = require('express');
const router = express.Router();
const upload = require('../Middleware/Upload');
const { addBook , deleteBook } = require("../Controllers/BookController");
const { getBookById, updateBook } = require('../Controllers/BookController');

const Book = require('../Schema/BookSchema');
const Order = require('../Schema/OrderSchema');
const User = require('../Schema/UserSchema');

router.post('/addbook', upload.single('coverImage'), addBook); 
router.get('/allbooks', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books' });
  }
});

router.get('/test', (req, res) => {
  res.send('API is working!');
});

router.delete('/deletebook/:id', deleteBook);
router.get('/book/:id', getBookById);
router.put('/updatebook/:id', upload.single('coverImage'), updateBook);

router.get('/admin/orders', async (req, res) => {
    try {
        console.log('Fetching orders...');
        const orders = await Order.find()
            .populate('userId', 'name email username')
            .sort({ orderDate: -1 });

        console.log('Orders found:', orders.length);

        const formattedOrders = orders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            customerName: order.userId?.name || order.userId?.username || 'User',
            customerEmail: order.userId?.email || 'N/A',
            items: order.items || [],
            itemCount: order.itemCount || order.items?.length || 0,
            totalAmount: order.totalAmount,
            status: order.status,
            orderDate: order.orderDate || order.createdAt,
            paymentMethod: order.paymentMethod || 'N/A'
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ 
            message: 'Error fetching orders',
            error: error.message
        });
    }
});

router.put('/admin/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log('Updating order:', id, 'to status:', status);

        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
});

router.get('/admin/users', async (req, res) => {
    try {
        console.log('Fetching users...');
        const users = await User.find().sort({ createdAt: -1 });
        console.log('Users found:', users.length);
        
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const orders = await Order.find({ userId: user._id });
                const totalOrders = orders.length;
                const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

                return {
                    _id: user._id,
                    name: user.name || user.username || 'Unknown',
                    email: user.email,
                    phone: user.phone,
                    status: user.status || 'active',
                    totalOrders,
                    totalSpent,
                    createdAt: user.createdAt,
                    joinDate: user.createdAt
                };
            })
        );

        res.json(usersWithStats);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

router.put('/admin/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User status updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user status' });
    }
});

router.delete('/admin/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
});

module.exports = router;