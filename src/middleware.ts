import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the token from the cookie
  const token = request.cookies.get('next-auth.session-token') || 
                request.cookies.get('__Secure-next-auth.session-token')

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/unauthorized']
  const isPublicRoute = publicRoutes.some(route => pathname === route)

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if accessing protected routes without token
  const protectedRoutes = ['/dashboard', '/admin', '/api/user', '/api/admin']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !token) {
    // Redirect to login if no token
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)',
  ],
}