import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'
import { type NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextMiddlewareResult } from 'next/dist/server/web/types'
import { getLocales } from '@/locales/dictionary'
import { defaultLocale } from '@/locales/config'
import { withNextHeaders } from 'next-headers'

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const headers = { 'accept-language': request.headers.get('accept-language') ?? '' }
  const languages = new Negotiator({ headers }).languages()
  const locales = getLocales()

  const locale = match(languages, locales, defaultLocale)
  const response = NextResponse.next()

  if (!request.cookies.get('locale')) {
    response.cookies.set('locale', locale)
  }

  /*
   * Match all request paths except for the ones starting with:
   * - login
   * - register
   */

  // Redirect /register to /login
  if (request.nextUrl.pathname === '/register') {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl.toString())
  }

  const isStaticAsset = request.nextUrl.pathname.startsWith('/assets/')
  if (![
    '/login',
  ].includes(request.nextUrl.pathname) && !isStaticAsset) {
    const res: NextMiddlewareResult = await withAuth(
      // Response with local cookies
      () => response,
      {
        // Matches the pages config in `[...nextauth]`
        pages: {
          signIn: '/login',
        },
      },
    )(request as NextRequestWithAuth, event)
    return res
  }

  return response
}
