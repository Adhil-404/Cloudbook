const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/OrderController');
const authenticateUser = require('../Middleware/authenticateUser');

router.post('/', authenticateUser, orderController.createOrder);
router.get('/', authenticateUser, orderController.getAllOrders);
router.get('/:id', authenticateUser, orderController.getOrderById);

module.exports = router;