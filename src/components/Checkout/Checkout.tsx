'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/Context/CartContext';
import { useAuth } from '../Context/AuthContext';
import PayCard from './PayCard';
import Swal from 'sweetalert2';
import { Elements } from '@stripe/react-stripe-js';
import { useStripeContext } from '../Context/StripeContext'; // Adjust path according to your structure
import { IProduct, IService, IEvent } from '../../interfaces/Cart';

interface SelectableItem {
  id: string;
  // Other optional fields if needed
}

const Checkout: React.FC = () => {
  const { user, token } = useAuth();
  const { cart, clearCart } = useCart();
  const stripe = useStripeContext(); // Use Stripe context
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orderDate, setOrderDate] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [selectedServices, setSelectedServices] = useState<SelectableItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectableItem[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<SelectableItem[]>([]);

  const router = useRouter();

  useEffect(() => {
    const date = new Date();
    setOrderDate(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
  }, []);


  const isProduct = (item: any): item is IProduct => 'price' in item && 'name' in item && 'image' in item;
  const isService = (item: any): item is IService => 'description' in item && 'price' in item;
  const isEvent = (item: any): item is IEvent => 'date' in item && 'price' in item;

 
  const sanitizedCart = cart.map(item => {
    if (isProduct(item)) {
      return { ...item, price: Number(item.price) || 0, type: 'product' };
    } else if (isService(item)) {
      return { ...item, price: Number(item.price) || 0, type: 'service' };
    } else if (isEvent(item)) {
      return { ...item, price: Number(item.price) || 0, type: 'event' };
    }
    return item; 
  });

  const total = sanitizedCart.reduce(
    (total, item) => total + (item.price * (item.quantity || 1)),
    0
  );

  const handlePlaceOrder = async (paymentIntent: any) => {
    setLoading(true);
    setPaymentSuccess(false);
  
    // Filtrar y mapear items del carrito según el DTO
    const products = sanitizedCart.filter(isProduct).map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));
  
    const service = sanitizedCart.filter(isService).map(item => ({
      id: item.id,
      description: item.description,
      price: item.price,
    }));
  
    const events = sanitizedCart.filter(isEvent).map(item => ({
      id: item.id,
      date: item.date,
      price: item.price,
    }));
  
    // Construir el cuerpo de la solicitud
    const requestBody = {
      userId: user?.id,
      products: products.length > 0 ? products : undefined, // No enviar si está vacío
      service: service.length > 0 ? service : undefined, // No enviar si está vacío
      events: events.length > 0 ? events : undefined, // No enviar si está vacío
    };
  
    // Mostrar en consola para depuración
    console.log('Placing order with the following details:');
    console.log(requestBody);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const result = await response.json();
  
      console.log('Response from backend:', result);
  
      if (result.error) {
        setError(result.error);
        Swal.fire('Error', result.error, 'error');
      } else {
        setPaymentSuccess(true);
        Swal.fire('Éxito', 'La compra se realizó con éxito', 'success');
        clearCart();
        router.push('/cart');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Error placing the order.');
      Swal.fire('Error', 'Error placing the order.', 'error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white p-4 bg-opacity-80">
      <h1 className="text-3xl font-bold mb-4 text-center">Order Details</h1>
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        <div className="flex-1 mb-4 lg:w-2/3">
          <div className="bg-transparent p-6 rounded-lg shadow-lg border border-transparent mb-6">
            <h2 className="text-2xl text-pink-400 font-bold mb-4 border-b border-gray-600 pb-2">
              User Information
            </h2>
            {user ? (
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="font-bold">Name:</span>
                  <span>{user.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Email:</span>
                  <span>{user.email}</span>
                </div>
              </div>
            ) : (
              <p>Please log in to proceed with payment.</p>
            )}
          </div>

          <div className="bg-transparent p-6 rounded-lg shadow-lg border border-transparent">
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-600 pb-2 text-pink-400">
              Shopping Cart
            </h2>
            <div className="space-y-4">
              {sanitizedCart.map((item, index) => {
                if (isProduct(item)) {
                  return (
                    <div key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  );
                } else if (isService(item)) {
                  return (
                    <div key={index} className="flex justify-between">
                      <span>{item.description}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  );
                } else if (isEvent(item)) {
                  return (
                    <div key={index} className="flex justify-between">
                      <span>{item.date}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  );
                }
                return null; // Fallback if item doesn't match known types
              })}
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 lg:w-1/3">
          <Elements stripe={stripe}>
            <PayCard onPaymentSuccess={handlePlaceOrder} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


/*  'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/Context/CartContext';
import { useAuth } from '../Context/AuthContext';
import PayCard from './PayCard';
import Swal from 'sweetalert2';
import { Elements } from '@stripe/react-stripe-js';
import { useStripeContext } from '../Context/StripeContext'; // Ajusta la ruta según tu estructura

interface SelectableItem {
  id: string;
  // Otros campos opcionales si es necesario
}

const Checkout: React.FC = () => {
  const { user, token } = useAuth();
  const { cart, clearCart } = useCart();
  const stripe = useStripeContext(); // Usar el contexto de Stripe
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orderDate, setOrderDate] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [selectedServices, setSelectedServices] = useState<SelectableItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectableItem[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<SelectableItem[]>([]);

  const router = useRouter();

  useEffect(() => {
    const date = new Date();
    setOrderDate(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
  }, []);

  const sanitizedCart = cart.map((product) => ({
    ...product,
    price: Number(product.price) || 0,
  }));

  const total = sanitizedCart.reduce(
    (total, product) => total + product.price * (product.quantity || 1),
    0
  );

  const handlePlaceOrder = async (paymentIntent: any) => {
    setLoading(true);
    setPaymentSuccess(false);
  
    console.log("Datos para enviar al backend:");
    console.log({
      userId: user?.id,
      products: selectedProducts.map(item => ({ id: item.id })),
      service: selectedServices.map(item => ({ id: item.id })),
      events: selectedEvents.map(item => ({ id: item.id })),
      totalAmount: total,
      paymentIntentId: paymentIntent.id,
      orderDate: orderDate,
    });
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          products: selectedProducts.map(item => ({ id: item.id })),
          service: selectedServices.map(item => ({ id: item.id })),
          events: selectedEvents.map(item => ({ id: item.id })),
          totalAmount: total,
          paymentIntentId: paymentIntent.id,
          orderDate: orderDate,
        }),
      });
  
      const result = await response.json();
      console.log("Resultado de la respuesta del backend:", result);
      
      if (result.error) {
        setError(result.error);
        Swal.fire('Error', result.error, 'error');
      } else {
        setPaymentSuccess(true);
        Swal.fire('Éxito', 'Compra realizada con éxito', 'success');
        clearCart();
        router.push('/cart');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al realizar la compra.');
      Swal.fire('Error', 'Error al realizar la compra.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 bg-opacity-80">
      <h1 className="text-3xl font-bold mb-4 text-center">Detalles de la orden</h1>
      <div className="flex flex-col lg:flex-row lg:space-x-8">
     
        <div className="flex-1 mb-4 lg:w-2/3">
          <div className="bg-transparent p-6 rounded-lg shadow-lg border border-transparent mb-6">
            <h2 className="text-2xl text-pink-400 font-bold mb-4 border-b border-gray-600 pb-2">
              Información del usuario
            </h2>
            {user ? (
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="font-bold">Nombre:</span>
                  <span>{user.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Correo:</span>
                  <span>{user.email}</span>
                </div>
              </div>
            ) : (
              <p>Por favor, inicie sesión para proceder con el pago.</p>
            )}
          </div>

          <div className="bg-transparent p-6 rounded-lg shadow-lg border border-transparent">
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-600 pb-2 text-pink-400">
              Carrito de compras
            </h2>
            <div className="space-y-4">
              {sanitizedCart.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 lg:w-1/3">
          <Elements stripe={stripe}>
            <PayCard onPaymentSuccess={handlePlaceOrder} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Checkout;   */