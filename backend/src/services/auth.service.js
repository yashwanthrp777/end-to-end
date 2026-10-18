const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

class AuthService {
  async register({ name, email, password, phone }) {
    const normalizedEmail = email.toLowerCase().trim();

    if (db.isFallback()) {
      const existing = db.memoryStore.users.find(u => u.email === normalizedEmail);
      if (existing) {
        throw new Error('User with this email already exists');
      }

      const password_hash = await bcrypt.hash(password, 10);
      const newUser = {
        id: db.memoryStore.users.length + 1,
        name: name.trim(),
        email: normalizedEmail,
        password_hash,
        role: 'customer',
        phone: phone || '',
        created_at: new Date().toISOString()
      };
      db.memoryStore.users.push(newUser);

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, phone: newUser.phone },
        token
      };
    } else {
      const pool = db.getPool();
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
      if (existing.rows.length > 0) {
        throw new Error('User with this email already exists');
      }

      const password_hash = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, phone, created_at',
        [name.trim(), normalizedEmail, password_hash, 'customer', phone || null]
      );

      const user = result.rows[0];
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return { user, token };
    }
  }

  async login({ email, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    if (db.isFallback()) {
      const user = db.memoryStore.users.find(u => u.email === normalizedEmail);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
        token
      };
    } else {
      const pool = db.getPool();
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
      const user = result.rows[0];

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
        token
      };
    }
  }

  async getProfile(userId) {
    if (db.isFallback()) {
      const user = db.memoryStore.users.find(u => u.id === Number(userId));
      if (!user) throw new Error('User not found');
      return { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone };
    } else {
      const pool = db.getPool();
      const result = await pool.query('SELECT id, name, email, role, phone, created_at FROM users WHERE id = $1', [userId]);
      if (result.rows.length === 0) throw new Error('User not found');
      return result.rows[0];
    }
  }

  async updateProfile(userId, { name, phone }) {
    if (db.isFallback()) {
      const user = db.memoryStore.users.find(u => u.id === Number(userId));
      if (!user) throw new Error('User not found');
      if (name) user.name = name.trim();
      if (phone !== undefined) user.phone = phone;
      return { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone };
    } else {
      const pool = db.getPool();
      const result = await pool.query(
        'UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone), updated_at = NOW() WHERE id = $3 RETURNING id, name, email, role, phone',
        [name, phone, userId]
      );
      return result.rows[0];
    }
  }
}

module.exports = new AuthService();
