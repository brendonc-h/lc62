import { createBrowserClient } from '@supabase/ssr';
import { createClient as createServerClient } from '@supabase/supabase-js';

// For build-time safety, use default values if environment variables are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

// Only throw error at runtime if actually using the client
const isProduction = process.env.NODE_ENV === 'production';
const hasValidEnvVars = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  // Check for environment variables at runtime
  if (isProduction && !hasValidEnvVars) {
    console.error('Missing Supabase environment variables in production');
  }
  
  // Detect server-side or client-side environment
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    // For server-side (API routes and server components)
    console.log('Creating server-side Supabase client');
    return createServerClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false
      }
    });
  }
  
  // For client-side (browser)
  console.log('Creating browser-side Supabase client');
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Disable URL session detection to prevent issues
        flowType: 'pkce',
        storageKey: 'sb-auth-token',
        storage: {
          getItem: (key) => {
            try {
              const cookies = document.cookie.split('; ');
              const cookie = cookies.find(row => row.startsWith(`${key}=`));
              if (!cookie) return null;
              const value = cookie.split('=')[1];
              // Try to parse the value to validate it's proper JSON
              if (value && value.startsWith('base64-')) {
                const decoded = atob(value.replace('base64-', ''));
                JSON.parse(decoded); // Validate JSON
                return value;
              }
              return value;
            } catch (error) {
              console.warn('Failed to parse auth cookie, clearing corrupted data:', error);
              // Clear corrupted cookie
              document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
              return null;
            }
          },
          setItem: (key, value) => {
            document.cookie = `${key}=${value}; path=/; samesite=lax; secure`;
          },
          removeItem: (key) => {
            document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          },
        },
      },
    }
  );
}

export const supabase = createClient();
