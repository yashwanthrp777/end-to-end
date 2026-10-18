import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#070a11',
      borderTop: '1px solid var(--border-subtle)',
      marginTop: '80px',
      paddingTop: '60px',
      paddingBottom: '40px'
    }}>
      <div className="container">
        {/* Value Propositions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          paddingBottom: '40px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '50px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
              <Truck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Free Express Shipping</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>On all orders over $150</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>2-Year Comprehensive Warranty</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Genuine manufacturer guarantee</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
              <RefreshCw size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>30-Day Hassle-Free Returns</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instant refund or exchange</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Flexible Checkout</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cash on delivery & secure test card</div>
            </div>
          </div>
        </div>

        {/* Footer Links & Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBag size={18} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>CloudCart</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Architected for speed, reliability, and precision. Delivering premium audio, developer workstations, and ambient workspace hardware directly to your doorstep.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '18px', color: 'var(--text-main)' }}>Product Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><Link to="/products?category=audio-sound">Audio & Sound Gear</Link></li>
              <li><Link to="/products?category=wearables-watches">Wearables & Watches</Link></li>
              <li><Link to="/products?category=laptops-computing">Creator Laptops</Link></li>
              <li><Link to="/products?category=smart-home-office">Smart Home & Office</Link></li>
              <li><Link to="/products?category=photography-video">Photography & Cinema</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '18px', color: 'var(--text-main)' }}>Customer Care</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><Link to="/my-orders">Track Orders</Link></li>
              <li><Link to="/cart">Review Bag</Link></li>
              <li><Link to="/login">Account Access</Link></li>
              <li><a href="#help">Shipping Rates & Policy</a></li>
              <li><a href="#terms">Privacy & Security</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '18px', color: 'var(--text-main)' }}>CloudCart Insider</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Subscribe to unlock early access to limited edition product drops and tech hardware updates.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  flex: 1,
                  outline: 'none'
                }}
              />
              <button className="btn btn-primary btn-sm" type="button">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingTop: '24px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.82rem',
          color: 'var(--text-subtle)'
        }}>
          <div>© 2026 CloudCart Inc. Designed for high-performance cloud shopping.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>Test Card Simulation</span>
            <span>•</span>
            <span>PostgreSQL Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
