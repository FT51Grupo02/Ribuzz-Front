import VariosComponentesAdmin from '@/components/Admin/VariosComponentesAdmin'
import React from 'react'
import Image from 'next/image'

const AdminPage = () => {
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <VariosComponentesAdmin/>
      </div>
      <div className="fixed inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918379/1_cbkjcf.webp"
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

export default AdminPage