import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Zap, Shield, Cpu, Headphones, Watch, Laptop, Camera, ChevronRight } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getFeaturedProducts(),
          api.getCategories()
        ]);
        if (prodRes.success) setFeaturedProducts(prodRes.data);
        if (catRes.success) setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const categoryIcons = {
    'audio-sound': <Headphones size={22} />,
    'wearables-watches': <Watch size={22} />,
    'laptops-computing': <Laptop size={22} />,
    'smart-home-office': <Cpu size={22} />,
    'photography-video': <Camera size={22} />
  };

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '70px 0 90px',
        overflow: 'hidden'
      }}>
        {/* Glow backdrop circles */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.05) 60%, transparent 80%)',
          filter: 'blur(50px)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '24px'
          }}>
            <Sparkles size={16} color="#818cf8" />
            <span>Introducing Spring 2026 Studio Gear Collection</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            maxWidth: '900px',
            margin: '0 auto 24px',
            color: '#ffffff'
          }}>
            Next-Gen Tech Hardware For <br />
            <span style={{
              background: 'linear-gradient(135deg, #818cf8, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Creators & Modern Builders
            </span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            maxWidth: '680px',
            margin: '0 auto 36px',
            lineHeight: 1.6
          }}>
            Experience studio-grade active noise cancellation, 3.2K creator workstations, and aerospace titanium wearables with zero shipping delays.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/products" id="hero-explore-btn" className="btn btn-primary btn-lg">
              <span>Explore Gear Catalog</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/products?category=audio-sound" id="hero-audio-btn" className="btn btn-secondary btn-lg">
              <span>Audio & Studio</span>
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            marginTop: '60px',
            flexWrap: 'wrap',
            paddingTop: '32px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f9fafb' }}>45,000+</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Satisfied Engineers & Creators</div>
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>99.8%</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>On-Time Order Dispatch</div>
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#06b6d4' }}>2-Year</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Comprehensive Factory Warranty</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Carousel / Grid */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6366f1', fontWeight: 700 }}>
                Curated Collections
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '4px' }}>Shop By Category</h2>
            </div>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: '#a5b4fc', fontWeight: 600 }}>
              <span>View All</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                id={`category-card-${cat.slug}`}
                className="glass-card"
                style={{
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: '#818cf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {categoryIcons[cat.slug] || <Zap size={22} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {cat.product_count !== undefined ? `${cat.product_count} Products` : 'Explore hardware'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section style={{ padding: '40px 0 70px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#06b6d4', fontWeight: 700 }}>
                Handpicked Innovations
              </span>
              <h2 style={{ fontSize: '2.2rem', marginTop: '4px' }}>Featured Hardware</h2>
            </div>
            <Link to="/products" className="btn btn-secondary btn-sm" id="view-all-products-link">
              <span>Explore All {featuredProducts.length ? `(${featuredProducts.length}+)` : ''}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Loading products...
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* High-Impact Promotion Banner */}
      <section style={{ padding: '30px 0 80px' }}>
        <div className="container">
          <div className="glass-card" style={{
            padding: '50px 40px',
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8), rgba(15, 23, 42, 0.9))',
            borderRadius: '24px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '30px'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px' }}>
                <Zap size={16} /> Instant Shipping Active
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Enjoy Cash On Delivery & Instant Test Cards</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Experience zero-risk checkout! Test card transactions simulate instant approval, or choose cash on delivery when your parcel arrives.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              <Link to="/products" className="btn btn-primary btn-lg" id="promo-shop-now-btn">
                Shop Hardware Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
