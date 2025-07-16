'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';

export default function SignUp() {
  // Check if user arrived from email confirmation
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const emailConfirmed = searchParams?.get('emailConfirmed') === 'true';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  // Handle Google sign up
  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?provider=google`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to sign in with Google');
      }
      
      // The redirect happens automatically so we don't need to do anything else here
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate input
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      
      // Use our API route for signup which handles both user creation and sending verification email
      try {
        setMessage('Creating your account...');
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            password: password.trim(),
            confirmPassword: confirmPassword.trim()
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();

          // Handle specific error status codes
          if (response.status === 429) {
            throw new Error('Too many signup attempts. Please wait a few minutes and try again.');
          }

          throw new Error(errorData.error || 'Failed to create account');
        } else {
          console.log('API signup successful');
          const result = await response.json();

          // Use the message from the API response
          setMessage(result.message || 'Account created successfully!');

          // Clear form fields for better UX
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setIsLoading(false);
          return; // Exit early since we've handled everything
        }
      } catch (apiError) {
        console.error('Failed to call signup API:', apiError);
        // If the API route fails, fall back to client-side Supabase signup
      }
      
      // Fallback: Register the user with Supabase Auth directly
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            role: 'customer',
            points: 0
          },
          // Get the site URL from environment or use window.location.origin as fallback
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message || 'Failed to create account');
      }

      if (!signUpData.user) {
        throw new Error('Failed to create user account');
      }

      // The API route already creates the customer record, but if we're using the fallback
      // Supabase signup, we need to create the customer record here
      console.log('Creating customer record with ID:', signUpData.user.id);
      
      // Check if a customer record already exists for this user
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('*')
        .eq('auth_id', signUpData.user.id)
        .single();
        
      if (!existingCustomer) {
        // Only insert if no customer record exists
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            auth_id: signUpData.user.id,
            name: `${firstName.trim()} ${lastName.trim()}`,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim(),
            role: 'customer',
            points: 0
          });

        if (customerError) {
          console.error('Customer creation error:', customerError);
          
          // Try to get more details about the error
          if (customerError.details) {
            console.error('Error details:', customerError.details);
          }
          
          if (customerError.hint) {
            console.error('Error hint:', customerError.hint);
          }
          
          throw new Error('Account created, verify account in your email.');
        }
      } else {
        console.log('Customer record already exists, skipping creation');
      }

      // 3. Check if user needs to confirm email
      if (signUpData.user.identities && signUpData.user.identities.length === 0) {
        // User already exists
        setError('An account with this email already exists. Please sign in.');
        setIsLoading(false);
        return;
      }

      // Email confirmation is almost always required with Supabase
      setIsLoading(false);
      setMessage(
        'Success! Please check your email for a confirmation link to complete your registration. ' +
        'After confirming your email, you can sign in to your account.'
      );
      
      // Clear form fields for better UX
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      
      // Check for rate limit error
      if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        setError('Too many signup attempts. Please try again later or use a different email address.');
      } else {
        setError(errorMessage);
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          {message && (
            <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-6 rounded-md shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-800">Email Verification Required</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{message}</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Check your inbox for an email from La Casita</li>
                      <li>Click the confirmation link in the email</li>
                      <li>Once confirmed, you'll be able to sign in</li>
                    </ul>
                    <p className="mt-2 italic">Don't see the email? Check your spam folder.</p>
                  </div>
                  <div className="mt-4">
                    <Link href="/auth/signin" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Go to Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="first-name" className="sr-only">First Name</label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="last-name" className="sr-only">Last Name</label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || googleLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </div>
          
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading || googleLoading}
                className={`w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${googleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {googleLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" 
                        fill="#4285F4"/>
                    </svg>
                    Sign up with Google
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
