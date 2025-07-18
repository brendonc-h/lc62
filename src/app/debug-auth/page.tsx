'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

function SupabaseConnectionTest() {
  const [status, setStatus] = useState('Not tested');
  const [error, setError] = useState('');

  const testConnection = async () => {
    try {
      setStatus('Testing...');
      const supabase = createClient();
      
      // Test basic connection
      const { data, error } = await supabase.from('customers').select('count').limit(1);
      
      if (error) {
        setError(error.message);
        setStatus('Failed');
      } else {
        setStatus('Connected ✅');
        setError('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('Failed');
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Supabase Connection Test</h3>
      <button onClick={testConnection} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
        Test Connection
      </button>
      <p>Status: {status}</p>
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
}

function EnvChecker() {
  const envVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'NEXT_PUBLIC_SITE_URL': process.env.NEXT_PUBLIC_SITE_URL,
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Environment Variables</h3>
      {Object.entries(envVars).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span>{key}:</span>
          <span className={value ? 'text-green-600' : 'text-red-600'}>
            {value ? '✅ Set' : '❌ Missing'}
          </span>
        </div>
      ))}
    </div>
  );
}

function GoogleOAuthTest() {
  const [result, setResult] = useState('');

  const testGoogleOAuth = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://lacasita.io/auth/callback?provider=google&callbackUrl=/menu'
        }
      });
      
      setResult(JSON.stringify({ data, error }, null, 2));
    } catch (err) {
      setResult('Exception: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Google OAuth Test</h3>
      <button onClick={testGoogleOAuth} className="bg-red-500 text-white px-4 py-2 rounded mt-2">
        Test Google OAuth
      </button>
      <pre className="bg-gray-100 p-2 text-xs overflow-auto max-h-40 mt-2">
        {result}
      </pre>
    </div>
  );
}

function AuthStateMonitor() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  const checkAuthState = async () => {
    const supabase = createClient();
    
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setUser(session?.user || null);

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth event:', event, session);
      setSession(session);
      setUser(session?.user || null);
    });
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Auth State Monitor</h3>
      <button onClick={checkAuthState} className="bg-purple-500 text-white px-4 py-2 rounded mb-2">
        Check Auth State
      </button>
      <div>
        <p><strong>User:</strong> {user ? user.email : 'None'}</p>
        <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
        <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Authentication Debug Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <EnvChecker />
        <SupabaseConnectionTest />
        <AuthStateMonitor />
        <GoogleOAuthTest />
      </div>
      
      <div className="bg-yellow-50 p-4 rounded border">
        <h3 className="font-bold">Debug Steps:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Check that all environment variables are set</li>
          <li>Test basic Supabase connection</li>
          <li>Try Google OAuth (should redirect properly)</li>
          <li>Monitor auth state changes</li>
          <li>Check browser console for additional errors</li>
          <li>Verify current URL after OAuth redirect</li>
        </ol>
      </div>

      <div className="bg-red-50 p-4 rounded border">
        <h3 className="font-bold text-red-800">Current Issue:</h3>
        <p className="text-sm">Google OAuth redirects to <code>http://localhost:3000/?code=...</code> instead of <code>https://lacasita.io/auth/callback</code></p>
        
        <h4 className="font-bold mt-2">Possible Causes:</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Google Cloud Console OAuth app still has localhost redirect URI</li>
          <li>Supabase Google provider not configured with your Client ID/Secret</li>
          <li>Site URL in Supabase not set to https://lacasita.io</li>
          <li>Browser cache showing old redirect URL</li>
        </ul>
      </div>
    </div>
  );
}
