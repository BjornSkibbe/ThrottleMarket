import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Next.js Middleware — lightweight edge guard.
 *
 * We avoid importing the NextAuth config here because it bundles Prisma,
 * bcryptjs, and jose, which pushes the Edge Function over Vercel's 1 MB
 * limit. Instead, we check for the session cookie by name and let route
 * handlers perform the actual JWT validation.
 */

const PUBLIC_ROUTES = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/auth/register",
  "/marketplace",
  "/listings",
]

const PUBLIC_PREFIXES = [
  "/api/auth",
  "/api/listings",
  "/api/csrf",
  "/api/uploadthing",
  "/_next",
  "/static",
  "/images",
  "/listing-images",
  "/category-images",
  "/motorcycle-images",
  "/hero-images",
]

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true
  }
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true
  }
  if (pathname === "/listings" || pathname.startsWith("/listings/")) {
    if (pathname === "/listings/create") return false
    if (pathname.endsWith("/edit") || pathname.endsWith("/delete")) return false
    return true
  }
  return false
}

function hasSessionCookie(request: NextRequest): boolean {
  return !!(
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  const isLoggedIn = hasSessionCookie(request)
  if (!isLoggedIn) {
    const signInUrl = request.nextUrl.clone()
    signInUrl.pathname = "/auth/signin"
    signInUrl.search = ""
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
}
