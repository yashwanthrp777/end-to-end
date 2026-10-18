const db = require('../config/db');

class ProductService {
  async getAllProducts({ category, search, minPrice, maxPrice, sort, inStock, page = 1, limit = 12 }) {
    if (db.isFallback()) {
      let filtered = [...db.memoryStore.products];

      // Category filter (accepts category id or slug)
      if (category && category !== 'all') {
        const catObj = db.memoryStore.categories.find(c => c.slug === category || c.id === Number(category));
        if (catObj) {
          filtered = filtered.filter(p => p.category_id === catObj.id);
        }
      }

      // Search filter
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }

      // Price filter
      if (minPrice !== undefined && minPrice !== '') {
        filtered = filtered.filter(p => Number(p.price) >= Number(minPrice));
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        filtered = filtered.filter(p => Number(p.price) <= Number(maxPrice));
      }

      // In-stock filter
      if (inStock === 'true' || inStock === true) {
        filtered = filtered.filter(p => p.stock > 0);
      }

      // Sorting
      if (sort === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sort === 'newest') {
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else {
        // Default: featured first, then rating
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0) || (b.rating || 0) - (a.rating || 0));
      }

      const total = filtered.length;
      const offset = (Number(page) - 1) * Number(limit);
      const paginated = filtered.slice(offset, offset + Number(limit));

      // Enrich with category name
      const enriched = paginated.map(p => {
        const cat = db.memoryStore.categories.find(c => c.id === p.category_id);
        return {
          ...p,
          category_name: cat ? cat.name : 'General',
          category_slug: cat ? cat.slug : 'general'
        };
      });

      return {
        products: enriched,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit))
      };
    } else {
      const pool = db.getPool();
      let query = `
        SELECT p.*, c.name AS category_name, c.slug AS category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 1=1
      `;
      const params = [];
      let paramIndex = 1;

      if (category && category !== 'all') {
        query += ` AND (c.slug = $${paramIndex} OR p.category_id::text = $${paramIndex})`;
        params.push(category);
        paramIndex++;
      }

      if (search) {
        query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (minPrice !== undefined && minPrice !== '') {
        query += ` AND p.price >= $${paramIndex}`;
        params.push(minPrice);
        paramIndex++;
      }

      if (maxPrice !== undefined && maxPrice !== '') {
        query += ` AND p.price <= $${paramIndex}`;
        params.push(maxPrice);
        paramIndex++;
      }

      if (inStock === 'true' || inStock === true) {
        query += ` AND p.stock > 0`;
      }

      // Count query before sorting and pagination
      const countRes = await pool.query(`SELECT COUNT(*) FROM (${query}) AS total_count`, params);
      const total = parseInt(countRes.rows[0].count, 10);

      // Sorting
      if (sort === 'price_asc') {
        query += ` ORDER BY p.price ASC`;
      } else if (sort === 'price_desc') {
        query += ` ORDER BY p.price DESC`;
      } else if (sort === 'rating') {
        query += ` ORDER BY p.rating DESC`;
      } else if (sort === 'newest') {
        query += ` ORDER BY p.created_at DESC`;
      } else {
        query += ` ORDER BY p.is_featured DESC, p.rating DESC`;
      }

      // Pagination
      const offset = (Number(page) - 1) * Number(limit);
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(Number(limit), offset);

      const result = await pool.query(query, params);

      return {
        products: result.rows,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit))
      };
    }
  }

  async getFeaturedProducts() {
    if (db.isFallback()) {
      return db.memoryStore.products
        .filter(p => p.is_featured)
        .slice(0, 8)
        .map(p => {
          const cat = db.memoryStore.categories.find(c => c.id === p.category_id);
          return { ...p, category_name: cat ? cat.name : 'General' };
        });
    } else {
      const pool = db.getPool();
      const res = await pool.query(`
        SELECT p.*, c.name AS category_name, c.slug AS category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_featured = TRUE
        LIMIT 8
      `);
      return res.rows;
    }
  }

  async getProductByIdentifier(identifier) {
    if (db.isFallback()) {
      const isNum = !isNaN(identifier);
      const product = db.memoryStore.products.find(p => isNum ? p.id === Number(identifier) : p.slug === identifier);
      if (!product) throw new Error('Product not found');
      const cat = db.memoryStore.categories.find(c => c.id === product.category_id);
      return { ...product, category_name: cat ? cat.name : 'General', category_slug: cat ? cat.slug : 'general' };
    } else {
      const pool = db.getPool();
      const isNum = !isNaN(identifier);
      const query = isNum 
        ? 'SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1'
        : 'SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = $1';
      const res = await pool.query(query, [identifier]);
      if (res.rows.length === 0) throw new Error('Product not found');
      return res.rows[0];
    }
  }

  async getCategories() {
    if (db.isFallback()) {
      return db.memoryStore.categories.map(cat => {
        const count = db.memoryStore.products.filter(p => p.category_id === cat.id).length;
        return { ...cat, product_count: count };
      });
    } else {
      const pool = db.getPool();
      const res = await pool.query(`
        SELECT c.*, COUNT(p.id)::int AS product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        GROUP BY c.id
        ORDER BY c.name ASC
      `);
      return res.rows;
    }
  }
}

module.exports = new ProductService();
