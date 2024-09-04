'use client';

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
        {/* Información del usuario y productos */}
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

        {/* Componente de pago */}
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