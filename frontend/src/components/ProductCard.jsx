import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const discountPercent = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className="glass-card"
      id={`product-card-${product.id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Product Image Link */}
      <Link
        to={`/product/${product.slug || product.id}`}
        style={{
          position: 'relative',
          paddingTop: '75%',
          overflow: 'hidden',
          backgroundColor: '#161e2e'
        }}
      >
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Badges Overlay */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 2 }}>
          {discountPercent && (
            <span className="badge badge-primary" style={{ background: '#6366f1', color: '#fff', border: 'none' }}>
              Save {discountPercent}%
            </span>
          )}
          {isOutOfStock ? (
            <span className="badge badge-danger">Out of Stock</span>
          ) : isLowStock ? (
            <span className="badge badge-warning">Only {product.stock} left</span>
          ) : null}
        </div>
      </Link>

      {/* Product Info */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#06b6d4', fontWeight: 700 }}>
            {product.category_name || 'Electronics'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#f59e0b' }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{product.rating || '4.9'}</span>
            <span style={{ color: 'var(--text-muted)' }}>({product.rating_count || 42})</span>
          </div>
        </div>

        <Link to={`/product/${product.slug || product.id}`} style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '8px',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.name}
          </h3>
        </Link>

        {/* Price & Action Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f9fafb' }}>
                ${Number(product.price).toFixed(2)}
              </span>
              {product.compare_at_price && (
                <span style={{ fontSize: '0.9rem', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>
                  ${Number(product.compare_at_price).toFixed(2)}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isOutOfStock ? 'Temporarily backordered' : 'Ships immediately'}
            </div>
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`btn btn-sm ${added ? 'btn-secondary' : 'btn-primary'}`}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              opacity: isOutOfStock ? 0.5 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              minWidth: '42px'
            }}
            title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
          >
            {added ? (
              <>
                <Check size={16} color="#10b981" />
                <span style={{ fontSize: '0.8rem', color: '#10b981' }}>Added</span>
              </>
            ) : (
              <ShoppingBag size={17} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
