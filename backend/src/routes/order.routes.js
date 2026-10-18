const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateToken } = require('../middleware/auth');

// Public order tracking by tracking/order number
router.get('/track/:orderNumber', orderController.trackOrder);

// Authenticated user order actions
router.post('/checkout', authenticateToken, orderController.createOrder);
router.get('/my-orders', authenticateToken, orderController.getMyOrders);
router.get('/:id', authenticateToken, orderController.getOrderDetails);
router.put('/:id/cancel', authenticateToken, orderController.cancelOrder);

module.exports = router;
