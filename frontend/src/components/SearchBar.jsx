import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ initialValue = '', onSearch, placeholder = 'Search by keyword, category, or spec...' }) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
      <input
        id="search-bar-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '14px 44px 14px 44px',
          borderRadius: '14px',
          background: 'rgba(18, 24, 38, 0.9)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-main)',
          fontSize: '0.95rem',
          outline: 'none',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s ease'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--primary)';
          e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border-subtle)';
          e.target.style.boxShadow = 'var(--shadow-sm)';
        }}
      />
      <Search
        size={19}
        color="var(--text-muted)"
        style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          id="search-clear-btn"
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
