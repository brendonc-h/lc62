'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Verifying your account...');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const supabase = createClient();
        
        // Get URL params from Supabase auth redirect
        const code = searchParams?.get('code') || '';
        const type = searchParams?.get('type') || '';
        
        // For successful email confirmation
        if (type === 'signup' && code) {
          // Exchange the code for a session
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            throw new Error(error.message);
          }
          
          // Success - redirect to dashboard or signin
          setMessage('Email verified successfully! Redirecting you...');
          
          // Check if user is signed in after exchange
          const { data: { session } } = await supabase.auth.getSession();
          
          // Redirect based on session status
          setTimeout(() => {
            if (session) {
              router.push('/dashboard');
            } else {
              router.push('/auth/signin?verified=true');
            }
          }, 1500);
        } 
        // For password reset flow
        else if (type === 'recovery' && code) {
          router.push(`/auth/update-password?code=${code}`);
        }
        // For other types or missing code
        else {
          throw new Error('Invalid or missing parameters');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Verification failed');
        // Still redirect to signin after error
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      }
    };

    handleEmailConfirmation();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Account Verification
          </h2>
          <div className="mt-8">
            {error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                    <p className="text-sm text-red-700 mt-2">Redirecting to sign in page...</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="mt-4 text-lg font-medium text-indigo-700">{message}</p>
                <p className="mt-2 text-sm text-gray-600">
                  You will be redirected automatically...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-4 text-lg font-medium text-indigo-700">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
