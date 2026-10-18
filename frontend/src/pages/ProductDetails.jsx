import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { Star, ShieldCheck, Truck, RefreshCw, Plus, Minus, ShoppingBag, ArrowLeft, Check, Zap } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getProductById(id);
        if (res.success) {
          setProduct(res.data);
          setQuantity(1);
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError(err.message || 'Product could not be loaded');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error || 'This device may have been discontinued.'}</p>
        <Link to="/products" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const discountPercent = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="product-details-page animate-fade-in" style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color: 'var(--text-muted)' }}>Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category_slug}`} style={{ color: 'var(--text-muted)' }}>{product.category_name}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Main Product Showcase */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '50px',
          alignItems: 'start'
        }}>
          {/* Product Media Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-card" style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              backgroundColor: '#131b2e',
              paddingTop: '80%'
            }}>
              <img
                src={product.image_url}
                alt={product.name}
                id="product-main-image"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {discountPercent && (
                <div style={{ position: 'absolute', top: 20, left: 20 }}>
                  <span className="badge badge-primary" style={{ background: '#6366f1', color: '#fff', fontSize: '0.85rem', padding: '6px 14px' }}>
                    Save {discountPercent}% OFF
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Information & Purchase Controls */}
          <div>
            <div style={{ display: 'inline-block', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#06b6d4', fontWeight: 800, marginBottom: '8px' }}>
              {product.category_name}
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '14px' }}>
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={17} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', marginLeft: '4px' }}>{product.rating || '4.9'}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>({product.rating_count || 120} verified reviews)</span>
              </div>

              <div>
                {isOutOfStock ? (
                  <span className="badge badge-danger">Out of Stock</span>
                ) : isLowStock ? (
                  <span className="badge badge-warning">Low Stock ({product.stock} left)</span>
                ) : (
                  <span className="badge badge-success">In Stock Ready to Dispatch</span>
                )}
              </div>
            </div>

            {/* Pricing Section */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '14px',
              padding: '20px 0',
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '28px'
            }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f9fafb' }}>
                ${Number(product.price).toFixed(2)}
              </span>
              {product.compare_at_price && (
                <span style={{ fontSize: '1.3rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                  ${Number(product.compare_at_price).toFixed(2)}
                </span>
              )}
              <span style={{ fontSize: '0.88rem', color: '#10b981', fontWeight: 600 }}>
                Includes all taxes & test guarantee
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-muted)', marginBottom: '32px' }}>
              {product.description}
            </p>

            {/* Quantity Selector and Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Quantity:</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px'
                }}>
                  <button
                    id="decrease-qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-main)',
                      padding: '10px 14px',
                      cursor: 'pointer'
                    }}
                  >
                    <Minus size={16} />
                  </button>
                  <span id="product-qty-display" style={{ width: '40px', textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>
                    {quantity}
                  </span>
                  <button
                    id="increase-qty-btn"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-main)',
                      padding: '10px 14px',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button
                  id="details-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`btn btn-lg ${added ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ flex: 1, minWidth: '200px' }}
                >
                  {added ? (
                    <>
                      <Check size={20} color="#10b981" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      <span>{isOutOfStock ? 'Out of Stock' : 'Add to Shopping Bag'}</span>
                    </>
                  )}
                </button>

                {!isOutOfStock && (
                  <button
                    id="details-buy-now-btn"
                    onClick={handleBuyNow}
                    className="btn btn-secondary btn-lg"
                    style={{ background: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.3)', color: '#67e8f9' }}
                  >
                    <Zap size={20} />
                    <span>Instant Checkout</span>
                  </button>
                )}
              </div>
            </div>

            {/* Confidence Highlights */}
            <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Truck size={20} color="#818cf8" />
                <div style={{ fontSize: '0.88rem' }}>
                  <strong>Free Express Shipping:</strong> Estimated delivery in 2-4 business days.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <RefreshCw size={20} color="#10b981" />
                <div style={{ fontSize: '0.88rem' }}>
                  <strong>Hassle-Free Returns:</strong> 30 days money-back return privilege.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={20} color="#06b6d4" />
                <div style={{ fontSize: '0.88rem' }}>
                  <strong>2-Year Warranty:</strong> Official manufacturer parts & labor coverage.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
