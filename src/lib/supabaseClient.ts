import { createBrowserClient } from '@supabase/ssr';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Disable URL session detection to prevent issues
        flowType: 'pkce',
        storageKey: 'sb-auth-token',
        storage: {
          getItem: (key) => {
            if (typeof document === 'undefined') return null;
            const cookies = document.cookie.split('; ');
            const cookie = cookies.find(row => row.startsWith(`${key}=`));
            if (!cookie) return null;
            return cookie.split('=')[1];
          },
          setItem: (key, value) => {
            if (typeof document === 'undefined') return;
            document.cookie = `${key}=${value}; path=/; samesite=lax; secure`;
          },
          removeItem: (key) => {
            if (typeof document === 'undefined') return;
            document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          },
        },
      },
    }
  );
}

export const supabase = createClient();
