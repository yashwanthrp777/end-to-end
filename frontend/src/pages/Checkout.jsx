import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ShieldCheck, CreditCard, Banknote, CheckCircle, Package, ArrowRight, Truck } from 'lucide-react';

export default function Checkout() {
  const { cartItems, cartSummary, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: user?.phone || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card_test'); // card_test or cod
  const [testCard, setTestCard] = useState({
    cardNumber: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '888'
  });

  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (cartItems.length === 0 && !confirmedOrder) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Please add products to your cart before proceeding to checkout.</p>
        <Link to="/products" className="btn btn-primary">Return to Catalog</Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!shipping.fullName || !shipping.street || !shipping.city || !shipping.postalCode || !shipping.phone) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    setSubmitting(true);

    try {
      const itemsPayload = cartItems.map(item => ({
        product_id: item.product_id || item.product?.id,
        quantity: item.quantity
      }));

      const res = await api.checkout({
        shipping,
        paymentMethod,
        items: itemsPayload,
        notes
      });

      if (res.success) {
        setConfirmedOrder(res.data);
        clearCart();
      } else {
        setError(res.message || 'Failed to place order.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while submitting your order.');
    } finally {
      setSubmitting(false);
    }
  };

  // If order was confirmed, show the Confirmation Screen
  if (confirmedOrder) {
    const order = confirmedOrder.order;
    const notification = confirmedOrder.notification;

    return (
      <div className="order-confirmation animate-fade-in" style={{ padding: '60px 0 100px' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div className="glass-card" style={{ padding: '48px 36px', textAlign: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <CheckCircle size={40} />
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>Order Confirmed!</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '24px' }}>
              Thank you for shopping with CloudCart. Your order has been registered and is being prepared for dispatch.
            </p>

            {/* Order Details Card */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'left',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order Number</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#818cf8' }}>{order.order_number}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Amount</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>${Number(order.total_amount).toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payment Method</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                    {order.payment_method === 'card_test' ? 'Test Mode Card (Paid)' : 'Cash on Delivery (Pending)'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shipping Destination</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{order.shipping_city}, {order.shipping_state || order.shipping_country}</div>
                </div>
              </div>

              {/* Transaction Ref Pill */}
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <span>Transaction Ref: <code style={{ color: '#06b6d4' }}>{order.transaction_ref}</code></span>
                <span>Status: <strong style={{ color: '#10b981', textTransform: 'capitalize' }}>{order.status}</strong></span>
              </div>
            </div>

            {/* Email Notification Preview Alert */}
            {notification && (
              <div style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '28px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                  <Truck size={16} /> Notification Dispatched:
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  <strong>Subject:</strong> {notification.subject}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  A confirmation receipt and courier tracking link has been routed to <strong>{notification.toEmail || user?.email}</strong>.
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/my-orders" id="view-orders-btn" className="btn btn-primary btn-lg">
                <Package size={18} /> View In My Orders
              </Link>
              <Link to="/products" className="btn btn-secondary btn-lg">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page animate-fade-in" style={{ padding: '40px 0 80px' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '8px' }}>Checkout</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '36px' }}>
          Finalize your shipping address and choose your preferred payment mode
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '36px' }} className="checkout-layout">
          {/* Main Form */}
          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Step 1: Shipping Address */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#6366f1',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}>
                  1
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Shipping & Delivery Address</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Recipient Full Name *</label>
                  <input
                    id="shipping-fullname"
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={shipping.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Street Address *</label>
                  <input
                    id="shipping-street"
                    type="text"
                    name="street"
                    required
                    placeholder="e.g. 742 Evergreen Terrace, Suite 400"
                    value={shipping.street}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    id="shipping-city"
                    type="text"
                    name="city"
                    required
                    placeholder="Springfield"
                    value={shipping.city}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State / Province</label>
                  <input
                    id="shipping-state"
                    type="text"
                    name="state"
                    placeholder="OR"
                    value={shipping.state}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Postal / ZIP Code *</label>
                  <input
                    id="shipping-postal"
                    type="text"
                    name="postalCode"
                    required
                    placeholder="97477"
                    value={shipping.postalCode}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone *</label>
                  <input
                    id="shipping-phone"
                    type="tel"
                    name="phone"
                    required
                    placeholder="+1 (555) 018-9123"
                    value={shipping.phone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Gateway Method */}
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#6366f1',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}>
                  2
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Select Payment Mode</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Option A: Test Mode Card */}
                <label
                  id="payment-mode-card"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '18px 20px',
                    borderRadius: '14px',
                    background: paymentMethod === 'card_test' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: paymentMethod === 'card_test' ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card_test"
                    checked={paymentMethod === 'card_test'}
                    onChange={() => setPaymentMethod('card_test')}
                    style={{ marginTop: '4px', accentColor: 'var(--primary)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                      <CreditCard size={18} color="#818cf8" />
                      <span>Test Mode Credit / Debit Card (Simulated Gateway)</span>
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Instant Test</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Pre-filled with simulated sandbox card credentials. Immediately records transaction as Paid.
                    </p>

                    {paymentMethod === 'card_test' && (
                      <div style={{
                        marginTop: '14px',
                        padding: '12px 16px',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        gap: '16px'
                      }}>
                        <div>Card: <code>4242 •••• •••• 4242</code></div>
                        <div>Exp: <code>12/28</code></div>
                        <div>CVV: <code>888</code></div>
                      </div>
                    )}
                  </div>
                </label>

                {/* Option B: Cash On Delivery */}
                <label
                  id="payment-mode-cod"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '18px 20px',
                    borderRadius: '14px',
                    background: paymentMethod === 'cod' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: paymentMethod === 'cod' ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    style={{ marginTop: '4px', accentColor: 'var(--primary)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                      <Banknote size={18} color="#10b981" />
                      <span>Cash On Delivery (COD)</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Pay in cash directly to the courier agent upon arrival and physical parcel verification.
                    </p>
                  </div>
                </label>
              </div>

              {/* Delivery Notes */}
              <div style={{ marginTop: '20px' }}>
                <label className="form-label">Delivery Instructions / Gate Code (Optional)</label>
                <textarea
                  id="delivery-notes"
                  rows={2}
                  placeholder="e.g. Leave with building receptionist or ring apartment 4B"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-textarea"
                />
              </div>
            </div>

            <button
              id="submit-order-btn"
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <span>{submitting ? 'Verifying & Placing Order...' : `Confirm & Place Order ($${cartSummary.total.toFixed(2)})`}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Right Summary Sidebar */}
          <div>
            <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Your Cart ({cartSummary.itemCount})</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto', marginBottom: '20px' }}>
                {cartItems.map((item) => {
                  const prod = item.product || {};
                  const pid = item.product_id || prod.id;
                  return (
                    <div key={pid} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={prod.image_url} alt={prod.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {prod.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} × ${Number(prod.price).toFixed(2)}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                        ${(item.quantity * Number(prod.price)).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>${cartSummary.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Express Shipping</span>
                  <span style={{ color: cartSummary.shipping === 0 ? '#10b981' : '#fff', fontWeight: 600 }}>
                    {cartSummary.shipping === 0 ? 'FREE' : `$${cartSummary.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Estimated Tax</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>${cartSummary.tax.toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '1.25rem',
                  fontWeight: 800
                }}>
                  <span>Total</span>
                  <span style={{ color: '#818cf8' }}>${cartSummary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
