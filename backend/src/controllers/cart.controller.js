const cartService = require('../services/cart.service');

class CartController {
  async getCart(req, res) {
    try {
      const cart = await cartService.getCart(req.user.id);
      res.status(200).json({
        success: true,
        data: cart
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  async addItem(req, res) {
    try {
      const { productId, quantity } = req.body;
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'productId is required'
        });
      }

      const cart = await cartService.addItem(req.user.id, productId, quantity || 1);
      res.status(200).json({
        success: true,
        message: 'Item added to cart',
        data: cart
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async updateItem(req, res) {
    try {
      const { productId, quantity } = req.body;
      if (!productId || quantity === undefined) {
        return res.status(400).json({
          success: false,
          message: 'productId and quantity are required'
        });
      }

      const cart = await cartService.updateItem(req.user.id, productId, quantity);
      res.status(200).json({
        success: true,
        message: 'Cart updated',
        data: cart
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async removeItem(req, res) {
    try {
      const { productId } = req.params;
      const cart = await cartService.removeItem(req.user.id, productId);
      res.status(200).json({
        success: true,
        message: 'Item removed from cart',
        data: cart
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async clearCart(req, res) {
    try {
      const cart = await cartService.clearCart(req.user.id);
      res.status(200).json({
        success: true,
        message: 'Cart cleared',
        data: cart
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
}

module.exports = new CartController();
