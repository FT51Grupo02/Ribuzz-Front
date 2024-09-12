import dynamic from 'next/dynamic';
import React from 'react';

// Carga dinámica del componente EntrepreneurQ solo en el cliente
const EntrepreneurQ = dynamic(() => import('@/components/Forms/Questions/EntrepreneurQ'), { ssr: false });

const EntrepreneurQue = () => {
  return (
    <div>
      <EntrepreneurQ />
    </div>
  );
};

export default EntrepreneurQue;
