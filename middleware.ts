import { NextRequest, NextResponse } from 'next/server'
import { SITE_ACCESS_COOKIE, isPasswordProtectionEnabled } from './lib/auth'

const PUBLIC_PATHS = ['/gate', '/api/gate']

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (!isPasswordProtectionEnabled()) {
    return NextResponse.next()
  }

  const accessToken = process.env.SITE_ACCESS_TOKEN

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname === '/favicon.ico') {
    return NextResponse.next()
  }

  const cookie = request.cookies.get(SITE_ACCESS_COOKIE)
  const cookieToken =
    typeof cookie === 'string'
      ? cookie
      : ((cookie as { value?: string } | undefined)?.value ?? undefined)
  if (cookieToken === accessToken) {
    return NextResponse.next()
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/gate'
  loginUrl.searchParams.set('next', `${pathname}${search}`)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)'],
}
