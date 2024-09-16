import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value

  // Rutas protegidas
  const protectedPaths = ['/user', '/cart']

  // Verifica si la ruta actual comienza con alguna de las rutas protegidas
  const isProtectedRoute = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  console.log('Current path:', request.nextUrl.pathname)
  console.log('Is protected route:', isProtectedRoute)
  console.log('Token:', token)

  // Si es una ruta protegida y no hay token, redirige al login
  if (isProtectedRoute && !token) {
    console.log('Redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si no es una ruta protegida o el usuario tiene un token, permite el acceso
  console.log('Allowing access')
  return NextResponse.next()
}

// Configura el matcher para incluir todas las subrutas de /user y /cart
export const config = {
  matcher: ['/user/:path*', '/cart/:path*'],
}