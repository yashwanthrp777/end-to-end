const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticateToken } = require('../middleware/auth');

// All cart routes require authenticated session
router.use(authenticateToken);

router.get('/', cartController.getCart);
router.post('/add', cartController.addItem);
router.put('/update', cartController.updateItem);
router.delete('/remove/:productId', cartController.removeItem);
router.delete('/clear', cartController.clearCart);

module.exports = router;
