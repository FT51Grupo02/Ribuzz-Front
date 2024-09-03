'use client';

import React from 'react';

const Loader: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-black bg-opacity-50">
    <div className="w-16 h-16 border-t-4 border-white border-solid rounded-full animate-spin"></div>
  </div>
);

export default Loader;