"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ICartProduct, ICartEvent, ICartService } from '@/interfaces/Cart';

interface CartContextProps {
  cart: (ICartProduct | ICartEvent | ICartService)[];
  addToCart: (item: ICartProduct | ICartEvent | ICartService) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<(ICartProduct | ICartEvent | ICartService)[]>([]);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  }, []);

  // Guardar el carrito en localStorage cuando cambie
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);


  const addToCart = (item: ICartProduct | ICartEvent | ICartService) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart, item];
      return updatedCart;
    });
  };

  const removeFromCart = (productId: string) => {
    // Filtra el carrito para eliminar el producto con el ID especificado
    const updatedCart = cart.filter(item => item.id !== productId);
  
    // Actualiza el estado del carrito
    setCart(updatedCart);
  
    // Actualiza el carrito en el localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
  
    setCart([]);
  
    localStorage.removeItem('cart');
  };

  const increaseQuantity = (productId: string) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId: string) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity, updateQuantity }}>
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