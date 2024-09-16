'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/Context/AuthContext'
import Loader from '@/components/Loader/Loader'

const CartLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated()) {
    return <Loader />
  }

  return (
    <div className="relative min-h-screen">
      {children}
    </div>
  )
}

export default CartLayout