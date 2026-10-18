import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';

export default function Cart() {
  const { cartItems, cartSummary, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState(null);

  const freeShippingThreshold = 150;
  const freeShippingProgress = Math.min(100, (cartSummary.subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSummary.subtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'CLOUDCART10' || promoCode.toUpperCase() === 'SPRING2026') {
      const discount = Number((cartSummary.subtotal * 0.1).toFixed(2));
      setPromoDiscount(discount);
      setPromoMessage({ text: 'Promo code applied! 10% discount subtracted.', type: 'success' });
    } else {
      setPromoDiscount(0);
      setPromoMessage({ text: 'Invalid promo code. Try "CLOUDCART10" for 10% off.', type: 'error' });
    }
  };

  const finalTotal = Math.max(0, Number((cartSummary.total - promoDiscount).toFixed(2)));

  if (cartItems.length === 0) {
    return (
      <div className="cart-page animate-fade-in" style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div className="glass-card" style={{ padding: '60px 30px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.1)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <ShoppingBag size={38} />
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>Your Shopping Bag is Empty</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.05rem' }}>
              Explore our catalogue of studio audio, titanium wearables, and high-performance developer laptops.
            </p>
            <Link to="/products" id="empty-cart-explore-btn" className="btn btn-primary btn-lg">
              <span>Start Shopping</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page animate-fade-in" style={{ padding: '40px 0 80px' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Shopping Bag</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
              Review your selected hardware gear and proceed to checkout
            </p>
          </div>
          <button
            id="clear-cart-btn"
            onClick={clearCart}
            style={{
              background: 'none',
              border: 'none',
              color: '#f87171',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Trash2 size={15} /> Clear All
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '8px' }}>
            <span>
              {remainingForFreeShipping > 0
                ? `Add $${remainingForFreeShipping.toFixed(2)} more to qualify for FREE Express Shipping!`
                : '🎉 Congratulations! You have unlocked FREE Express Shipping!'}
            </span>
            <span style={{ color: '#06b6d4' }}>{freeShippingProgress.toFixed(0)}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              width: `${freeShippingProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Cart Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }} className="cart-layout">
          {/* Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cartItems.map((item) => {
              const product = item.product || {};
              const pid = item.product_id || product.id;
              const price = Number(product.price || item.price || 0);

              return (
                <div
                  key={pid}
                  id={`cart-item-${pid}`}
                  className="glass-card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    flexWrap: 'wrap'
                  }}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      backgroundColor: '#161e2e'
                    }}
                  />

                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <Link to={`/product/${product.slug || pid}`} style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {product.name}
                    </Link>
                    <div style={{ fontSize: '0.85rem', color: '#06b6d4', marginTop: '4px' }}>
                      ${price.toFixed(2)} each
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px'
                  }}>
                    <button
                      id={`cart-decrease-${pid}`}
                      onClick={() => updateQuantity(pid, item.quantity - 1)}
                      style={{ background: 'none', border: 'none', color: '#fff', padding: '8px 12px', cursor: 'pointer' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span id={`cart-qty-${pid}`} style={{ width: '32px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                      {item.quantity}
                    </span>
                    <button
                      id={`cart-increase-${pid}`}
                      onClick={() => updateQuantity(pid, item.quantity + 1)}
                      style={{ background: 'none', border: 'none', color: '#fff', padding: '8px 12px', cursor: 'pointer' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Subtotal for line item */}
                  <div style={{ textAlign: 'right', minWidth: '90px' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                      ${(price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    id={`cart-remove-${pid}`}
                    onClick={() => removeFromCart(pid)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-subtle)',
                      cursor: 'pointer',
                      padding: '8px'
                    }}
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="glass-card" style={{ padding: '28px', position: 'sticky', top: '90px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '20px' }}>Order Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Subtotal ({cartSummary.itemCount} items)</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>${cartSummary.subtotal.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Shipping</span>
                  <span style={{ color: cartSummary.shipping === 0 ? '#10b981' : 'var(--text-main)', fontWeight: 600 }}>
                    {cartSummary.shipping === 0 ? 'FREE' : `$${cartSummary.shipping.toFixed(2)}`}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Estimated Tax (8%)</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>${cartSummary.tax.toFixed(2)}</span>
                </div>

                {promoDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                    <span>Promo Discount (10%)</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '1.3rem',
                  fontWeight: 800
                }}>
                  <span>Total</span>
                  <span id="cart-total-amount" style={{ color: '#818cf8' }}>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    id="promo-code-input"
                    type="text"
                    placeholder="Promo code (e.g. CLOUDCART10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <button type="submit" id="apply-promo-btn" className="btn btn-secondary btn-sm">
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '0.8rem',
                    color: promoMessage.type === 'success' ? '#10b981' : '#f87171'
                  }}>
                    {promoMessage.text}
                  </div>
                )}
              </form>

              {/* Checkout Button */}
              <button
                id="proceed-to-checkout-btn"
                onClick={() => navigate('/checkout')}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '24px' }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                <ShieldCheck size={16} /> Encrypted SSL 256-bit Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
