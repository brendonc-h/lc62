import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// List of staff paths that require admin role
const staffPaths = [
  '/admin',
  '/admin/dashboard',
  '/admin/orders',
  '/admin/users',
  '/admin/settings',
  '/kitchen',
  '/kitchen/orders',
  '/kitchen/dashboard'
];// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/update-password',
  '/auth/reset-password',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/update-password',
  '/api/auth/reset-password',
  '/_next',
  '/favicon.ico',
  '/logo.png'
];

// Paths that require authentication but not admin role
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/orders',
  '/menu',
  '/checkout',
  '/order'
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();
  
  // Skip middleware for public paths
  if (publicPaths.some(path => pathname.startsWith(path)) ||
      pathname.startsWith('/_next/') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.css') ||
      pathname.endsWith('.js')
  ) {
    return res;
  }

  // Create a Supabase client configured to use cookies
  // Use fallback values for build-time safety
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';
  
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({ name, value, ...options });
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          req.cookies.set({ name, value: '', ...options });
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check if the path requires staff access (admin/kitchen)
  const isStaffPath = staffPaths.some((path: string) => pathname.startsWith(path)) ||
                     pathname.startsWith('/api/admin/') ||
                     pathname.startsWith('/api/kitchen/');

  // Check if the path is a protected path
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    // For API routes, we can return JSON responses
    if (isStaffPath) {
      if (!session) {
        return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 }
        );
      }
      
      // Check if user has admin role or is a La Casita admin email
      const { data: profile } = await supabase
        .from('customers')
        .select('role, email')
        .eq('auth_id', session.user.id)
        .single();
      
      const isAdmin = profile?.role === 'admin' || 
                     profile?.email === 'info@lacasita.io' ||
                     profile?.email === 'berthoud@lacasita.io' ||
                     profile?.email === 'fortcollins@lacasita.io';
                     
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Not authorized' },
          { status: 403 }
        );
      }
    }
    
    return res;
  }

  // Handle page routes
  if (isStaffPath || isProtectedPath) {
    // Redirect to sign-in if not authenticated
    if (!session) {
      const signInUrl = new URL('/auth/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Get user profile for role and email checking
    const { data: profile } = await supabase
      .from('customers')
      .select('role, email')
      .eq('auth_id', session.user.id)
      .single();

    // For staff paths, check if user has admin role or is a La Casita admin email
    if (isStaffPath) {
      const isAdmin = profile?.role === 'admin' || 
                     profile?.email === 'info@lacasita.io' ||
                     profile?.email === 'berthoud@lacasita.io' ||
                     profile?.email === 'fortcollins@lacasita.io';
                     
      if (!isAdmin) {
        // Redirect to dashboard if not staff
        const dashboardUrl = new URL('/dashboard', req.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }

    // User is authenticated and authorized, proceed
    return res;
  }

  return res;
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
