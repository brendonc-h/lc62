import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Completely disable middleware to stop auth loops
// We'll rely on API-level auth checks instead

export function middleware(req: NextRequest) {
  return NextResponse.next();
}

// Only match admin routes but do nothing with them for now
export const config = {
  matcher: [],
};
