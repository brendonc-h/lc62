import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Completely disable middleware to stop auth loops
// We'll rely on API-level auth checks instead

export async function middleware(req: NextRequest) {
  // Only intercept admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({ req });

    // If no token or not admin, redirect to /dashboard
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

// Only match admin routes but do nothing with them for now
export const config = {
  matcher: ['/admin/:path*'],
};
