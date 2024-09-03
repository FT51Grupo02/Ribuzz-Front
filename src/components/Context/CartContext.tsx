'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import Swal from 'sweetalert2';

export interface IProduct {
  name: string;
  price: number;
  image: string;
  description?: string;
  stock: number;
  categoryId: number;
  id: number;
  quantity: number;
}

interface CartContextProps {
  cart: IProduct[];
  addToCart: (product: IProduct) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
}

const CartContext = createContext<CartContextProps>({
  cart: [],
  addToCart: () => {
    console.warn('addToCart not implemented');
  },
  removeFromCart: () => {
    console.warn('removeFromCart not implemented');
  },
  clearCart: () => {
    console.warn('clearCart not implemented');
  },
  increaseQuantity: () => {
    console.warn('increaseQuantity not implemented');
  },
  decreaseQuantity: () => {
    console.warn('decreaseQuantity not implemented');
  },
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState<IProduct[]>([]);

  const loadGlobalCart = useCallback(() => {
    if (typeof window !== 'undefined' && token) {
      const storedCart = localStorage.getItem(`cart_${token}`);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]);
      }
    }
  }, [token]);

  const saveCartForUser = useCallback(() => {
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem(`cart_${token}`, JSON.stringify(cart));
    }
  }, [token, cart]);

  useEffect(() => {
    if (token) {
      loadGlobalCart();
    } else {
      setCart([]);
    }
  }, [token, loadGlobalCart]);

  useEffect(() => {
    if (token && cart.length > 0) {
      saveCartForUser();
    }
  }, [cart, token, saveCartForUser]);

  const addToCart = (product: IProduct) => {
    if (!token) {
      Swal.fire({
        title: 'Por favor, inicia sesión!',
        text: 'Debes iniciar sesión para realizar una compra.',
        icon: 'error',
        confirmButtonText: 'Inicia Sesión',
        customClass: {
          container: 'swal-container',
        },
      }).then(() => {
        window.location.href = '/login';
      });
      return;
    }

    const isProductInCart = cart.some(cartItem => cartItem.id === product.id);
    if (isProductInCart) {
      Swal.fire({
        title: 'Ojo!',
        text: 'Este producto ya se encuentra en el carrito.',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal-container',
        },
      });
      return;
    }

    setCart(prevCart => {
      const productIndex = prevCart.findIndex(item => item.id === product.id);

      if (productIndex > -1) {
        Swal.fire({
          title: 'Ojo!',
          text: 'Este producto ya se encuentra en el carrito.',
          icon: 'warning',
          confirmButtonText: 'OK',
          customClass: {
            container: 'swal-container',
          },
        });
        return prevCart;
      }

      const updatedCart = [...prevCart, { ...product, quantity: 1 }].sort((a, b) => a.price - b.price);
      return updatedCart;
    });

    Swal.fire({
      title: 'Éxito!',
      text: 'Producto añadido al carrito.',
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        container: 'swal-container',
      },
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(product => product.id !== productId));
  };

  const increaseQuantity = (productId: number) => {
    setCart(prevCart =>
      prevCart.map(product =>
        product.id === productId && product.quantity < product.stock
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart(prevCart =>
      prevCart.map(product =>
        product.id === productId && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const clearCart = () => {
    if (typeof window !== 'undefined' && token) {
      localStorage.removeItem(`cart_${token}`);
      setCart([]);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
