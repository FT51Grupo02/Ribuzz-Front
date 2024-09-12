import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken');

  const protectedRoutes = ['/user', '/dashboard', '/settings'];

  if (!token && protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
  
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next(); 
}
export const config = {
  matcher: ['/user', '/dashboard', '/settings'], 
};

