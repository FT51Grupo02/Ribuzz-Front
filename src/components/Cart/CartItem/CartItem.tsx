'use client';

import React from 'react';
import { FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../Context/CartContext';
import { IProduct, IService, IEvent } from '../../../interfaces/Cart';

const CartItem: React.FC = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const isCartEmpty = cart.length === 0;

  // Sanitizar cart
  const sanitizedCart = cart.map((item) => ({
    ...item,
    price: Number(item.price) || 0,
    quantity: Number(item.quantity) || 1,
  }));

  // Calcular el total
  const total = sanitizedCart.reduce(
    (total, item) => total + (item.price * (item.quantity || 1)),
    0
  );

  console.log('Sanitized Cart:', sanitizedCart);

  return (
    <div className="relative bg-black bg-opacity-30 rounded-xl mx-auto max-w-4xl p-6">
      <div className="relative z-10">
        {isCartEmpty ? (
          <div className="text-center">
            <p className="text-xl font-bold mb-4">El carrito está vacío.</p>
            <Link href="/products">
              <button className="mt-4 bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-3 px-5 rounded-full">
                <span className="inline-block transition duration-300 hover:scale-110">
                  Explorar productos
                </span>
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-4 text-center">Tu carrito</h1>
            <div className="space-y-4">
              {sanitizedCart.map((item) => {
                // Type checks for different item types
                if ('price' in item && 'quantity' in item && 'stock' in item) {
                  const product = item as IProduct;
                  return (
                    <div
                      key={product.id}
                      className="flex flex-col md:flex-row justify-between items-center border-b border-gray-600 py-2"
                    >
                      <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="object-cover mr-4 rounded-lg"
                        />
                        <span className="text-lg md:text-xl">{product.name}</span>
                      </div>
                      <div className="flex items-center w-full md:w-auto justify-between md:justify-end">
                        <div className="flex items-center">
                          <button
                            onClick={() => decreaseQuantity(product.id)}
                            className="px-2 bg-pink-800 hover:bg-pink-600 rounded-lg text-white mx-2"
                            disabled={product.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-2">{product.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(product.id)}
                            className="px-2 mx-2 bg-pink-800 hover:bg-pink-600 rounded-lg text-white"
                            disabled={product.quantity >= product.stock}
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center ml-4 w-[150px] justify-between">
                          <span className="text-sm md:text-base text-center w-full">${(product.price * product.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="ml-4 text-pink-700 hover:text-white"
                            aria-label={`Remove ${product.name} from cart`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                } else if ('description' in item) {
                  // Handle IService here
                  return (
                    <div key={item.id} className="flex flex-col md:flex-row justify-between items-center border-b border-gray-600 py-2">
                      <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                        <span className="text-lg md:text-xl">{item.description}</span>
                      </div>
                    </div>
                  );
                } else if ('date' in item) {
                  // Handle IEvent here
                  return (
                    <div key={item.id} className="flex flex-col md:flex-row justify-between items-center border-b border-gray-600 py-2">
                      <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                        <span className="text-lg md:text-xl">{item.date}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
              <span className="text-xl font-bold">
                Total: ${total.toFixed(2)}
              </span>
              <Link href="/cart/checkout">
                <button className="bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-2 px-4 rounded-full mt-4 sm:mt-0">
                  <span className="inline-block transition duration-300 hover:scale-110">
                    Ir al detalle
                  </span>
                </button>
              </Link>
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;


/* 'use client';

import { FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../Context/CartContext';

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

const CartItem: React.FC = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const isCartEmpty = cart.length === 0;

  // Sanitizar cart
  const sanitizedCart = cart.map((product) => ({
    ...product,
    price: Number(product.price) || 0,
    quantity: Number(product.quantity) || 1,
  }));

  // Calcular el total
  const total = sanitizedCart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  return (
    <div className="relative bg-black bg-opacity-30 rounded-xl mx-auto max-w-4xl p-6">
   
      <div className="relative z-10">
        {isCartEmpty ? (
          <div className="text-center">
            <p className="text-xl font-bold mb-4">El carrito está vacío.</p>
            <Link href="/products">
              <button className="mt-4 bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-3 px-5 rounded-full">
                <span className="inline-block transition duration-300 hover:scale-110">
                  Explorar productos
                </span>
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-4 text-center">Tu carrito</h1>
            <div className="space-y-4">
              {sanitizedCart.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row justify-between items-center border-b border-gray-600 py-2"
                >
                  <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="object-cover mr-4 rounded-lg"
                    />
                    <span className="text-lg md:text-xl">{product.name}</span>
                  </div>
                  <div className="flex items-center w-full md:w-auto justify-between md:justify-end">
                    <div className="flex items-center">
                      <button
                        onClick={() => decreaseQuantity(product.id)}
                        className="px-2 bg-pink-800 hover:bg-pink-600 rounded-lg text-white mx-2"
                        disabled={product.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2">{product.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(product.id)}
                        className="px-2 mx-2 bg-pink-800 hover:bg-pink-600 rounded-lg text-white"
                        disabled={product.quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>
                  
                    <div className="flex items-center ml-4 w-[150px] justify-between">
                      <span className="text-sm md:text-base text-center w-full">${(product.price * product.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="ml-4 text-pink-700 hover:text-white"
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
              <span className="text-xl font-bold">
                Total: ${total.toFixed(2)}
              </span>
              <Link href="/cart/checkout">
                <button className="bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-2 px-4 rounded-full mt-4 sm:mt-0">
                  <span className="inline-block transition duration-300 hover:scale-110">
                    Ir al detalle
                  </span>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
 */