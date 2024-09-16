'use client'

import { usePathname } from 'next/navigation'
import { FooterWithSitemap } from '@/components/Footer/Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  const hideFooterPaths = ['/register', '/login', '/login/entrepeneur', '/login/user', '/services', '/products', '/events']
  const hideFooterPrefixes = ['/user', '/cart']

  const shouldHideFooter = 
    hideFooterPaths.includes(pathname) || 
    hideFooterPrefixes.some(prefix => pathname.startsWith(prefix))

  if (shouldHideFooter) {
    return null
  }

  return <FooterWithSitemap />
}