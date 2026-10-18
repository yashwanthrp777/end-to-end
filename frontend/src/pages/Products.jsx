import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter states
  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'featured';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentInStock = searchParams.get('inStock') === 'true';

  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({
            category: currentCategory,
            search: currentSearch,
            sort: currentSort,
            minPrice: currentMinPrice,
            maxPrice: currentMaxPrice,
            inStock: currentInStock,
            limit: 24
          }),
          api.getCategories()
        ]);

        if (prodRes.success) {
          setProducts(prodRes.data.products);
          setTotal(prodRes.data.total);
        }
        if (catRes.success) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === 'all' || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    setSearchParams(newParams);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (minPriceInput) newParams.set('minPrice', minPriceInput);
    else newParams.delete('minPrice');
    if (maxPriceInput) newParams.set('maxPrice', maxPriceInput);
    else newParams.delete('maxPrice');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams({});
  };

  const hasActiveFilters = currentCategory !== 'all' || currentSearch || currentMinPrice || currentMaxPrice || currentInStock;

  return (
    <div className="products-page animate-fade-in" style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '36px'
        }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Explore Hardware Catalog</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
              Showing {products.length} of {total} precision-engineered devices and workspace gear
            </p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <SearchBar
              initialValue={currentSearch}
              onSearch={(val) => updateParam('search', val)}
              placeholder="Search by keywords, models, or specifications..."
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Sort Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowUpDown size={16} color="var(--text-muted)" />
                <select
                  id="sort-select"
                  className="form-select"
                  value={currentSort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  style={{ width: 'auto', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem' }}
                >
                  <option value="featured">Featured First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                id="mobile-filter-toggle"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Filters:</span>
              {currentCategory !== 'all' && (
                <span className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => updateParam('category', 'all')}>
                  Category: {currentCategory} <X size={12} />
                </span>
              )}
              {currentSearch && (
                <span className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => updateParam('search', '')}>
                  Search: "{currentSearch}" <X size={12} />
                </span>
              )}
              {(currentMinPrice || currentMaxPrice) && (
                <span className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => { setMinPriceInput(''); setMaxPriceInput(''); updateParam('minPrice', ''); updateParam('maxPrice', ''); }}>
                  Price: ${currentMinPrice || '0'} - ${currentMaxPrice || '∞'} <X size={12} />
                </span>
              )}
              {currentInStock && (
                <span className="badge badge-success" style={{ cursor: 'pointer' }} onClick={() => updateParam('inStock', false)}>
                  In Stock Only <X size={12} />
                </span>
              )}
              <button
                id="clear-all-filters-btn"
                onClick={clearAllFilters}
                style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.82rem', cursor: 'pointer', marginLeft: '8px', textDecoration: 'underline' }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }} className="products-layout">
          {/* Desktop Filter Sidebar */}
          <aside className={`filter-sidebar ${mobileFilterOpen ? 'open' : ''}`} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Category Filter */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Categories
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  id="filter-cat-all"
                  onClick={() => updateParam('category', 'all')}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: currentCategory === 'all' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    color: currentCategory === 'all' ? '#a5b4fc' : 'var(--text-main)',
                    fontWeight: currentCategory === 'all' ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>All Categories</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{total}</span>
                </button>

                {categories.map(cat => {
                  const isActive = currentCategory === cat.slug || currentCategory === String(cat.id);
                  return (
                    <button
                      key={cat.id}
                      id={`filter-cat-${cat.slug}`}
                      onClick={() => updateParam('category', cat.slug)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                        color: isActive ? '#a5b4fc' : 'var(--text-main)',
                        fontWeight: isActive ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>{cat.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.product_count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Price Range ($)
              </h3>
              <form onSubmit={handlePriceApply} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    id="min-price-input"
                    type="number"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem'
                    }}
                  />
                  <span style={{ color: 'var(--text-muted)' }}>–</span>
                  <input
                    id="max-price-input"
                    type="number"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
                <button type="submit" id="apply-price-btn" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  Apply Price
                </button>
              </form>
            </div>

            {/* In-Stock Toggle */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  id="in-stock-checkbox"
                  checked={currentInStock}
                  onChange={(e) => updateParam('inStock', e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>In-Stock Ready to Ship</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                Loading hardware products...
              </div>
            ) : products.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No products match your criteria</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Try relaxing your price filters, clearing search terms, or exploring all categories.
                </p>
                <button onClick={clearAllFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .products-layout {
            grid-template-columns: 1fr !important;
          }
          .filter-sidebar {
            display: none !important;
          }
          .filter-sidebar.open {
            display: flex !important;
            margin-bottom: 24px;
          }
        }
        @media (min-width: 901px) {
          #mobile-filter-toggle {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
