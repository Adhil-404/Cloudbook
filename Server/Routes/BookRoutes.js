const express = require('express');
const router = express.Router();
const upload = require('../Middleware/Upload');
const { addBook, deleteBook } = require("../Controllers/BookController");
const { getBookById, updateBook } = require('../Controllers/BookController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

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
            .populate('userId', 'name email username')
            .sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

router.put('/orders/:id', async (req, res) => {
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
            customerName: order.userId?.name || order.userId?.username || 'Guest User',
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

router.get('/admin/users', async (req, res) => {
    try {
        console.log('Fetching all users for admin...');
        
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                try {
                    const userOrders = await Order.find({ 
                        $or: [
                            { userId: user._id },
                            { customerEmail: user.userEmail }
                        ]
                    });

                    const totalOrders = userOrders.length;
                    const totalSpent = userOrders.reduce((sum, order) => {
                        return sum + (order.totalAmount || 0);
                    }, 0);

                    const lastLogin = user.lastLogin || user.updatedAt;

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
                        lastLogin,
                        updatedAt: user.updatedAt
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
                        updatedAt: user.updatedAt
                    };
                }
            })
        );

        console.log(`Successfully fetched ${usersWithStats.length} users`);
        res.json(usersWithStats);

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            message: 'Error fetching users', 
            error: error.message 
        });
    }
});

router.get('/admin/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching user details for:', id);

        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userOrders = await Order.find({ 
            $or: [
                { userId: user._id },
                { customerEmail: user.userEmail }
            ]
        }).sort({ createdAt: -1 });

        const totalOrders = userOrders.length;
        const totalSpent = userOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const pendingOrders = userOrders.filter(order => order.status === 'pending').length;
        const completedOrders = userOrders.filter(order => order.status === 'delivered').length;
        
        const recentOrders = userOrders.slice(0, 5).map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt
        }));

        const userWithStats = {
            _id: user._id,
            userName: user.userName,
            userEmail: user.userEmail,
            contact: user.contact,
            dob: user.dob,
            gender: user.gender,
            status: user.status || 'active',
            totalOrders,
            totalSpent: Math.round(totalSpent * 100) / 100,
            pendingOrders,
            completedOrders,
            recentOrders,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin || user.updatedAt,
            updatedAt: user.updatedAt
        };

        res.json(userWithStats);

    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ 
            message: 'Error fetching user details', 
            error: error.message 
        });
    }
});

router.put('/admin/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, userName, contact, ...otherUpdates } = req.body;

        console.log('Updating user:', id, 'with data:', req.body);

        if (status && !['active', 'blocked', 'suspended'].includes(status)) {
            return res.status(400).json({ 
                message: 'Invalid status. Must be active, blocked, or suspended' 
            });
        }

        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (status !== undefined) user.status = status;
        if (userName !== undefined) user.userName = userName;
        if (contact !== undefined) user.contact = contact;

        const safeUpdates = ['userName', 'contact', 'status', 'dob', 'gender'];
        safeUpdates.forEach(field => {
            if (otherUpdates[field] !== undefined) {
                user[field] = otherUpdates[field];
            }
        });

        user.updatedAt = new Date();
        await user.save();

        console.log('User updated successfully:', user._id);

        const updatedUser = await User.findById(id).select('-password');
        res.json({
            message: 'User updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ 
            message: 'Error updating user', 
            error: error.message 
        });
    }
});

router.delete('/admin/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { permanent = false } = req.query;

        console.log('Deleting user:', id, 'permanent:', permanent);

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (permanent === 'true') {
            await Order.deleteMany({ 
                $or: [
                    { userId: id },
                    { customerEmail: user.userEmail }
                ]
            });
            await User.findByIdAndDelete(id);
            console.log('User permanently deleted:', id);
            res.json({ message: 'User permanently deleted' });
        } else {
            user.status = 'deleted';
            user.deletedAt = new Date();
            user.userEmail = `deleted_${Date.now()}_${user.userEmail}`;
            await user.save();
            
            console.log('User soft deleted:', id);
            res.json({ message: 'User deleted successfully' });
        }

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ 
            message: 'Error deleting user', 
            error: error.message 
        });
    }
});

router.post('/admin/users/:id/restore', async (req, res) => {
    try {
        const { id } = req.params;

        console.log('Restoring user:', id);

        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.status !== 'deleted') {
            return res.status(400).json({ message: 'User is not deleted' });
        }

        user.status = 'active';
        user.deletedAt = null;
        
        if (user.userEmail.startsWith('deleted_')) {
            const originalEmail = user.userEmail.substring(user.userEmail.lastIndexOf('_') + 1);
            user.userEmail = originalEmail;
        }
        
        await user.save();

        console.log('User restored successfully:', id);
        res.json({ 
            message: 'User restored successfully',
            user: await User.findById(id).select('-password')
        });

    } catch (error) {
        console.error('Error restoring user:', error);
        res.status(500).json({ 
            message: 'Error restoring user', 
            error: error.message 
        });
    }
});

router.get('/admin/users/stats/overview', async (req, res) => {
    try {
        console.log('Fetching user statistics overview...');

        const [
            totalUsers,
            activeUsers,
            blockedUsers,
            newUsersThisMonth,
            totalOrders,
            totalRevenue
        ] = await Promise.all([
            User.countDocuments({}),
            User.countDocuments({ status: { $ne: 'blocked' } }),
            User.countDocuments({ status: 'blocked' }),
            User.countDocuments({
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }),
            Order.countDocuments({}),
            Order.aggregate([
                { $match: { status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ])
        ]);

        const stats = {
            totalUsers,
            activeUsers,
            blockedUsers,
            newUsersThisMonth,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            averageOrdersPerUser: totalUsers > 0 ? Math.round((totalOrders / totalUsers) * 100) / 100 : 0
        };

        console.log('User statistics:', stats);
        res.json(stats);

    } catch (error) {
        console.error('Error fetching user statistics:', error);
        res.status(500).json({ 
            message: 'Error fetching user statistics', 
            error: error.message 
        });
    }
});

module.exports = router;