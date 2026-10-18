const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

let pool = null;
let useFallback = false;

// In-Memory store as fallback if PostgreSQL is not active
const memoryStore = {
  users: [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@cloudcart.com',
      password_hash: bcrypt.hashSync('Admin123!', 10),
      role: 'admin',
      phone: '+1 (555) 019-2834',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Sarah Jenkins',
      email: 'demo@cloudcart.com',
      password_hash: bcrypt.hashSync('Customer123!', 10),
      role: 'customer',
      phone: '+1 (555) 018-9123',
      created_at: new Date().toISOString()
    }
  ],
  categories: [
    { id: 1, name: 'Audio & Sound', slug: 'audio-sound', description: 'Premium noise-canceling headphones, studio monitors and spatial earbuds.', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'Wearables & Watches', slug: 'wearables-watches', description: 'Next-gen smartwatches, titanium fitness trackers, and luxury digital timepieces.', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: 'Laptops & Computing', slug: 'laptops-computing', description: 'Ultra-thin workstations, high-refresh rate displays, and creative machines.', image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' },
    { id: 4, name: 'Smart Home & Office', slug: 'smart-home-office', description: 'Ergonomic desk gear, ambient lighting, and smart automated essentials.', image_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80' },
    { id: 5, name: 'Photography & Video', slug: 'photography-video', description: 'Mirrorless 4K cameras, gimbal stabilizers, and cinematic lens kits.', image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80' }
  ],
  products: [
    {
      id: 1,
      category_id: 1,
      name: 'Aura ANC Wireless Studio Headphones',
      slug: 'aura-anc-wireless-studio-headphones',
      description: 'Engineered with titanium 40mm drivers and state-of-the-art hybrid active noise cancellation. Enjoy 45 hours of immersive Hi-Res audio with plush memory foam ear cushions.',
      price: 299.99,
      compare_at_price: 349.99,
      stock: 35,
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      rating_count: 128,
      is_featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      category_id: 2,
      name: 'Chronos Titan GPS Smartwatch',
      slug: 'chronos-titan-gps-smartwatch',
      description: 'Aerospace grade titanium chassis with sapphire crystal glass. Features dual-frequency GPS, heart-rate variability tracking, ECG monitoring and 14-day battery life.',
      price: 399.00,
      compare_at_price: 449.00,
      stock: 22,
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      rating_count: 94,
      is_featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      category_id: 3,
      name: 'Luminary 16X M-Pro Creator Laptop',
      slug: 'luminary-16x-m-pro-creator-laptop',
      description: 'Powered by a 14-core high-efficiency processor, 32GB unified RAM, 1TB NVMe Gen4 SSD, and a breathtaking 3.2K 120Hz Mini-LED calibrated display.',
      price: 1899.00,
      compare_at_price: 2099.00,
      stock: 15,
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      rating_count: 67,
      is_featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      category_id: 1,
      name: 'Pulse Pods Pro Spatial Earbuds',
      slug: 'pulse-pods-pro-spatial-earbuds',
      description: 'True wireless spatial audio with dynamic head tracking, adaptive transparency mode, wireless MagSafe charging case, and IPX5 sweat resistance.',
      price: 179.99,
      compare_at_price: 199.99,
      stock: 50,
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      rating_count: 210,
      is_featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      category_id: 4,
      name: 'Halo Ambient Minimalist Desk Lamp',
      slug: 'halo-ambient-minimalist-desk-lamp',
      description: 'Touch-stepless dimmable architectural lamp with 98+ CRI natural light spectrum, wireless charging pad in base, and aluminum alloy construction.',
      price: 89.00,
      compare_at_price: 119.00,
      stock: 40,
      image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      rating_count: 52,
      is_featured: false,
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      category_id: 4,
      name: 'ErgoGlide Mechanical Keyboard (RGB)',
      slug: 'ergoglide-mechanical-keyboard-rgb',
      description: 'Hot-swappable tactile switches, gasket mounted acoustics, custom dye-sub PBT keycaps, and seamless tri-mode connectivity (2.4G, Bluetooth 5.2, USB-C).',
      price: 149.00,
      compare_at_price: 169.00,
      stock: 28,
      image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      rating_count: 184,
      is_featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: 7,
      category_id: 5,
      name: 'Apex R7 Mirrorless 4K Camera Body',
      slug: 'apex-r7-mirrorless-4k-camera-body',
      description: 'Full-frame 33MP BSI CMOS sensor capable of 4K 60p 10-bit recording, 8-stop in-body stabilization, and AI deep-learning autofocus system.',
      price: 1649.00,
      compare_at_price: 1799.00,
      stock: 8,
      image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      rating_count: 43,
      is_featured: false,
      created_at: new Date().toISOString()
    },
    {
      id: 8,
      category_id: 2,
      name: 'Horizon Sport Fitness Band',
      slug: 'horizon-sport-fitness-band',
      description: 'Ultra-lightweight 24/7 fitness tracker with continuous SpO2, sleep coaching, stress analytics, and 50m water resistance in an unobtrusive band.',
      price: 59.99,
      compare_at_price: 79.99,
      stock: 65,
      image_url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80',
      rating: 4.5,
      rating_count: 78,
      is_featured: false,
      created_at: new Date().toISOString()
    },
    {
      id: 9,
      category_id: 3,
      name: 'Vortex 27-inch 4K HDR Designer Monitor',
      slug: 'vortex-27-inch-4k-hdr-designer-monitor',
      description: 'IPS Black panel offering 2000:1 contrast ratio, 98% DCI-P3 color gamut, 90W USB-C power delivery, and an ergonomic height/pivot adjustable stand.',
      price: 549.00,
      compare_at_price: 629.00,
      stock: 19,
      image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      rating_count: 62,
      is_featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: 10,
      category_id: 4,
      name: 'AeroPure Smart Hepa Air Purifier',
      slug: 'aeropure-smart-hepa-air-purifier',
      description: 'Quiet whisper-quiet air filtration capturing 99.97% of airborne particles. Real-time air quality ring indicator with smartphone app integration.',
      price: 129.00,
      compare_at_price: 149.00,
      stock: 31,
      image_url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      rating_count: 39,
      is_featured: false,
      created_at: new Date().toISOString()
    }
  ],
  carts: {}, // userId -> { id, items: [ { id, product_id, quantity, product } ] }
  orders: [
    {
      id: 1,
      user_id: 2,
      order_number: 'ORD-2026-9041',
      status: 'delivered',
      total_amount: 329.98,
      subtotal: 299.99,
      tax_amount: 29.99,
      shipping_fee: 0.00,
      payment_method: 'card_test',
      payment_status: 'paid',
      transaction_ref: 'TXN_TEST_994821',
      shipping_name: 'Sarah Jenkins',
      shipping_street: '742 Evergreen Terrace',
      shipping_city: 'Springfield',
      shipping_state: 'OR',
      shipping_postal_code: '97477',
      shipping_country: 'United States',
      shipping_phone: '+1 (555) 018-9123',
      created_at: '2026-10-15T14:32:00Z',
      items: [
        {
          id: 1,
          order_id: 1,
          product_id: 1,
          product_name: 'Aura ANC Wireless Studio Headphones',
          price: 299.99,
          quantity: 1,
          image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    {
      id: 2,
      user_id: 2,
      order_number: 'ORD-2026-9042',
      status: 'processing',
      total_amount: 197.98,
      subtotal: 179.99,
      tax_amount: 17.99,
      shipping_fee: 0.00,
      payment_method: 'cod',
      payment_status: 'pending',
      transaction_ref: 'COD_REF_338910',
      shipping_name: 'Sarah Jenkins',
      shipping_street: '742 Evergreen Terrace',
      shipping_city: 'Springfield',
      shipping_state: 'OR',
      shipping_postal_code: '97477',
      shipping_country: 'United States',
      shipping_phone: '+1 (555) 018-9123',
      created_at: '2026-10-16T18:15:00Z',
      items: [
        {
          id: 2,
          order_id: 2,
          product_id: 4,
          product_name: 'Pulse Pods Pro Spatial Earbuds',
          price: 179.99,
          quantity: 1,
          image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
        }
      ]
    }
  ]
};

async function initDB() {
  const dbUrl = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'cloudcart'}:${process.env.DB_PASSWORD || 'cloudcart_secret'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'cloudcart_db'}`;
  
  pool = new Pool({
    connectionString: dbUrl,
    connectionTimeoutMillis: 2500
  });

  try {
    const client = await pool.connect();
    console.log('[DB] Connected successfully to PostgreSQL database.');
    
    // Check if schema needs to be executed
    const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log('[DB] PostgreSQL schema verified/applied.');
    }
    
    // Check if products exist; if not seed
    const res = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(res.rows[0].count, 10) === 0) {
      const seedPath = path.resolve(__dirname, '../../../database/seed.sql');
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await client.query(seedSql);
        console.log('[DB] PostgreSQL seed data loaded.');
      }
    }
    client.release();
    useFallback = false;
  } catch (err) {
    console.warn(`[DB] Notice: PostgreSQL connection could not be established (${err.message}).`);
    console.log('[DB] Activating high-performance local store for instant out-of-the-box development.');
    useFallback = true;
  }
}

module.exports = {
  initDB,
  getPool: () => pool,
  isFallback: () => useFallback,
  memoryStore,
  query: async (text, params) => {
    if (!useFallback && pool) {
      return pool.query(text, params);
    }
    throw new Error('Using in-memory store directly through services');
  }
};
