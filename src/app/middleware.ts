import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { canAccessRoute, Role } from "./lib/rbac"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Public routes
    if (pathname === "/" || pathname === "/login") {
      return NextResponse.next()
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Role-based access control
    const userRole = token.role as Role
    if (!canAccessRoute(userRole, pathname)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/login") {
          return true
        }
        // Require token for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/user/:path*"
  ]
}