const adminService = require('../services/admin.service');

class AdminController {
  async getDashboardSummary(req, res) {
    try {
      const summary = await adminService.getSummaryStats();
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  async createProduct(req, res) {
    try {
      const product = await adminService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await adminService.updateProduct(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await adminService.deleteProduct(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        data: product
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async getOrders(req, res) {
    try {
      const orders = await adminService.getAllOrders(req.query);
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

  async updateOrderStatus(req, res) {
    try {
      const order = await adminService.updateOrderStatus(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: order
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async getCustomers(req, res) {
    try {
      const customers = await adminService.getAllCustomers();
      res.status(200).json({
        success: true,
        data: customers
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
}

module.exports = new AdminController();
