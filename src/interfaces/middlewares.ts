import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(request.cookies.get('authToken')); // Verifica la autenticación con una cookie

  const publicRoutes = ['/login', '/register'];
  const protectedRoutes = ['/products', '/services', '/events', '/about', '/'];

  // Si el usuario está autenticado y está intentando acceder a las rutas públicas
  if (isAuthenticated && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si el usuario no está autenticado y está intentando acceder a rutas protegidas
  if (!isAuthenticated && !protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'], // Excluir rutas estáticas y archivos específicos
};
