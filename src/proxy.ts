import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
    locales: ['en', 'ur'],
    defaultLocale: 'en',
});

export function proxy(request: NextRequest): NextResponse {
    return intlMiddleware(request) as NextResponse;
}

export const config = {
    matcher: ['/', '/(ur|en)/:path*', '/((?!api|_next|_static|_vercel|.*\\..*).*)']
};
