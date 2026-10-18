const authService = require('../services/auth.service');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, phone } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required.'
        });
      }
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long.'
        });
      }

      const result = await authService.register({ name, email, password, phone });
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: result
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required.'
        });
      }

      const result = await authService.login({ email, password });
      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: result
      });
    } catch (err) {
      res.status(401).json({
        success: false,
        message: err.message
      });
    }
  }

  async getProfile(req, res) {
    try {
      const profile = await authService.getProfile(req.user.id);
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (err) {
      res.status(404).json({
        success: false,
        message: err.message
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const profile = await authService.updateProfile(req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: profile
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }
}

module.exports = new AuthController();
