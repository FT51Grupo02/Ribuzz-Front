'use client';
import React from 'react';
import MapsEvents from './MapsEvents';
import Image from 'next/image';

const Maps: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918381/19_wolnfl.webp"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0"
        quality={100}
      />
      <div className="relative z-10 w-full h-full">
        <MapsEvents />
      </div>
    </div>
  );
};

export default Maps;
