import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cloudcart_guest_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [notification, setNotification] = useState(null);

  // Sync with backend if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api.getCart()
        .then(res => {
          if (res.success && res.data) {
            setCartItems(res.data.items);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Persist guest cart
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cloudcart_guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = async (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10));
    
    if (isAuthenticated) {
      try {
        const res = await api.addToCart(product.id, qty);
        if (res.success) {
          setCartItems(res.data.items);
          showToast(`Added ${qty}x "${product.name}" to cart!`);
          return;
        }
      } catch (e) {
        showToast(e.message || 'Error updating cart', 'error');
        return;
      }
    }

    // Local cart fallback for guest
    setCartItems(prev => {
      const existing = prev.find(i => (i.product_id || i.product?.id) === product.id);
      if (existing) {
        return prev.map(i => {
          if ((i.product_id || i.product?.id) === product.id) {
            return { ...i, quantity: Math.min(product.stock || 99, i.quantity + qty) };
          }
          return i;
        });
      }
      return [...prev, {
        id: Date.now(),
        product_id: product.id,
        quantity: qty,
        product: product
      }];
    });

    showToast(`Added ${qty}x "${product.name}" to cart!`);
  };

  const updateQuantity = async (productId, quantity) => {
    const qty = parseInt(quantity, 10);
    if (qty <= 0) {
      return removeFromCart(productId);
    }

    if (isAuthenticated) {
      try {
        const res = await api.updateCartItem(productId, qty);
        if (res.success) {
          setCartItems(res.data.items);
        }
        return;
      } catch (e) {}
    }

    setCartItems(prev => prev.map(item => {
      const pid = item.product_id || item.product?.id;
      if (pid === productId) {
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await api.removeFromCart(productId);
        if (res.success) {
          setCartItems(res.data.items);
          showToast('Item removed from cart');
        }
        return;
      } catch (e) {}
    }

    setCartItems(prev => prev.filter(i => (i.product_id || i.product?.id) !== productId));
    showToast('Item removed from cart');
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.clearCart();
      } catch (e) {}
    }
    setCartItems([]);
    localStorage.removeItem('cloudcart_guest_cart');
  };

  // Calculations
  const itemCount = cartItems.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const subtotal = cartItems.reduce((acc, curr) => {
    const price = Number(curr.product?.price || curr.price || 0);
    return acc + (price * curr.quantity);
  }, 0);
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.00;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  const cartSummary = {
    subtotal: Number(subtotal.toFixed(2)),
    shipping,
    tax,
    total,
    itemCount
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartSummary,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      notification
    }}>
      {children}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          background: notification.type === 'error' ? '#ef4444' : '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <span>{notification.message}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
