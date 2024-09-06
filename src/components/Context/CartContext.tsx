'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import Swal from 'sweetalert2';
import { IProduct, IService, IEvent } from '../../interfaces/Cart';

type CartItem = IProduct | IService | IEvent;

interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  increaseQuantity: (itemId: number) => void;
  decreaseQuantity: (itemId: number) => void;
  prepareDataForBackend: () => {
    products: IProduct[];
    services: IService[];
    events: IEvent[];
  };
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
  prepareDataForBackend: () => ({
    products: [],
    services: [],
    events: [],
  }),
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const addToCart = (item: CartItem) => {
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

    const isItemInCart = cart.some(cartItem => cartItem.id === item.id);
    if (isItemInCart) {
      Swal.fire({
        title: 'Ojo!',
        text: 'Este ítem ya se encuentra en el carrito.',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal-container'
        }
      });
      return;
    }

    setCart(prevCart => {
      const updatedCart = [...prevCart, { ...item, quantity: 1 }];
      return updatedCart.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    });

    Swal.fire({
      title: 'Éxito!',
      text: 'Ítem añadido al carrito.',
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        container: 'swal-container'
      }
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const increaseQuantity = (itemId: number) => {
    setCart(prevCart => 
      prevCart.map(item =>
        item.id === itemId && 'quantity' in item && (item as IProduct).quantity < (item as IProduct).stock
          ? { ...item, quantity: (item as IProduct).quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (itemId: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId && 'quantity' in item && (item as IProduct).quantity > 1
          ? { ...item, quantity: (item as IProduct).quantity - 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    if (typeof window !== 'undefined' && token) {
      localStorage.removeItem(`cart_${token}`);
      setCart([]);
    }
  };

  const prepareDataForBackend = () => {
    return {
      products: cart.filter(item => 'price' in item) as IProduct[],
      services: cart.filter(item => 'description' in item) as IService[],
      events: cart.filter(item => 'date' in item) as IEvent[],
    };
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity, prepareDataForBackend }}>
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


/* 'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Swal from 'sweetalert2'; 
import {IProduct, IService, IEvent} from '../../interfaces/Cart'

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
        title: 'Por favor, inicia sesion!',
        text: 'Debes iniciar sesion para realizar una compra.',
        icon: 'error',
        confirmButtonText: 'Inicia Sesion',
        customClass: {
          container: 'swal-container'
        }
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
          container: 'swal-container'
        }
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
            container: 'swal-container'
          }
        });
        return prevCart;
      }

      const updatedCart = [...prevCart, { ...product, quantity: 1 }].sort((a, b) => a.price - b.price);
      return updatedCart;
    });
    Swal.fire({
      title: 'Exito!',
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
};   */