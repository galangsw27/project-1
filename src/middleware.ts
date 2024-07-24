import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { type NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { getLocales } from '@/locales/dictionary';
import { defaultLocale } from '@/locales/config';

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const headers = { 'accept-language': request.headers.get('accept-language') ?? '' };
  const languages = new Negotiator({ headers }).languages();
  const locales = getLocales();

  const locale = match(languages, locales, defaultLocale);
  const response = NextResponse.next();

  if (!request.cookies.get('locale')) {
    response.cookies.set('locale', locale);
  }

  /*
   * Match all request paths except for the ones starting with:
   * - login
   * - register (if not authenticated)
   */

  const isStaticAsset = request.nextUrl.pathname.startsWith('/assets/');
  if (!['/login'].includes(request.nextUrl.pathname) && !isStaticAsset) {
    // Use withAuth to handle authentication and session validation
    const res: NextMiddlewareResult = await withAuth(
      async (req: NextRequestWithAuth) => {
        // If the token is expired or invalid, redirect to /login
        if (!req.nextauth.token) {
          const loginUrl = new URL('/login', req.url);
          return NextResponse.redirect(loginUrl.toString());
        }
        return response;
      },
      {
        pages: {
          signIn: '/login',
        },
      }
    )(request as NextRequestWithAuth, event);
    return res;
  }

  // Handle /register route separately for authentication check
  if (request.nextUrl.pathname === '/register') {
    const res: NextMiddlewareResult = await withAuth(
      async (req: NextRequestWithAuth) => {
        // If the token is expired or invalid, redirect to /login
        if (!req.nextauth.token) {
          const loginUrl = new URL('/login', req.url);
          return NextResponse.redirect(loginUrl.toString());
        }
        return response;
      },
      {
        pages: {
          signIn: '/login',
        },
      }
    )(request as NextRequestWithAuth, event);
    console.log(res)
    return res;
  }

  return response;
}
