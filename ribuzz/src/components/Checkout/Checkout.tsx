'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/Context/CartContext';
import { useAuth } from '../Context/AuthContext';
import PayCard from './PayCard';
import Swal from 'sweetalert2';
import { Elements } from '@stripe/react-stripe-js';
import { useStripeContext } from '../Context/StripeContext'; // Ajusta la ruta según tu estructura
import Image from 'next/image'; // Importar el componente Image de Next.js

const Checkout: React.FC = () => {
  const { user, token } = useAuth();
  const { cart, clearCart } = useCart();
  const stripe = useStripeContext(); // Usar el contexto de Stripe
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orderDate, setOrderDate] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

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
          cart: sanitizedCart,
          total,
          paymentIntentId: paymentIntent.id,
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
                <div className="py-2">
                  <p className="text-sm font-medium">Nombre:</p>
                  <p className="text-lg font-semibold">{user.name}</p>
                </div>
                <div className="py-2">
                  <p className="text-sm font-medium">Email:</p>
                  <p className="text-lg font-semibold">{user.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Información de usuario no encontrada.</p>
            )}
            <div className="mt-6 pt-4 border-t border-gray-600">
              <p className="text-sm font-medium">Día y hora de la orden:</p>
              <p className="text-lg font-semibold">{orderDate}</p>
            </div>
          </div>

          <div className="bg-transparent p-4 rounded-lg shadow-lg border border-transparent mb-6">
            <h2 className="text-2xl font-bold mb-2 text-pink-400 max-md:text-center">Productos</h2>
            {sanitizedCart.length === 0 ? (
              <p>No hay productos.</p>
            ) : (
              <div className="space-y-4">
                {sanitizedCart.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b py-2 border-gray-600"
                  >
                    <div className="flex items-center mb-2 sm:mb-0 w-full sm:w-auto">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col ml-4">
                        <span className="text-sm sm:text-base truncate text-pink-300">{product.name}</span>
                        <div className="flex flex-col sm:flex-row mt-2 sm:mt-0">
                          <span className="text-sm sm:text-base">Unidades: {product.quantity}</span>
                          <span className="text-sm sm:text-base sm:ml-4">${(product.price * product.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Componente de pago y resumen */}
        <div className="lg:w-1/3 flex flex-col lg:sticky lg:top-0 lg:space-y-6 lg:ml-8">
          <div className="bg-transparent p-4 rounded-lg shadow-lg border border-transparent mb-6">
            <Elements stripe={stripe}>
              <PayCard onPaymentSuccess={handlePlaceOrder} />
            </Elements>
          </div>

          <div className="bg-transparent p-4 rounded-lg shadow-lg border border-transparent flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-xl font-bold mb-2 text-pink-400 max-md:text-center">Resumen de la orden</h2>
              <p className="text-lg sm:text-xl max-md:text-center">
                <strong>Total:</strong> ${total.toFixed(2)}
              </p>
            </div>
            {/* <div className="mt-4 lg:mt-0">
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button
                onClick={() => handlePlaceOrder({ id: 'payment-intent-id' })}
                className={`w-full p-3 md:p-4 mb-4 text-white font-semibold rounded-full bg-gradient-to-r from-[#C87DAB] to-[#C12886] shadow-md hover:shadow-lg transition-shadow text-sm md:text-base ${
                  loading || !paymentSuccess ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading || !paymentSuccess}
              >
                <span className="inline-block transition duration-300 hover:scale-110">
                  {loading ? 'Procesando...' : 'Realizar compra'}
                </span>
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
