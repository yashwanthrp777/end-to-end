import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User, LogOut, ShieldCheck, Package, Menu, X, Search } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartSummary } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px',
        gap: '20px'
      }}>
        {/* Brand Logo */}
        <Link to="/" id="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
          }}>
            <ShoppingBag size={22} color="#ffffff" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.45rem',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(90deg, #ffffff, #c7d2fe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Cloud<span style={{ color: '#06b6d4', WebkitTextFillColor: '#06b6d4' }}>Cart</span>
          </span>
        </Link>

        {/* Search bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} style={{
          display: 'none',
          alignItems: 'center',
          flex: 1,
          maxWidth: '440px',
          position: 'relative'
        }} className="desktop-search">
          <input
            id="nav-search-input"
            type="text"
            placeholder="Search audio, creator laptops, smart desk..."
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 42px',
              borderRadius: '9999px',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <Search size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
        </form>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/products" id="nav-products-link" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Explore All
          </Link>

          {/* Cart Trigger */}
          <Link to="/cart" id="nav-cart-btn" style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            padding: '8px 14px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            gap: '8px'
          }}>
            <ShoppingBag size={19} color="#a5b4fc" />
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>${cartSummary.subtotal.toFixed(2)}</span>
            {cartSummary.itemCount > 0 && (
              <span id="nav-cart-badge" style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#6366f1',
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 800,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(99, 102, 241, 0.7)'
              }}>
                {cartSummary.itemCount}
              </span>
            )}
          </Link>

          {/* User Section */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                id="user-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '220px',
                  backgroundColor: '#111827',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                  </div>

                  <Link
                    to="/my-orders"
                    id="menu-orders-link"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '6px', fontSize: '0.88rem' }}
                  >
                    <Package size={16} /> My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      id="menu-admin-link"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '6px', fontSize: '0.88rem', color: '#a5b4fc' }}
                    >
                      <ShieldCheck size={16} /> Admin Dashboard
                    </Link>
                  )}

                  <button
                    id="menu-logout-btn"
                    onClick={() => { logout(); setUserDropdownOpen(false); navigate('/'); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.88rem',
                      color: '#f87171',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" id="nav-login-btn" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" id="nav-register-btn" className="btn btn-primary btn-sm">
                Join Free
              </Link>
            </div>
          )}
        </nav>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-search {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
