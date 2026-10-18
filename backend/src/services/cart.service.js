const db = require('../config/db');

class CartService {
  async getCart(userId) {
    if (db.isFallback()) {
      if (!db.memoryStore.carts[userId]) {
        db.memoryStore.carts[userId] = { id: userId, items: [] };
      }
      const cart = db.memoryStore.carts[userId];
      
      // Populate latest product details and stock
      const populatedItems = cart.items.map(item => {
        const product = db.memoryStore.products.find(p => p.id === item.product_id);
        return {
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          product: product || { name: 'Unknown Product', price: 0, image_url: '', stock: 0 }
        };
      });

      const subtotal = populatedItems.reduce((acc, curr) => acc + (curr.quantity * Number(curr.product.price || 0)), 0);
      const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.00;
      const tax = Number((subtotal * 0.08).toFixed(2));
      const total = Number((subtotal + shipping + tax).toFixed(2));

      return {
        items: populatedItems,
        summary: {
          subtotal: Number(subtotal.toFixed(2)),
          shipping,
          tax,
          total,
          itemCount: populatedItems.reduce((acc, curr) => acc + curr.quantity, 0)
        }
      };
    } else {
      const pool = db.getPool();
      // Ensure cart exists
      let cartRes = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      let cartId;
      if (cartRes.rows.length === 0) {
        const newCart = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
        cartId = newCart.rows[0].id;
      } else {
        cartId = cartRes.rows[0].id;
      }

      const itemsRes = await pool.query(`
        SELECT ci.id, ci.product_id, ci.quantity,
               p.name, p.slug, p.price, p.image_url, p.stock
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = $1
        ORDER BY ci.created_at ASC
      `, [cartId]);

      const items = itemsRes.rows.map(row => ({
        id: row.id,
        product_id: row.product_id,
        quantity: row.quantity,
        product: {
          id: row.product_id,
          name: row.name,
          slug: row.slug,
          price: Number(row.price),
          image_url: row.image_url,
          stock: row.stock
        }
      }));

      const subtotal = items.reduce((acc, curr) => acc + (curr.quantity * Number(curr.product.price || 0)), 0);
      const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.00;
      const tax = Number((subtotal * 0.08).toFixed(2));
      const total = Number((subtotal + shipping + tax).toFixed(2));

      return {
        items,
        summary: {
          subtotal: Number(subtotal.toFixed(2)),
          shipping,
          tax,
          total,
          itemCount: items.reduce((acc, curr) => acc + curr.quantity, 0)
        }
      };
    }
  }

  async addItem(userId, productId, quantity = 1) {
    const qty = Math.max(1, parseInt(quantity, 10));

    if (db.isFallback()) {
      if (!db.memoryStore.carts[userId]) {
        db.memoryStore.carts[userId] = { id: userId, items: [] };
      }
      const cart = db.memoryStore.carts[userId];
      const product = db.memoryStore.products.find(p => p.id === Number(productId));
      if (!product) throw new Error('Product not found');

      const existingItem = cart.items.find(i => i.product_id === Number(productId));
      if (existingItem) {
        existingItem.quantity = Math.min(product.stock, existingItem.quantity + qty);
      } else {
        cart.items.push({
          id: Date.now() + Math.floor(Math.random() * 1000),
          product_id: Number(productId),
          quantity: Math.min(product.stock, qty)
        });
      }
      return this.getCart(userId);
    } else {
      const pool = db.getPool();
      let cartRes = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      let cartId;
      if (cartRes.rows.length === 0) {
        const newCart = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
        cartId = newCart.rows[0].id;
      } else {
        cartId = cartRes.rows[0].id;
      }

      await pool.query(`
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (cart_id, product_id)
        DO UPDATE SET quantity = cart_items.quantity + $3, updated_at = NOW()
      `, [cartId, productId, qty]);

      return this.getCart(userId);
    }
  }

  async updateItem(userId, productId, quantity) {
    const qty = parseInt(quantity, 10);
    if (qty <= 0) {
      return this.removeItem(userId, productId);
    }

    if (db.isFallback()) {
      const cart = db.memoryStore.carts[userId];
      if (cart) {
        const item = cart.items.find(i => i.product_id === Number(productId));
        if (item) {
          item.quantity = qty;
        }
      }
      return this.getCart(userId);
    } else {
      const pool = db.getPool();
      const cartRes = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      if (cartRes.rows.length > 0) {
        const cartId = cartRes.rows[0].id;
        await pool.query('UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE cart_id = $2 AND product_id = $3', [qty, cartId, productId]);
      }
      return this.getCart(userId);
    }
  }

  async removeItem(userId, productId) {
    if (db.isFallback()) {
      const cart = db.memoryStore.carts[userId];
      if (cart) {
        cart.items = cart.items.filter(i => i.product_id !== Number(productId));
      }
      return this.getCart(userId);
    } else {
      const pool = db.getPool();
      const cartRes = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      if (cartRes.rows.length > 0) {
        const cartId = cartRes.rows[0].id;
        await pool.query('DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cartId, productId]);
      }
      return this.getCart(userId);
    }
  }

  async clearCart(userId) {
    if (db.isFallback()) {
      if (db.memoryStore.carts[userId]) {
        db.memoryStore.carts[userId].items = [];
      }
      return this.getCart(userId);
    } else {
      const pool = db.getPool();
      const cartRes = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      if (cartRes.rows.length > 0) {
        const cartId = cartRes.rows[0].id;
        await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
      }
      return this.getCart(userId);
    }
  }
}

module.exports = new CartService();
