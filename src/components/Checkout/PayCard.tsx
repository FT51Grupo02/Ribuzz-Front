'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthContext';

interface PayCardProps {
  onPaymentSuccess: (paymentIntent: any) => void;
}

const PayCard: React.FC<PayCardProps> = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart  } = useCart();
  const { token } = useAuth();

  const formik = useFormik({
    initialValues: {
      cardName: '',
    },
    validationSchema: Yup.object({
      cardName: Yup.string().required('El nombre en la tarjeta es obligatorio'),
    }),
    onSubmit: async (values) => {
      if (!stripe || !elements) {
        console.error('Stripe o Elements no están cargados.');
        return;
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        console.error('CardElement no encontrado');
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: values.cardName,
        },
      });

      if (error) {
        console.error('Error al crear PaymentMethod:', error);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            cart: cart.map(item => ({
              description: item.description,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              _id: item.id,
            })),
            payment_method_id: paymentMethod.id,
          }),
        });

        const paymentIntent = await response.json();

        if (paymentIntent.error) {
          console.error('Error del backend:', paymentIntent.error);
          return;
        }

        clearCart();

        onPaymentSuccess(paymentIntent);
        
      } catch (error) {
        console.error('Error en la solicitud al backend:', error);
      }
    },
  });

  return (
    <div className="bg-transparent p-4 rounded-lg shadow-lg border border-transparent max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 border-b border-gray-600 pb-2 text-pink-400">Información de Pago</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cardName" className="block text-sm font-medium">Nombre en la tarjeta</label>
          <input
            id="cardName"
            name="cardName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.cardName}
            className="w-full p-3 mt-1 bg-black border border-pink-400 border-opacity-40 text-white rounded-lg text-sm md:text-base"
          />
          {formik.touched.cardName && formik.errors.cardName ? (
            <div className="text-pink-300 text-xs md:text-sm mt-1">{formik.errors.cardName}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="cardElement" className="block text-sm font-medium">Detalles de Tarjeta</label>
          <CardElement
            id="cardElement"
            options={{
              style: {
                base: {
                  color: '#ffffff',
                  backgroundColor: '#000000',
                  fontSize: '16px',
                  '::placeholder': {
                    color: '#a0a0a0',
                  },
                },
                invalid: {
                  color: '#ff0000',
                },
              },
            }}
            className="w-full p-3 mt-1 bg-black border border-pink-400 border-opacity-40 rounded-lg text-sm md:text-base"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full p-3 mt-4 bg-gradient-to-r from-[#C87DAB] to-[#C12886] text-white font-bold rounded-full text-sm md:text-base"
          >
            <span className="inline-block transition duration-300 hover:scale-110">
              Realizar Compra
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayCard; 