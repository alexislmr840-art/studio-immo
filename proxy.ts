import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isPublicRoute = createRouteMatcher(['/', '/connexion(.*)'])

export const proxy = clerkMiddleware(async (auth, request: NextRequest) => {
  const { userId } = await auth()

  // Utilisateur déjà connecté → pas besoin de revoir /connexion
  if (userId && request.nextUrl.pathname.startsWith('/connexion')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
