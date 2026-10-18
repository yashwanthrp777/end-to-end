const productService = require('../services/product.service');

class ProductController {
  async getProducts(req, res) {
    try {
      const result = await productService.getAllProducts(req.query);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  async getFeaturedProducts(req, res) {
    try {
      const products = await productService.getFeaturedProducts();
      res.status(200).json({
        success: true,
        data: products
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductByIdentifier(req.params.id);
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (err) {
      res.status(404).json({
        success: false,
        message: err.message
      });
    }
  }

  async getCategories(req, res) {
    try {
      const categories = await productService.getCategories();
      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
}

module.exports = new ProductController();
