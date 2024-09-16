'use client'

import { usePathname } from 'next/navigation'
import { FooterWithSitemap } from '@/components/Footer/Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  const hideFooterPaths = ['/register', '/login', '/login/entrepeneur', '/login/user', '/services', '/products', '/events' ]

  if (hideFooterPaths.includes(pathname)) {
    return null
  }

  return <FooterWithSitemap />
}