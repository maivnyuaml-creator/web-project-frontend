import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const ROLE_COOKIE_KEY = 'velora_user_role';

/**
 * Next.js 16 Proxy convention (supersedes deprecated middleware convention)
 * Handles fast server-edge route protection for RBAC.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userRole = request.cookies.get(ROLE_COOKIE_KEY)?.value?.toUpperCase();

  // 1. Guard Admin Routes (/admin/*) -> Only ADMIN allowed
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'ADMIN') {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // 2. Guard Creator Studio Routes (/creator/* except /creator/apply) -> Only CREATOR and ADMIN allowed
  if (pathname.startsWith('/creator') && !pathname.startsWith('/creator/apply')) {
    if (userRole !== 'CREATOR' && userRole !== 'ADMIN') {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/creator/:path*',
  ],
};
