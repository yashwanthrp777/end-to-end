const db = require('../config/db');

class AdminService {
  async getSummaryStats() {
    if (db.isFallback()) {
      const orders = db.memoryStore.orders;
      const products = db.memoryStore.products;
      const users = db.memoryStore.users;

      const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

      const lowStockProducts = products.filter(p => p.stock <= 15);
      const recentOrders = orders.slice(0, 5);

      return {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: users.filter(u => u.role === 'customer').length,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentOrders
      };
    } else {
      const pool = db.getPool();
      const revRes = await pool.query("SELECT COALESCE(SUM(total_amount), 0) AS total_revenue FROM orders WHERE status != 'cancelled'");
      const ordersRes = await pool.query('SELECT COUNT(*) AS total_orders FROM orders');
      const prodRes = await pool.query('SELECT COUNT(*) AS total_products FROM products');
      const custRes = await pool.query("SELECT COUNT(*) AS total_customers FROM users WHERE role = 'customer'");
      const lowStockRes = await pool.query('SELECT * FROM products WHERE stock <= 15 ORDER BY stock ASC LIMIT 5');
      const recentRes = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');

      return {
        totalRevenue: Number(parseFloat(revRes.rows[0].total_revenue).toFixed(2)),
        totalOrders: parseInt(ordersRes.rows[0].total_orders, 10),
        totalProducts: parseInt(prodRes.rows[0].total_products, 10),
        totalCustomers: parseInt(custRes.rows[0].total_customers, 10),
        lowStockCount: lowStockRes.rows.length,
        lowStockProducts: lowStockRes.rows,
        recentOrders: recentRes.rows
      };
    }
  }

  async createProduct({ name, category_id, description, price, compare_at_price, stock, image_url, is_featured }) {
    if (!name || !price || !description) {
      throw new Error('Name, price, and description are required');
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    if (db.isFallback()) {
      const newProduct = {
        id: db.memoryStore.products.length + 1,
        category_id: Number(category_id) || 1,
        name: name.trim(),
        slug,
        description,
        price: Number(price),
        compare_at_price: compare_at_price ? Number(compare_at_price) : null,
        stock: Number(stock) || 0,
        image_url: image_url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
        rating: 5.0,
        rating_count: 0,
        is_featured: !!is_featured,
        created_at: new Date().toISOString()
      };
      db.memoryStore.products.unshift(newProduct);
      return newProduct;
    } else {
      const pool = db.getPool();
      const res = await pool.query(`
        INSERT INTO products (name, slug, category_id, description, price, compare_at_price, stock, image_url, is_featured)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        name.trim(),
        slug,
        category_id || 1,
        description,
        Number(price),
        compare_at_price ? Number(compare_at_price) : null,
        Number(stock) || 0,
        image_url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
        !!is_featured
      ]);
      return res.rows[0];
    }
  }

  async updateProduct(id, data) {
    if (db.isFallback()) {
      const prod = db.memoryStore.products.find(p => p.id === Number(id));
      if (!prod) throw new Error('Product not found');
      if (data.name) prod.name = data.name.trim();
      if (data.category_id) prod.category_id = Number(data.category_id);
      if (data.description) prod.description = data.description;
      if (data.price !== undefined) prod.price = Number(data.price);
      if (data.compare_at_price !== undefined) prod.compare_at_price = data.compare_at_price ? Number(data.compare_at_price) : null;
      if (data.stock !== undefined) prod.stock = Number(data.stock);
      if (data.image_url) prod.image_url = data.image_url;
      if (data.is_featured !== undefined) prod.is_featured = !!data.is_featured;
      prod.updated_at = new Date().toISOString();
      return prod;
    } else {
      const pool = db.getPool();
      const res = await pool.query(`
        UPDATE products
        SET name = COALESCE($1, name),
            category_id = COALESCE($2, category_id),
            description = COALESCE($3, description),
            price = COALESCE($4, price),
            compare_at_price = COALESCE($5, compare_at_price),
            stock = COALESCE($6, stock),
            image_url = COALESCE($7, image_url),
            is_featured = COALESCE($8, is_featured),
            updated_at = NOW()
        WHERE id = $9
        RETURNING *
      `, [
        data.name,
        data.category_id,
        data.description,
        data.price,
        data.compare_at_price,
        data.stock,
        data.image_url,
        data.is_featured,
        id
      ]);
      if (res.rows.length === 0) throw new Error('Product not found');
      return res.rows[0];
    }
  }

  async deleteProduct(id) {
    if (db.isFallback()) {
      const idx = db.memoryStore.products.findIndex(p => p.id === Number(id));
      if (idx === -1) throw new Error('Product not found');
      const removed = db.memoryStore.products.splice(idx, 1)[0];
      return removed;
    } else {
      const pool = db.getPool();
      const res = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
      if (res.rows.length === 0) throw new Error('Product not found');
      return res.rows[0];
    }
  }

  async getAllOrders({ status, search }) {
    if (db.isFallback()) {
      let orders = [...db.memoryStore.orders];
      if (status && status !== 'all') {
        orders = orders.filter(o => o.status === status);
      }
      if (search) {
        const q = search.toLowerCase();
        orders = orders.filter(o => o.order_number.toLowerCase().includes(q) || (o.shipping_name && o.shipping_name.toLowerCase().includes(q)));
      }
      return orders;
    } else {
      const pool = db.getPool();
      let query = `
        SELECT o.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'product_name', oi.product_name,
                'price', oi.price,
                'quantity', oi.quantity,
                'image_url', oi.image_url
              )
            ) FILTER (WHERE oi.id IS NOT NULL), '[]'
          ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE 1=1
      `;
      const params = [];
      let idx = 1;
      if (status && status !== 'all') {
        query += ` AND o.status = $${idx}`;
        params.push(status);
        idx++;
      }
      if (search) {
        query += ` AND (o.order_number ILIKE $${idx} OR o.shipping_name ILIKE $${idx})`;
        params.push(`%${search}%`);
        idx++;
      }
      query += ` GROUP BY o.id ORDER BY o.created_at DESC`;
      const res = await pool.query(query, params);
      return res.rows;
    }
  }

  async updateOrderStatus(orderId, { status, payment_status }) {
    if (db.isFallback()) {
      const order = db.memoryStore.orders.find(o => o.id === Number(orderId) || o.order_number === orderId);
      if (!order) throw new Error('Order not found');
      if (status) order.status = status;
      if (payment_status) order.payment_status = payment_status;
      order.updated_at = new Date().toISOString();
      return order;
    } else {
      const pool = db.getPool();
      const res = await pool.query(`
        UPDATE orders
        SET status = COALESCE($1, status),
            payment_status = COALESCE($2, payment_status),
            updated_at = NOW()
        WHERE (id::text = $3 OR order_number = $3)
        RETURNING *
      `, [status, payment_status, String(orderId)]);
      if (res.rows.length === 0) throw new Error('Order not found');
      return res.rows[0];
    }
  }

  async getAllCustomers() {
    if (db.isFallback()) {
      return db.memoryStore.users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        created_at: u.created_at
      }));
    } else {
      const pool = db.getPool();
      const res = await pool.query('SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC');
      return res.rows;
    }
  }
}

module.exports = new AdminService();
