import { auth } from "@/features/auth/lib/auth"
import { NextResponse } from "next/server"

/**
 * Next.js Middleware — runs at the edge before requests hit the application.
 *
 * Protects authenticated routes by checking the session JWT. Unauthenticated
 * users are redirected to the sign-in page with a `callbackUrl` so they
 * return to their intended destination after logging in.
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
  // Allow viewing individual listings without auth
  // e.g. /listings/abc123 but NOT /listings/create, /listings/abc123/edit, etc.
  if (pathname === "/listings" || pathname.startsWith("/listings/")) {
    if (pathname === "/listings/create") return false
    if (pathname.endsWith("/edit") || pathname.endsWith("/delete")) return false
    return true
  }
  return false
}

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth?.user
  const pathname = nextUrl.pathname

  // Allow public routes without authentication
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to sign-in
  if (!isLoggedIn) {
    const signInUrl = nextUrl.clone()
    signInUrl.pathname = "/auth/signin"
    signInUrl.search = ""
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
}
