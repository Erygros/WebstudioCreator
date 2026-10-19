import { NextResponse, type NextRequest } from 'next/server';
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-creator-locale', request.nextUrl.pathname.startsWith('/en') ? 'en' : 'de');
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ['/de/:path*', '/en/:path*', '/'] };
