import dynamic from 'next/dynamic';
import React from 'react';

// Carga dinámica del componente ClientQ solo en el cliente
const ClientQ = dynamic(() => import('@/components/Forms/Questions/ClientQ'), { ssr: false });

const ClientQue = () => {
  return (
    <div>
      <ClientQ />
    </div>
  );
};

export default ClientQue;