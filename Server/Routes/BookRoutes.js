const express = require('express');
const router = express.Router();
const upload = require('../Middleware/Upload');
const adminAuth = require('../Middleware/adminAuth');
const { addBook, deleteBook } = require("../Controllers/BookController");
const { getBookById, updateBook } = require('../Controllers/BookController');

const Book = require('../Schema/BookSchema');
const Order = require('../Schema/OrderSchema');
const User = require('../Schema/UserSchema');

// Admin login route - MUST be before adminAuth middleware
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Admin login attempt:', email);
        
        const hardcodedAdminEmail = 'admin@bookstore.com';
        const hardcodedAdminPassword = 'admin123';
        
        if (email === hardcodedAdminEmail && password === hardcodedAdminPassword) {
            const jwt = require('jsonwebtoken');
            const adminToken = jwt.sign(
                { 
                    _id: 'admin_001', 
                    email: hardcodedAdminEmail,
                    role: 'admin' 
                },
                process.env.JWT_KEY || 'your-secret-key', // Add fallback
                { expiresIn: '24h' }
            );
            
            console.log('Admin login successful, token generated:', adminToken);
            res.json({
                message: 'Admin login successful',
                token: adminToken,
                admin: {
                    _id: 'admin_001',
                    email: hardcodedAdminEmail,
                    role: 'admin'
                }
            });
        } else {
            console.log('Invalid admin credentials');
            res.status(401).json({ message: 'Invalid admin credentials' });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error during admin login' });
    }
});

// Book routes
router.post('/addbook', adminAuth, upload.single('coverImage'), addBook);
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

router.delete('/deletebook/:id', adminAuth, deleteBook);
router.get('/book/:id', getBookById);
router.put('/updatebook/:id', adminAuth, upload.single('coverImage'), updateBook);

// Order routes
router.post('/orders', async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = new Order({
            orderNumber: orderData.orderNumber || 'ORD' + Date.now(),
            items: orderData.items,
            userId: orderData.userId || null,
            totalAmount: orderData.totalAmount,
            itemCount: orderData.itemCount,
            status: orderData.status || 'confirmed',
            orderDate: orderData.orderDate || new Date()
        });

        const savedOrder = await newOrder.save();
        res.json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'userName userEmail contact')
            .sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

router.put('/orders/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Error updating order' });
    }
});

// Admin order routes
router.get('/admin/orders', adminAuth, async (req, res) => {
    try {
        console.log('Fetching orders for admin...');
        const orders = await Order.find()
            .populate('userId', 'userName userEmail contact')
            .sort({ orderDate: -1 });

        console.log('Orders found:', orders.length);

        const formattedOrders = orders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            customerName: order.userId?.userName || 'Guest User',
            customerEmail: order.userId?.userEmail || 'N/A',
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

router.put('/admin/orders/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log('Updating order:', id, 'to status:', status);

        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
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

router.get('/users', adminAuth, async (req, res) => {
    try {
        console.log('Admin fetching all users...');
        console.log('Admin token from request:', req.headers.authorization);
        
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        console.log(`Found ${users.length} users in database`);

        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                try {
                 
                    const userOrders = await Order.find({ 
                        $or: [
                            { userId: user._id },
                            { userId: user._id.toString() },
                            { customerEmail: user.userEmail },
                            { 'customerEmail': { $regex: new RegExp(user.userEmail, 'i') } }
                        ]
                    }).sort({ orderDate: -1 });

                    console.log(`User ${user.userEmail} has ${userOrders.length} orders`);

                    const totalOrders = userOrders.length;
                    const totalSpent = userOrders.reduce((sum, order) => {
                        return sum + (order.totalAmount || 0);
                    }, 0);

                    return {
                        _id: user._id,
                        userName: user.userName,
                        userEmail: user.userEmail,
                        contact: user.contact,
                        dob: user.dob,
                        gender: user.gender,
                        status: user.status || 'active',
                        totalOrders,
                        totalSpent: Math.round(totalSpent * 100) / 100,
                        createdAt: user.createdAt,
                        joinDate: user.createdAt,
                        lastLogin: user.lastLogin || user.updatedAt,
                        updatedAt: user.updatedAt,
                        orders: userOrders.map(order => ({
                            _id: order._id,
                            orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-6)}`,
                            totalAmount: order.totalAmount || 0,
                            status: order.status || 'pending',
                            orderDate: order.orderDate || order.createdAt,
                            items: order.items || [],
                            itemCount: order.itemCount || order.items?.length || 0,
                            paymentMethod: order.paymentMethod || 'N/A',
                            createdAt: order.createdAt
                        }))
                    };
                } catch (error) {
                    console.error(`Error processing user ${user._id}:`, error);
                    return {
                        _id: user._id,
                        userName: user.userName,
                        userEmail: user.userEmail,
                        contact: user.contact,
                        dob: user.dob,
                        gender: user.gender,
                        status: user.status || 'active',
                        totalOrders: 0,
                        totalSpent: 0,
                        createdAt: user.createdAt,
                        joinDate: user.createdAt,
                        lastLogin: user.lastLogin || user.updatedAt,
                        updatedAt: user.updatedAt,
                        orders: []
                    };
                }
            })
        );

        console.log(`Successfully processed ${usersWithStats.length} users for admin`);
        res.json(usersWithStats);

    } catch (error) {
        console.error('Error fetching users:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Error fetching users', 
            error: error.message 
        });
    }
});


router.get('/users/:id/orders', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Admin fetching orders for user:', id);

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userOrders = await Order.find({ 
            $or: [
                { userId: user._id },
                { userId: user._id.toString() },
                { customerEmail: user.userEmail },
                { 'customerEmail': { $regex: new RegExp(user.userEmail, 'i') } }
            ]
        }).sort({ orderDate: -1 });

        const formattedOrders = userOrders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-6)}`,
            totalAmount: order.totalAmount || 0,
            status: order.status || 'pending',
            orderDate: order.orderDate || order.createdAt,
            items: order.items || [],
            itemCount: order.itemCount || order.items?.length || 0,
            paymentMethod: order.paymentMethod || 'N/A',
            createdAt: order.createdAt
        }));

        res.json({
            user: {
                _id: user._id,
                userName: user.userName,
                userEmail: user.userEmail
            },
            orders: formattedOrders,
            totalOrders: formattedOrders.length,
            totalSpent: formattedOrders.reduce((sum, order) => sum + order.totalAmount, 0)
        });

    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ 
            message: 'Error fetching user orders', 
            error: error.message 
        });
    }
});


router.post('/orders', async (req, res) => {
    try {
        const orderData = req.body;
        console.log('Creating order with data:', orderData);

        let userId = orderData.userId;
        if (!userId && orderData.customerEmail) {
            const user = await User.findOne({ userEmail: orderData.customerEmail });
            if (user) {
                userId = user._id;
            }
        }

        const newOrder = new Order({
            orderNumber: orderData.orderNumber || `ORD-${Date.now()}`,
            items: orderData.items || [],
            userId: userId,
            customerName: orderData.customerName,
            customerEmail: orderData.customerEmail,
            totalAmount: orderData.totalAmount || 0,
            itemCount: orderData.itemCount || orderData.items?.length || 0,
            status: orderData.status || 'confirmed',
            orderDate: orderData.orderDate || new Date(),
            paymentMethod: orderData.paymentMethod || 'N/A'
        });

        const savedOrder = await newOrder.save();
        console.log('Order created successfully:', savedOrder._id);
        
        res.json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
});










module.exports = router;