import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  Search
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders, customers
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Product modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category_id: 1,
    price: '',
    compare_at_price: '',
    stock: '',
    description: '',
    image_url: '',
    is_featured: false
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [sumRes, prodRes, catRes, ordRes, custRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getProducts({ limit: 100 }),
        api.getCategories(),
        api.getAdminOrders(),
        api.getAdminCustomers()
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (prodRes.success) setProducts(prodRes.data.products);
      if (catRes.success) setCategories(catRes.data);
      if (ordRes.success) setOrders(ordRes.data);
      if (custRes.success) setCustomers(custRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (text, type = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Product actions
  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category_id: categories[0]?.id || 1,
      price: '',
      compare_at_price: '',
      stock: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
      is_featured: false
    });
    setShowProductModal(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category_id: prod.category_id,
      price: prod.price,
      compare_at_price: prod.compare_at_price || '',
      stock: prod.stock,
      description: prod.description,
      image_url: prod.image_url,
      is_featured: prod.is_featured
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productForm);
        showNotification('Product updated successfully!');
      } else {
        await api.createProduct(productForm);
        showNotification('New product listed successfully!');
      }
      setShowProductModal(false);
      loadAllData();
    } catch (err) {
      showNotification(err.message || 'Error saving product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;
    try {
      await api.deleteProduct(id);
      showNotification('Product deleted successfully');
      loadAllData();
    } catch (err) {
      showNotification(err.message || 'Error deleting product', 'error');
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, {
        status: newStatus,
        payment_status: newStatus === 'delivered' ? 'paid' : undefined
      });
      showNotification(`Order status updated to ${newStatus}`);
      loadAllData();
    } catch (err) {
      showNotification(err.message || 'Error updating order status', 'error');
    }
  };

  return (
    <div className="admin-dashboard animate-fade-in" style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Command Operations
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Admin Management Portal</h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button id="admin-add-product-btn" onClick={openAddModal} className="btn btn-primary">
              <Plus size={18} /> Add New Hardware
            </button>
          </div>
        </div>

        {/* Global Feedback Alert */}
        {feedback && (
          <div style={{
            background: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${feedback.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            color: feedback.type === 'error' ? '#fca5a5' : '#6ee7b7',
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            {feedback.text}
          </div>
        )}

        {/* Tabs Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
          marginBottom: '32px',
          overflowX: 'auto'
        }}>
          <button
            id="tab-overview"
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'overview' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'overview' ? '#a5b4fc' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Overview & Metrics
          </button>
          <button
            id="tab-products"
            onClick={() => setActiveTab('products')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'products' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'products' ? '#a5b4fc' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Products & Stock ({products.length})
          </button>
          <button
            id="tab-orders"
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'orders' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'orders' ? '#a5b4fc' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Orders & Shipments ({orders.length})
          </button>
          <button
            id="tab-customers"
            onClick={() => setActiveTab('customers')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'customers' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'customers' ? '#a5b4fc' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Customer Accounts ({customers.length})
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && summary && (
          <div>
            {/* KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '36px'
            }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue</span>
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                    <DollarSign size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>${summary.totalRevenue.toLocaleString()}</div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '4px' }}>From confirmed & paid orders</div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</span>
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
                    <ShoppingBag size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>{summary.totalOrders}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Processed lifetime shipments</div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hardware Catalog</span>
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                    <Package size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>{summary.totalProducts}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Active devices listed</div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Registered Users</span>
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                    <Users size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>{summary.totalCustomers}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Verified customer accounts</div>
              </div>
            </div>

            {/* Low Stock Alerts & Recent Orders */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
              {/* Low Stock Alert */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#f59e0b' }}>
                  <AlertTriangle size={20} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Inventory Restock Warnings ({summary.lowStockCount})
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {summary.lowStockProducts.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.name}</span>
                      <span className="badge badge-warning">{p.stock} units left</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Recent Orders */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>Recent Orders</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {summary.recentOrders.map(o => (
                    <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#818cf8' }}>#{o.order_number}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{o.shipping_name}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>${Number(o.total_amount).toFixed(2)}</div>
                        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === 'products' && (
          <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Product</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Price</th>
                  <th style={{ padding: '12px 16px' }}>Inventory</th>
                  <th style={{ padding: '12px 16px' }}>Featured</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={p.image_url} alt={p.name} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{p.category_name}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>${Number(p.price).toFixed(2)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${p.stock <= 10 ? 'badge-warning' : 'badge-success'}`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {p.is_featured ? <span style={{ color: '#10b981' }}>★ Yes</span> : <span style={{ color: 'var(--text-subtle)' }}>No</span>}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => openEditModal(p)}
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '8px' }}
                        title="Edit product"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="btn btn-danger btn-sm"
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Orders */}
        {activeTab === 'orders' && (
          <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Order</th>
                  <th style={{ padding: '12px 16px' }}>Customer</th>
                  <th style={{ padding: '12px 16px' }}>Total</th>
                  <th style={{ padding: '12px 16px' }}>Payment</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 800, color: '#818cf8' }}>#{o.order_number}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(o.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{o.shipping_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{o.shipping_city}, {o.shipping_state}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 800 }}>${Number(o.total_amount).toFixed(2)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700 }}>
                        {o.payment_method}
                      </div>
                      <span className={`badge ${o.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                        {o.payment_status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="form-select"
                        style={{ width: 'auto', padding: '6px 10px', fontSize: '0.82rem' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Customers */}
        {activeTab === 'customers' && (
          <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Name</th>
                  <th style={{ padding: '12px 16px' }}>Email</th>
                  <th style={{ padding: '12px 16px' }}>Phone</th>
                  <th style={{ padding: '12px 16px' }}>Role</th>
                  <th style={{ padding: '12px 16px' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{c.email}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{c.phone || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${c.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                        {c.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: Add/Edit Product */}
        {showProductModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '20px' }}>
                {editingProduct ? 'Edit Hardware Product' : 'Add New Hardware Product'}
              </h2>

              <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Apex 4K Monitor"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Category</label>
                    <select
                      value={productForm.category_id}
                      onChange={(e) => setProductForm({ ...productForm, category_id: Number(e.target.value) })}
                      className="form-select"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Inventory Units *</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="form-input"
                      placeholder="e.g. 25"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="form-input"
                      placeholder="299.99"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Original Compare Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.compare_at_price}
                      onChange={(e) => setProductForm({ ...productForm, compare_at_price: e.target.value })}
                      className="form-input"
                      placeholder="349.99"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="form-textarea"
                    placeholder="Engineering features, driver specifications, materials..."
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={productForm.is_featured}
                      onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Feature on Homepage Showcase</span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
