'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import Loader from '@/components/Loader/Loader';

// Crear contexto de Stripe
const StripeContext = createContext<Stripe | null>(null);

// Recuperar la clave pública de Stripe
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '';

export const StripeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(stripePublicKey);
        setStripe(stripeInstance);
      } catch (error) {
        console.error('Error initializing Stripe:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  

  if (loading) {
    return <Loader />;
  }

  return (
    <StripeContext.Provider value={stripe}>
      {children}
    </StripeContext.Provider>
  );
};

export const useStripeContext = () => {
  const context = useContext(StripeContext);
  console.log('useStripeContext called, context:', context);
  if (!context) {
    throw new Error('useStripeContext must be used within a StripeProvider');
  }
  return context;
};