const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('cloudcart_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  getProfile: () => request('/auth/profile'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: profileData }),

  // Products & Categories
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/products${queryString}`);
  },
  getFeaturedProducts: () => request('/products/featured'),
  getProductById: (id) => request(`/products/${id}`),
  getCategories: () => request('/products/categories'),

  // Cart
  getCart: () => request('/cart'),
  addToCart: (productId, quantity = 1) => request('/cart/add', { method: 'POST', body: { productId, quantity } }),
  updateCartItem: (productId, quantity) => request('/cart/update', { method: 'PUT', body: { productId, quantity } }),
  removeFromCart: (productId) => request(`/cart/remove/${productId}`, { method: 'DELETE' }),
  clearCart: () => request('/cart/clear', { method: 'DELETE' }),

  // Orders
  checkout: (orderData) => request('/orders/checkout', { method: 'POST', body: orderData }),
  getMyOrders: () => request('/orders/my-orders'),
  getOrderDetails: (orderId) => request(`/orders/${orderId}`),
  cancelOrder: (orderId) => request(`/orders/${orderId}/cancel`, { method: 'PUT' }),
  trackOrder: (orderNumber) => request(`/orders/track/${orderNumber}`),

  // Admin
  getAdminDashboard: () => request('/admin/dashboard'),
  createProduct: (productData) => request('/admin/products', { method: 'POST', body: productData }),
  updateProduct: (id, productData) => request('/admin/products/${id}', { method: 'PUT', body: productData }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  getAdminOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/orders${query ? `?${query}` : ''}`);
  },
  updateOrderStatus: (id, statusData) => request(`/admin/orders/${id}/status`, { method: 'PUT', body: statusData }),
  getAdminCustomers: () => request('/admin/customers')
};
