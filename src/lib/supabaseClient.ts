import { createBrowserClient } from '@supabase/ssr';
import { createClient as createServerClient } from '@supabase/supabase-js';

// For build-time safety, use default values if environment variables are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

// Only throw error at runtime if actually using the client
const isProduction = process.env.NODE_ENV === 'production';
const hasValidEnvVars = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Global singleton instances to prevent multiple client creation
// Use globalThis to persist across hot reloads in development
declare global {
  var __supabase_browser_client__: any;
  var __supabase_server_client__: any;
}

// Initialize global singletons if they don't exist
if (typeof window !== 'undefined') {
  // Browser environment
  globalThis.__supabase_browser_client__ = globalThis.__supabase_browser_client__ || null;
} else {
  // Server environment
  globalThis.__supabase_server_client__ = globalThis.__supabase_server_client__ || null;
}

export function createClient() {
  // Check for environment variables at runtime
  if (isProduction && !hasValidEnvVars) {
    console.error('Missing Supabase environment variables in production');
  }

  // Detect server-side or client-side environment
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // For server-side (API routes and server components)
    if (!globalThis.__supabase_server_client__) {
      console.log('🔧 Creating server-side Supabase client (singleton)');
      globalThis.__supabase_server_client__ = createServerClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: false
        }
      });
    }
    return globalThis.__supabase_server_client__;
  }

  // For client-side (browser)
  if (!globalThis.__supabase_browser_client__) {
    console.log('🔧 Creating browser-side Supabase client (singleton)');
    globalThis.__supabase_browser_client__ = createBrowserClient(
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
  return globalThis.__supabase_browser_client__;
}

// Export a default instance for convenience, but prefer using createClient() function
export const supabase = createClient();
