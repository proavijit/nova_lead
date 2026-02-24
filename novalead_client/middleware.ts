import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register']
const PROTECTED_PREFIXES = ['/search', '/history', '/credits']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path))
  const isProtected = pathname === '/' || PROTECTED_PREFIXES.some((path) => pathname.startsWith(path))

  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL('/search', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/register', '/search/:path*', '/history/:path*', '/credits/:path*']
}
