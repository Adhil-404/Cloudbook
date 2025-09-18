const express = require('express');
const router = express.Router();

const orderController = require('../Controllers/OrderController');
const authenticateUser = require('../Middleware/authenticateUser');

router.post('/', authenticateUser, orderController.createOrder);
router.get('/', authenticateUser, orderController.getAllOrders);
router.get('/:id', authenticateUser, orderController.getOrderById);
router.put('/:id', authenticateUser, orderController.updateOrder);
router.delete('/:id', authenticateUser, orderController.deleteOrder);

module.exports = router;