import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken");

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/register", "/"];

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ["/user", "/user/:path*"];

  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname === route);
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route.replace(":path*", ""))
  );

  // Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si es una ruta pública y hay token, redirigir al dashboard del usuario
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/user", request.url));
  }

  // En cualquier otro caso, permitir la solicitud
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};