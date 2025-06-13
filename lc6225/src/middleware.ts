import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of admin paths that require authentication
const adminPaths = [
  '/admin',
  '/admin/dashboard',
  '/admin/orders',
  '/admin/users',
  '/admin/settings'
];

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/signin',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth/signin',
  '/api/auth/forgot-password',
  '/api/auth/reset-password'
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log(`Middleware processing: ${pathname}`);

  // Skip middleware for public paths and API routes (except admin API routes)
  if (
    publicPaths.some(path => pathname.startsWith(path)) ||
    (pathname.startsWith('/api/') && !pathname.startsWith('/api/admin/'))
  ) {
    return NextResponse.next();
  }

  // Check for admin routes
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path)) || 
                     pathname.startsWith('/api/admin/');

  if (isAdminPath) {
    try {
      console.log('Admin route detected, checking authentication...');
      const token = await getToken({ req });
      
      if (!token) {
        console.log('No token found, redirecting to signin');
        const signInUrl = new URL('/auth/signin', req.url);
        signInUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(signInUrl);
      }

      // Check if user has admin role
      if (token.role !== 'admin') {
        console.log('User does not have admin role, redirecting to dashboard');
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      console.log('Admin access granted');
    } catch (error) {
      console.error('Error in admin route middleware:', error);
      return NextResponse.redirect(new URL('/auth/error?error=AccessDenied', req.url));
    }
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
     * - images/ (image files)
     * - public/ (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|public/).*)',
  ],
};
