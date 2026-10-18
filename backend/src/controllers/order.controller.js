const orderService = require('../services/order.service');

class OrderController {
  async createOrder(req, res) {
    try {
      const { shipping, paymentMethod, items, notes } = req.body;
      const result = await orderService.createOrder(req.user.id, {
        shipping,
        paymentMethod,
        items,
        notes
      });

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: result
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async getMyOrders(req, res) {
    try {
      const orders = await orderService.getUserOrders(req.user.id);
      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  async getOrderDetails(req, res) {
    try {
      const order = await orderService.getOrderById(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (err) {
      res.status(404).json({
        success: false,
        message: err.message
      });
    }
  }

  async cancelOrder(req, res) {
    try {
      const order = await orderService.cancelOrder(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: order
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async trackOrder(req, res) {
    try {
      const tracking = await orderService.trackOrder(req.params.orderNumber);
      res.status(200).json({
        success: true,
        data: tracking
      });
    } catch (err) {
      res.status(404).json({
        success: false,
        message: err.message
      });
    }
  }
}

module.exports = new OrderController();
