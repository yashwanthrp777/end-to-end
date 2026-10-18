import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Package, Clock, CheckCircle, Truck, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getMyOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to load user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be restored immediately.')) {
      return;
    }

    setCancellingId(orderId);
    try {
      const res = await api.cancelOrder(orderId);
      if (res.success) {
        setFeedbackMessage({ text: 'Order was successfully cancelled.', type: 'success' });
        loadOrders();
      }
    } catch (err) {
      setFeedbackMessage({ text: err.message || 'Could not cancel order.', type: 'error' });
    } finally {
      setCancellingId(null);
    }
  };

  const statusBadges = {
    pending: { label: 'Pending Approval', class: 'badge-warning', icon: <Clock size={12} /> },
    confirmed: { label: 'Confirmed', class: 'badge-primary', icon: <CheckCircle size={12} /> },
    processing: { label: 'Processing in Warehouse', class: 'badge-primary', icon: <Package size={12} /> },
    shipped: { label: 'In Transit / Courier', class: 'badge-primary', icon: <Truck size={12} /> },
    delivered: { label: 'Delivered', class: 'badge-success', icon: <CheckCircle size={12} /> },
    cancelled: { label: 'Cancelled', class: 'badge-danger', icon: <XCircle size={12} /> }
  };

  const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

  const getStepIndex = (status) => {
    if (status === 'cancelled') return -1;
    return steps.indexOf(status);
  };

  return (
    <div className="orders-page animate-fade-in" style={{ padding: '40px 0 80px' }}>
      <div className="container">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Order History & Tracking</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Inspect shipment milestones, receipts, and order statuses
          </p>
        </div>

        {feedbackMessage && (
          <div style={{
            background: feedbackMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${feedbackMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: feedbackMessage.type === 'success' ? '#6ee7b7' : '#fca5a5',
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            {feedbackMessage.text}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Retrieving your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '16px' }}>
            <Package size={48} color="#818cf8" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No Orders Placed Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              You haven't ordered any hardware devices yet. Ready to experience next-gen tech?
            </p>
            <Link to="/products" className="btn btn-primary">
              Browse Store Catalog <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map((order) => {
              const currentStep = getStepIndex(order.status);
              const isCancellable = order.status === 'pending' || order.status === 'processing';
              const badgeInfo = statusBadges[order.status] || statusBadges.pending;

              return (
                <div key={order.id} id={`order-card-${order.order_number}`} className="glass-card" style={{ padding: '28px' }}>
                  {/* Top Bar of the Order */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '16px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#818cf8' }}>
                          #{order.order_number}
                        </span>
                        <span className={`badge ${badgeInfo.class}`}>
                          {badgeInfo.icon} {badgeInfo.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                        ${Number(order.total_amount).toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Payment: <strong>{order.payment_method === 'card_test' ? 'Card (Paid)' : 'COD'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Status Progress Timeline */}
                  {order.status !== 'cancelled' ? (
                    <div style={{ padding: '24px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', position: 'relative' }}>
                        {steps.map((st, idx) => {
                          const isDone = idx <= currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div key={st} style={{ textAlign: 'center' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: isDone ? '#6366f1' : 'rgba(255, 255, 255, 0.08)',
                                color: isDone ? '#fff' : 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 8px',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                boxShadow: isCurrent ? '0 0 12px rgba(99, 102, 241, 0.7)' : 'none'
                              }}>
                                {idx + 1}
                              </div>
                              <div style={{
                                fontSize: '0.75rem',
                                fontWeight: isCurrent ? 700 : 500,
                                color: isDone ? '#f9fafb' : 'var(--text-subtle)',
                                textTransform: 'capitalize'
                              }}>
                                {st}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      padding: '16px',
                      background: 'rgba(239, 68, 68, 0.08)',
                      borderRadius: '10px',
                      margin: '16px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#fca5a5',
                      fontSize: '0.88rem'
                    }}>
                      <AlertTriangle size={18} /> This order was cancelled and inventory was returned to stock.
                    </div>
                  )}

                  {/* Order Items Preview */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 0' }}>
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.product_name}
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#131b2e' }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.product_name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          ${(item.quantity * Number(item.price)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Actions */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      Shipping To: <strong style={{ color: 'var(--text-main)' }}>{order.shipping_name}</strong> ({order.shipping_city}, {order.shipping_state || order.shipping_country})
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      {isCancellable && (
                        <button
                          id={`cancel-order-${order.id}`}
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                          className="btn btn-danger btn-sm"
                        >
                          {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
