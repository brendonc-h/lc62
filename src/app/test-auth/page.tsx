'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export default function TestAuth() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testGoogleAuth = async () => {
    setLoading(true);
    setResult('Testing Google OAuth configuration...\n\nChecking environment variables...');

    try {
      // Check environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

      setResult(`Environment Check:
- Supabase URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}
- Supabase Key: ${supabaseKey ? '✅ Set' : '❌ Missing'}
- Site URL: ${siteUrl || window.location.origin}

Attempting Google OAuth...`);

      const supabase = createClient();

      // Test if Google provider is available
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?callbackUrl=${encodeURIComponent('/menu')}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        setResult(prev => prev + `\n\n❌ Google OAuth Error: ${error.message}\n\nCommon fixes:\n1. Check Google provider is enabled in Supabase\n2. Verify Client ID/Secret in Supabase dashboard\n3. Check redirect URIs in Google Cloud Console`);
      } else {
        setResult(prev => prev + '\n\n✅ Google OAuth redirect initiated successfully');
      }
    } catch (err) {
      setResult(prev => prev + `\n\n❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    setResult('Testing Supabase connection...');
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setResult(`Supabase Error: ${error.message}`);
      } else {
        setResult(`Supabase connected successfully. Session: ${data.session ? 'Active' : 'None'}`);
      }
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold text-center mb-6">Auth Testing</h2>
          
          <div className="space-y-4">
            <button
              onClick={testSupabaseConnection}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Test Supabase Connection
            </button>
            
            <button
              onClick={testGoogleAuth}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              Test Google OAuth
            </button>
          </div>
          
          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Result:</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{result}</p>
            </div>
          )}
          
          {loading && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
