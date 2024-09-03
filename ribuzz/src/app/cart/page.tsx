import CartItem from '@/components/Cart/CartItem/CartItem'
import Image from 'next/image'
import React from 'react'

const Cart: React.FC = () => {
  return (
    <div className="relative min-h-screen text-white">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-[-1]">
        <Image
          src="/1.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
      </div>
      {/* Contenido principal */}
      <div className="relative z-10 p-4">
        <CartItem />
      </div>
    </div>
  )
}

export default Cart
