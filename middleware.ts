import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const session = await auth()

  // If the user is trying to access /dashboard and is NOT logged in
  if (isProtectedRoute(req) && !session.userId) {
    // Generate the full absolute URL for your sign-in page
    const signInUrl = new URL('/sign-in', req.url)
    // Clean redirect to sign-in page instead of throwing an unhandled crash
    return NextResponse.redirect(signInUrl)
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}