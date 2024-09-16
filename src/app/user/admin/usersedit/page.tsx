'use client'

import GestionDeUsuarios from '@/components/Admin/GestionDeUsuarios'
import React from 'react'
import Image from 'next/image'
import { useAuth } from '@/components/Context/AuthContext'

const UsersEdit = () => {
  const { token } = useAuth()

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <GestionDeUsuarios token={token || ''}/>
      </div>
      <div className="fixed inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918381/10_cebn7l.webp"
          alt="Fondo de página"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>
    </div>
  )
}

export default UsersEdit