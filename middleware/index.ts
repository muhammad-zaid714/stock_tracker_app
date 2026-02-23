import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/sign-in', '/sign-up'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // API routes and static files
  const isApiRoute = pathname.startsWith('/api');
  const isStaticFile = pathname.startsWith('/_next') || pathname.includes('.');
  
  // Skip middleware for static files and API routes
  if (isStaticFile || isApiRoute) {
    return NextResponse.next();
  }
  
  // Get session from cookies
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;
  
  // If no session and trying to access protected route, redirect to sign-in
  if (!sessionToken && !isPublicRoute) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }
  
  // If has session and trying to access auth pages, redirect to home
  if (sessionToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
