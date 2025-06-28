import { createBrowserClient } from '@supabase/ssr';

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
            if (typeof document === 'undefined') return null;
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
