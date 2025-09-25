const express = require('express');
const router = express.Router();
const upload = require('../Middleware/Upload');
const adminAuth = require('../Middleware/adminAuth');
const { addBook, deleteBook, getBookById, updateBook } = require("../Controllers/BookController");

const Book = require('../Schema/BookSchema');
const Order = require('../Schema/OrderSchema');
const User = require('../Schema/UserSchema');

// Test route - MUST be public
router.get('/test', (req, res) => {
    res.json({ 
        message: 'API is working!', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Admin login route - MUST be before adminAuth middleware
router.post('/admin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Admin login attempt:', email);
        
        const hardcodedAdminEmail = 'admin@cloudbook.com';
        const hardcodedAdminPassword = 'admin123';
        
        if (email === hardcodedAdminEmail && password === hardcodedAdminPassword) {
            const jwt = require('jsonwebtoken');
            const adminToken = jwt.sign(
                { 
                    _id: 'admin_001', 
                    email: hardcodedAdminEmail,
                    role: 'admin',
                    isAdmin: true
                },
                process.env.JWT_KEY || 'your-secret-key',
                { expiresIn: '30d' }
            );
            
            console.log('Admin login successful, token generated');
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

// ====== BOOK MANAGEMENT ROUTES (Admin Only) ======
router.post('/addbook', adminAuth, upload.single('coverImage'), addBook);
router.delete('/deletebook/:id', adminAuth, deleteBook);
router.put('/updatebook/:id', adminAuth, upload.single('coverImage'), updateBook);

// Public book routes (no auth required)
router.get('/allbooks', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ message: 'Error fetching books' });
    }
});

router.get('/book/:id', getBookById);

// ====== ADMIN USER MANAGEMENT ROUTES ======
router.get('/users', adminAuth, async (req, res) => {
    try {
        console.log('=== Admin Users API Called ===');
        console.log('Admin user from token:', req.admin);
        
        // Get all users (excluding password)
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        console.log(`Found ${users.length} users in database`);

        // Get all orders for statistics
        const allOrders = await Order.find({});
        console.log(`Found ${allOrders.length} total orders`);

        // Calculate user statistics
        const usersWithStats = users.map(user => {
            // Find orders for this user
            const userOrders = allOrders.filter(order => {
                return (
                    (order.userId && order.userId.toString() === user._id.toString()) ||
                    (order.customerEmail && user.userEmail && 
                     order.customerEmail.toLowerCase() === user.userEmail.toLowerCase())
                );
            });

            const totalOrders = userOrders.length;
            const totalSpent = userOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

            console.log(`User ${user.userEmail}: ${totalOrders} orders, ₹${totalSpent} spent`);

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
                updatedAt: user.updatedAt,
                orders: userOrders.map(order => ({
                    _id: order._id,
                    orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-6)}`,
                    totalAmount: Number(order.totalAmount) || 0,
                    status: order.status || 'pending',
                    orderDate: order.orderDate || order.createdAt,
                    items: order.items || [],
                    itemCount: order.itemCount || order.items?.length || 0
                }))
            };
        });

        console.log(`Successfully processed ${usersWithStats.length} users for admin`);
        res.json(usersWithStats);

    } catch (error) {
        console.error('Error in admin users endpoint:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Error fetching users', 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Get specific user details
router.get('/users/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching user details for:', id);

        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get all orders for this user
        const userOrders = await Order.find({ 
            $or: [
                { userId: user._id },
                { customerEmail: user.userEmail }
            ]
        }).sort({ orderDate: -1 });

        const userWithFullDetails = {
            ...user.toObject(),
            totalOrders: userOrders.length,
            totalSpent: userOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0),
            orders: userOrders.map(order => ({
                _id: order._id,
                orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-6)}`,
                totalAmount: Number(order.totalAmount) || 0,
                status: order.status || 'pending',
                orderDate: order.orderDate || order.createdAt,
                items: order.items || [],
                itemCount: order.itemCount || order.items?.length || 0
            }))
        };

        res.json(userWithFullDetails);

    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ 
            message: 'Error fetching user details',
            error: error.message
        });
    }
});

// Update user status
router.put('/users/:id/status', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(`Admin updating user ${id} status to ${status}`);

        const validStatuses = ['active', 'blocked', 'suspended'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: 'Invalid status value',
                validStatuses
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { 
                status: status,
                updatedAt: new Date()
            },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`User ${id} status updated to ${status}`);
        res.json({
            message: 'User status updated successfully',
            user: user
        });

    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ 
            message: 'Error updating user status',
            error: error.message
        });
    }
});

// Delete user (soft delete)
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Admin deleting user: ${id}`);

        const user = await User.findByIdAndUpdate(
            id,
            { 
                status: 'deleted',
                deletedAt: new Date(),
                updatedAt: new Date()
            },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`User ${id} marked as deleted`);
        res.json({
            message: 'User deleted successfully',
            user: user
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ 
            message: 'Error deleting user',
            error: error.message
        });
    }
});

// ====== ADMIN ORDER MANAGEMENT ROUTES ======
router.get('/orders', adminAuth, async (req, res) => {
    try {
        console.log('=== Admin Orders API Called ===');
        console.log('Admin user from token:', req.admin);
        
        const orders = await Order.find()
            .populate('userId', 'userName userEmail contact')
            .sort({ orderDate: -1, createdAt: -1 });

        console.log(`Found ${orders.length} orders in database`);

        const formattedOrders = orders.map(order => {
            const formattedOrder = {
                _id: order._id,
                orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-6)}`,
                customerName: order.userId?.userName || order.customerName || 'Guest User',
                customerEmail: order.userId?.userEmail || order.customerEmail || 'N/A',
                items: Array.isArray(order.items) ? order.items : [],
                itemCount: order.itemCount || order.items?.length || 0,
                totalAmount: Number(order.totalAmount) || 0,
                status: order.status || 'pending',
                orderDate: order.orderDate || order.createdAt,
                paymentMethod: order.paymentMethod || 'N/A'
            };
            
            console.log(`Order ${formattedOrder.orderNumber}: ${formattedOrder.itemCount} items, ₹${formattedOrder.totalAmount}`);
            return formattedOrder;
        });

        console.log(`Successfully formatted ${formattedOrders.length} orders for admin`);
        res.json(formattedOrders);
        
    } catch (error) {
        console.error('Error in admin orders endpoint:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Error fetching orders',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Update order status (admin only)
router.put('/orders/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(`Admin updating order ${id} status to ${status}`);

        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: 'Invalid status',
                validStatuses
            });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date() },
            { new: true }
        ).populate('userId', 'userName userEmail');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log(`Order ${id} status updated to ${status}`);
        res.json({ 
            message: 'Order status updated successfully', 
            order: {
                _id: order._id,
                orderNumber: order.orderNumber,
                status: order.status,
                totalAmount: order.totalAmount,
                customerName: order.userId?.userName || order.customerName,
                updatedAt: order.updatedAt
            }
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ 
            message: 'Error updating order status',
            error: error.message
        });
    }
});

// Delete order (admin only)
router.delete('/orders/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Admin deleting order: ${id}`);

        const order = await Order.findByIdAndDelete(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log(`Order ${id} deleted successfully`);
        res.json({
            message: 'Order deleted successfully',
            orderId: id
        });

    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ 
            message: 'Error deleting order',
            error: error.message
        });
    }
});

// ====== PUBLIC ORDER ROUTES (No Auth Required) ======
// Create order (for frontend checkout)
router.post('/orders', async (req, res) => {
    try {
        const orderData = req.body;
        console.log('Creating new order:', orderData);

        // Find user if email is provided
       // IMPROVED CODE:
let userId = orderData.userId;
let customerName = orderData.customerName || 'Guest User';
let customerEmail = orderData.customerEmail || '';

// Find user if email is provided
if (!userId && orderData.customerEmail) {
    const user = await User.findOne({ userEmail: orderData.customerEmail });
    if (user) {
        userId = user._id;
        customerName = user.userName; // Use actual user name
        customerEmail = user.userEmail; // Use actual user email
        console.log('Found registered user for order:', user.userEmail);
    }
}

        // Create order with generated order number if not provided
        const orderNumber = orderData.orderNumber || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

       const newOrder = new Order({
    orderNumber,
    items: Array.isArray(orderData.items) ? orderData.items : [],
    userId: userId || null,
    customerName: customerName, // This will now be the real user name if found
    customerEmail: customerEmail, // This will now be the real user email
    totalAmount: Number(orderData.totalAmount) || 0,
    itemCount: orderData.itemCount || orderData.items?.length || 0,
    status: orderData.status || 'confirmed',
    orderDate: orderData.orderDate || new Date(),
    paymentMethod: orderData.paymentMethod || 'N/A',
    shippingAddress: orderData.shippingAddress || {}
});

        const savedOrder = await newOrder.save();
        console.log('Order created successfully:', savedOrder._id);
        
        res.status(201).json({
            message: 'Order created successfully',
            order: {
                _id: savedOrder._id,
                orderNumber: savedOrder.orderNumber,
                status: savedOrder.status,
                totalAmount: savedOrder.totalAmount,
                orderDate: savedOrder.orderDate
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            message: 'Error creating order', 
            error: error.message
        });
    }
});

// Get public orders (for user order history - no auth required for now)
router.get('/orders/public', async (req, res) => {
    try {
        const { userEmail, userId } = req.query;
        
        let query = {};
        if (userId) {
            query.userId = userId;
        } else if (userEmail) {
            query.customerEmail = userEmail;
        } else {
            return res.status(400).json({ message: 'userEmail or userId required' });
        }

        const orders = await Order.find(query)
            .sort({ orderDate: -1 });
            
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ 
            message: 'Error fetching orders',
            error: error.message
        });
    }
});

// ====== DEPRECATED ROUTES (Keep for backward compatibility) ======
// These routes are duplicates but might be used by frontend
// Fixed admin routes - just duplicate the main functionality
router.get('/admin/orders', adminAuth, async (req, res) => {
    try {
        console.log('=== Admin Orders API Called via /admin/orders ===');
        
        const orders = await Order.find()
            .populate('userId', 'userName userEmail contact')
            .sort({ orderDate: -1, createdAt: -1 });

        console.log(`Found ${orders.length} orders in database`);

        const formattedOrders = orders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-6)}`,
            customerName: order.userId?.userName || order.customerName || 'Guest User',
            customerEmail: order.userId?.userEmail || order.customerEmail || 'N/A',
            items: Array.isArray(order.items) ? order.items : [],
            itemCount: order.itemCount || order.items?.length || 0,
            totalAmount: Number(order.totalAmount) || 0,
            status: order.status || 'pending',
            orderDate: order.orderDate || order.createdAt,
            paymentMethod: order.paymentMethod || 'N/A'
        }));

        res.json(formattedOrders);
        
    } catch (error) {
        console.error('Error in admin orders endpoint:', error);
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

        const order = await Order.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date() },
            { new: true }
        ).populate('userId', 'userName userEmail');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ 
            message: 'Order status updated successfully', 
            order: order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ 
            message: 'Error updating order status',
            error: error.message
        });
    }
});

router.get('/test', (req, res) => {
  res.json({
    message: "API is working!",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Add this debug route temporarily
router.get('/debug-orders', async (req, res) => {
    try {
        console.log('Debug: Checking orders in database...');
        const count = await Order.countDocuments();
        const orders = await Order.find().limit(5);
        console.log(`Debug: Found ${count} orders in database`);
        
        res.json({
            totalOrders: count,
            orders: orders,
            message: 'Database connection working'
        });
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({ 
            error: error.message,
            stack: error.stack 
        });
    }
});

// Add this temporary route to BookRoutes.js
router.get('/orders-no-auth', async (req, res) => {
    try {
        console.log('Testing orders without authentication...');
        const orders = await Order.find()
            .populate('userId', 'userName userEmail contact')
            .sort({ orderDate: -1, createdAt: -1 });

        console.log(`Found ${orders.length} orders without auth`);
        res.json(orders);
    } catch (error) {
        console.error('Error without auth:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/fix-orders-index', async (req, res) => {
    try {
        // Drop the old index
        await Order.collection.dropIndex('orderId_1');
        res.json({ message: 'Fixed orderId index' });
    } catch (error) {
        res.json({ message: 'Index might not exist', error: error.message });
    }
});

module.exports = router;