'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import { SupabaseClient, User } from '@supabase/supabase-js';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Verifying your account...');
  const [error, setError] = useState('');

  // Helper function to ensure customer record exists for OAuth users
  const ensureCustomerRecord = async (supabase: SupabaseClient, user: User) => {
    try {
      if (!user || !user.id) return;
      
      // Check if customer record already exists
      const { data: existingCustomer, error: queryError } = await supabase
        .from('customers')
        .select('id, email')
        .eq('auth_id', user.id)
        .single();

      if (queryError && !queryError.message.includes('No rows found')) {
        console.error('Error checking for existing customer:', queryError);
        return;
      }
        
      if (existingCustomer) {
        console.log('Customer record already exists:', existingCustomer);
        return;
      }
      
      // If no customer record exists, create one
      console.log('Creating customer record for user:', user.id);
      
      // Extract name parts from user metadata
      let firstName = user.user_metadata?.firstName || 
                     user.user_metadata?.given_name || 
                     user.user_metadata?.name?.split(' ')[0] || '';
                     
      let lastName = user.user_metadata?.lastName || 
                    user.user_metadata?.family_name || 
                    (user.user_metadata?.name?.split(' ').length > 1 ? 
                      user.user_metadata?.name?.split(' ').slice(1).join(' ') : '') || '';
      
      // If no name data is available, use the part before @ in email
      if (!firstName && !lastName && user.email) {
        const emailName = user.email.split('@')[0];
        firstName = emailName;
      }
      
      const { error: insertError } = await supabase
        .from('customers')
        .insert({
          auth_id: user.id,
          name: firstName && lastName ? `${firstName} ${lastName}`.trim() : firstName || 'User',
          first_name: firstName || 'User',
          last_name: lastName || '',
          email: user.email,
          role: 'customer',
          points: 0
        });

      if (insertError) {
        console.error('Failed to create customer record:', insertError);
      } else {
        console.log('Successfully created customer record for:', user.email);
      }
    } catch (error) {
      console.error('Error ensuring customer record:', error);
    }
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient();
        
        // Get URL params from Supabase auth redirect
        const code = searchParams?.get('code') || '';
        const token = searchParams?.get('token') || ''; // Our custom token
        const type = searchParams?.get('type') || '';
        const provider = searchParams?.get('provider') || '';
        const callbackUrl = searchParams?.get('callbackUrl') || '/';

        // Debug logging
        console.log('Auth callback params:', {
          code: !!code,
          token: !!token,
          type,
          provider,
          callbackUrl,
          allParams: Object.fromEntries(searchParams?.entries() || [])
        });
        
        // For successful email confirmation with Supabase code (check this first)
        if (type === 'signup' && code) {
          setMessage(`${provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'OAuth'} sign-in processing...`);

          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('OAuth session exchange error:', error);
            throw new Error(error.message);
          }

          if (data.session && data.user) {
            // Ensure the user has a customer record
            await ensureCustomerRecord(supabase, data.user);

            setMessage('Sign in successful! Redirecting you...');

            // Use production URL consistently
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lacasita.io';

            // Determine the redirect URL
            const redirectUrl = callbackUrl && callbackUrl !== '/'
              ? (callbackUrl.startsWith('http') ? callbackUrl : `${baseUrl}${callbackUrl}`)
              : `${baseUrl}/menu`;

            // Redirect after a short delay
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 500);
          } else {
            throw new Error('Failed to get user session');
          }
        }
        // For OAuth providers (like Google) - handle any other callback with a code
        else if (code) {
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            throw new Error(error.message);
          }
          
          // Success - redirect to dashboard or signin
          setMessage('Email verified successfully! Redirecting you...');
          
          // Check if user is signed in after exchange
          if (data.session && data.user) {
            // Ensure customer record exists
            await ensureCustomerRecord(supabase, data.user);
            const redirectUrl = callbackUrl.startsWith('http') ? callbackUrl : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lacasita.io'}${callbackUrl}`;
            window.location.href = redirectUrl;
          } else {
            const signinUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lacasita.io'}/auth/signin?verified=true`;
            window.location.href = signinUrl;
          }
        } 
        // For our custom verification token
        else if (token) {
          // Verify the token - in this case, the token is the user ID
          // We're using it to verify the user's email
          const { data: user, error: userError } = await supabase
            .from('customers')
            .select('*')
            .eq('auth_id', token)
            .single();
            
          if (userError || !user) {
            throw new Error('Invalid verification token');
          }
          
          // Update user verification status if needed
          // This would be a good place to update a verified field if you have one
          
          setMessage('Email verified successfully! Redirecting you...');
          
          // Redirect to sign in page
          setTimeout(() => {
            const signinUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lacasita.io'}/auth/signin?verified=true`;
            window.location.href = signinUrl;
          }, 1500);
        }
        // For password reset flow
        else if (type === 'recovery' && code) {
          const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lacasita.io'}/auth/update-password?code=${code}`;
          window.location.href = resetUrl;
        }
        // For other cases - check if user is already signed in
        else {
          console.log('No specific auth flow detected, checking current session...');
          const { data: { session } } = await supabase.auth.getSession();

          if (session && session.user) {
            // User is already signed in, redirect to menu
            setMessage('Already signed in! Redirecting you...');
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lacasita.io';
            const redirectUrl = callbackUrl && callbackUrl !== '/'
              ? (callbackUrl.startsWith('http') ? callbackUrl : `${baseUrl}${callbackUrl}`)
              : `${baseUrl}/menu`;

            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 1000);
          } else {
            // No session and no valid params, redirect to sign in
            setMessage('Redirecting to sign in...');
            setTimeout(() => {
              const signinUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lacasita.io'}/auth/signin`;
              window.location.href = signinUrl;
            }, 1000);
          }
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Verification failed');
        // Still redirect to signin after error
        setTimeout(() => {
          const signinUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lacasita.io'}/auth/signin`;
          window.location.href = signinUrl;
        }, 3000);
      }
    };

    handleAuthCallback();
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
