const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

// All admin routes require authenticated admin
router.use(authenticateToken, requireAdmin);

router.get('/dashboard', adminController.getDashboardSummary);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

router.get('/orders', adminController.getOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

router.get('/customers', adminController.getCustomers);

module.exports = router;
