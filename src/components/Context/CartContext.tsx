'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Swal from 'sweetalert2'; 
import { IProduct } from '../../interfaces/Cart';

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

  useEffect(() => {
    if (token) {
      loadGlobalCart();
    } else {
      setCart([]);
    }
  }, [token]);

  useEffect(() => {
    if (token && cart.length > 0) {
      saveCartForUser();
    }
  }, [cart, token]);

  const loadGlobalCart = () => {
    if (typeof window !== 'undefined' && token) {
      const storedCart = localStorage.getItem(`cart_${token}`);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]);
      }
    }
  };

  const saveCartForUser = () => {
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem(`cart_${token}`, JSON.stringify(cart));
    }
  };

  const addToCart = (product: IProduct) => {
    if (!token) {
      Swal.fire({
        title: 'Por favor, inicia sesión!',
        text: 'Debes iniciar sesión para realizar una compra.',
        icon: 'error',
        confirmButtonText: 'Inicia Sesión',
        customClass: {
          container: 'swal-container'
        }
      }).then(() => {
        window.location.href = '/login';
      });
      return;
    }

    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);

      if (existingProductIndex >= 0) {
        const updatedCart = prevCart.map((item, index) =>
          index === existingProductIndex
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );

        return updatedCart;
      }

      const newProduct = { ...product, quantity: product.quantity };
      return [...prevCart, newProduct];
    });

    Swal.fire({
      title: 'Éxito!',
      text: 'Producto añadido al carrito.',
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        container: 'swal-container'
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(product => product.id !== productId);
      return updatedCart;
    });
  };

  const increaseQuantity = (productId: number) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(product =>
        product.id === productId && product.quantity < product.stock
          ? { ...product, quantity: product.quantity + 1 }
          : product
      );
      return updatedCart;
    });
  };

  const decreaseQuantity = (productId: number) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(product =>
        product.id === productId && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      );
      return updatedCart;
    });
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
