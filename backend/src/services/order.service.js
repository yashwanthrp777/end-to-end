const db = require('../config/db');

class OrderService {
  async createOrder(userId, { shipping, paymentMethod = 'cod', items, notes }) {
    if (!shipping || !shipping.fullName || !shipping.street || !shipping.city || !shipping.postalCode || !shipping.phone) {
      throw new Error('Complete shipping details (Name, Street, City, Postal Code, Phone) are required');
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Cannot place an order with an empty cart');
    }

    // Calculate totals and verify products
    let subtotal = 0;
    const validatedItems = [];

    if (db.isFallback()) {
      for (const item of items) {
        const product = db.memoryStore.products.find(p => p.id === Number(item.product_id || item.productId));
        if (!product) {
          throw new Error(`Product #${item.product_id || item.productId} no longer exists`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}`);
        }
        const itemPrice = Number(product.price);
        subtotal += itemPrice * item.quantity;

        // Deduct inventory
        product.stock -= item.quantity;

        validatedItems.push({
          product_id: product.id,
          product_name: product.name,
          price: itemPrice,
          quantity: item.quantity,
          image_url: product.image_url
        });
      }

      const shippingFee = subtotal > 150 ? 0 : 15.00;
      const taxAmount = Number((subtotal * 0.08).toFixed(2));
      const totalAmount = Number((subtotal + shippingFee + taxAmount).toFixed(2));

      const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const isCard = paymentMethod === 'card_test';
      const paymentStatus = isCard ? 'paid' : 'pending';
      const transactionRef = isCard ? `TXN_TEST_${Date.now()}` : `COD_REF_${Date.now()}`;

      const newOrder = {
        id: db.memoryStore.orders.length + 1,
        user_id: Number(userId),
        order_number: orderNumber,
        status: 'pending',
        total_amount: totalAmount,
        subtotal: Number(subtotal.toFixed(2)),
        tax_amount: taxAmount,
        shipping_fee: shippingFee,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        transaction_ref: transactionRef,
        shipping_name: shipping.fullName,
        shipping_street: shipping.street,
        shipping_city: shipping.city,
        shipping_state: shipping.state || '',
        shipping_postal_code: shipping.postalCode,
        shipping_country: shipping.country || 'USA',
        shipping_phone: shipping.phone,
        notes: notes || '',
        created_at: new Date().toISOString(),
        items: validatedItems
      };

      db.memoryStore.orders.unshift(newOrder);

      // Clear user cart
      if (db.memoryStore.carts[userId]) {
        db.memoryStore.carts[userId].items = [];
      }

      // Generate simulated confirmation notification
      const emailNotification = {
        recipient: shipping.fullName,
        toEmail: (db.memoryStore.users.find(u => u.id === Number(userId)) || {}).email,
        subject: `Order Confirmation - #${orderNumber}`,
        preview: `Thank you for your order! Your total is $${totalAmount}. We are processing your items.`
      };

      return {
        order: newOrder,
        notification: emailNotification
      };
    } else {
      const pool = db.getPool();
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        for (const item of items) {
          const prodRes = await client.query('SELECT * FROM products WHERE id = $1 FOR UPDATE', [item.product_id || item.productId]);
          if (prodRes.rows.length === 0) {
            throw new Error(`Product not found`);
          }
          const product = prodRes.rows[0];
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}`);
          }
          const itemPrice = Number(product.price);
          subtotal += itemPrice * item.quantity;

          // Deduct stock
          await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, product.id]);

          validatedItems.push({
            product_id: product.id,
            product_name: product.name,
            price: itemPrice,
            quantity: item.quantity,
            image_url: product.image_url
          });
        }

        const shippingFee = subtotal > 150 ? 0 : 15.00;
        const taxAmount = Number((subtotal * 0.08).toFixed(2));
        const totalAmount = Number((subtotal + shippingFee + taxAmount).toFixed(2));

        const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        const isCard = paymentMethod === 'card_test';
        const paymentStatus = isCard ? 'paid' : 'pending';
        const transactionRef = isCard ? `TXN_TEST_${Date.now()}` : `COD_REF_${Date.now()}`;

        const orderInsertRes = await client.query(`
          INSERT INTO orders (
            user_id, order_number, status, total_amount, subtotal, tax_amount, shipping_fee,
            payment_method, payment_status, transaction_ref, shipping_name, shipping_street,
            shipping_city, shipping_state, shipping_postal_code, shipping_country, shipping_phone, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          RETURNING *
        `, [
          userId, orderNumber, 'pending', totalAmount, subtotal, taxAmount, shippingFee,
          paymentMethod, paymentStatus, transactionRef, shipping.fullName, shipping.street,
          shipping.city, shipping.state || '', shipping.postalCode, shipping.country || 'USA',
          shipping.phone, notes || ''
        ]);

        const order = orderInsertRes.rows[0];

        // Insert order items
        for (const vi of validatedItems) {
          await client.query(`
            INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image_url)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [order.id, vi.product_id, vi.product_name, vi.price, vi.quantity, vi.image_url]);
        }

        // Clear user cart
        const cartRes = await client.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
        if (cartRes.rows.length > 0) {
          await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartRes.rows[0].id]);
        }

        await client.query('COMMIT');

        order.items = validatedItems;

        return {
          order,
          notification: {
            recipient: shipping.fullName,
            subject: `Order Confirmation - #${orderNumber}`,
            preview: `Thank you for your order! Total: $${totalAmount}`
          }
        };
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }
  }

  async getUserOrders(userId) {
    if (db.isFallback()) {
      return db.memoryStore.orders.filter(o => o.user_id === Number(userId));
    } else {
      const pool = db.getPool();
      const res = await pool.query(`
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
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `, [userId]);
      return res.rows;
    }
  }

  async getOrderById(userId, orderId) {
    if (db.isFallback()) {
      const order = db.memoryStore.orders.find(o => (o.id === Number(orderId) || o.order_number === orderId) && (Number(o.user_id) === Number(userId) || userId === 'admin'));
      if (!order) throw new Error('Order not found');
      return order;
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
        WHERE (o.id::text = $1 OR o.order_number = $1)
      `;
      const params = [String(orderId)];
      if (userId !== 'admin') {
        query += ` AND o.user_id = $2`;
        params.push(userId);
      }
      query += ` GROUP BY o.id`;

      const res = await pool.query(query, params);
      if (res.rows.length === 0) throw new Error('Order not found');
      return res.rows[0];
    }
  }

  async cancelOrder(userId, orderId) {
    if (db.isFallback()) {
      const order = db.memoryStore.orders.find(o => (o.id === Number(orderId) || o.order_number === orderId) && (Number(o.user_id) === Number(userId) || userId === 'admin'));
      if (!order) throw new Error('Order not found');
      if (order.status !== 'pending' && order.status !== 'processing') {
        throw new Error(`Cannot cancel order in "${order.status}" status.`);
      }

      order.status = 'cancelled';
      order.updated_at = new Date().toISOString();

      // Restock products
      if (order.items) {
        for (const item of order.items) {
          const product = db.memoryStore.products.find(p => p.id === Number(item.product_id));
          if (product) product.stock += item.quantity;
        }
      }

      return order;
    } else {
      const pool = db.getPool();
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const orderRes = await client.query('SELECT * FROM orders WHERE (id::text = $1 OR order_number = $1) AND user_id = $2 FOR UPDATE', [String(orderId), userId]);
        if (orderRes.rows.length === 0) throw new Error('Order not found');
        const order = orderRes.rows[0];

        if (order.status !== 'pending' && order.status !== 'processing') {
          throw new Error(`Cannot cancel order in "${order.status}" status.`);
        }

        // Restock products
        const itemsRes = await client.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
        for (const item of itemsRes.rows) {
          await client.query('UPDATE products SET stock = stock + $1 WHERE id = $2', [item.quantity, item.product_id]);
        }

        const updatedRes = await client.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', ['cancelled', order.id]);
        await client.query('COMMIT');
        return updatedRes.rows[0];
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }
  }

  async trackOrder(orderNumber) {
    if (db.isFallback()) {
      const order = db.memoryStore.orders.find(o => o.order_number === orderNumber.trim());
      if (!order) throw new Error('Order not found');
      return {
        order_number: order.order_number,
        status: order.status,
        created_at: order.created_at,
        shipping_city: order.shipping_city,
        shipping_country: order.shipping_country,
        itemCount: order.items ? order.items.length : 0,
        total_amount: order.total_amount
      };
    } else {
      const pool = db.getPool();
      const res = await pool.query('SELECT order_number, status, created_at, shipping_city, shipping_country, total_amount FROM orders WHERE order_number = $1', [orderNumber.trim()]);
      if (res.rows.length === 0) throw new Error('Order not found');
      return res.rows[0];
    }
  }
}

module.exports = new OrderService();
