'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  name: string;
  email: string;
  points: number;
  role?: string;
};

export default function Dashboard() {
  const { data: session, status, update } = useSession(); // Ensure 'update' is available for handleAddPoints
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Renamed from isLoading
  const [isUpdatingPoints, setIsUpdatingPoints] = useState(false); // New state for points update
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // If we are still in the initial loading phase and status is 'loading', 
    // just wait for the status to change.
    if (isInitialLoading && status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
      setIsInitialLoading(false); // Initial auth determination is complete
    } else if (status === 'authenticated' && session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name || 'User',
        email: session.user.email || '',
        points: session.user.points || 0, // Corrected points access
        role: session.user.role,
      });
      setIsInitialLoading(false); // Initial auth determination is complete
    } else if (status !== 'loading') {
      // If status is not 'loading' and not covered above (e.g. error, or session is null unexpectedly)
      // ensure initial loading spinner stops.
      setIsInitialLoading(false);
    }
  }, [status, session, router, isInitialLoading]);

  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin');
    }
  }, [user, router]);

  const handleAddPoints = async (amount: number) => {
    setIsUpdatingPoints(true); // Set loading state for button
    try {
      setError('');
      const response = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update points');
      }

      // Update local state and session
      setUser(prev => prev ? { ...prev, points: data.newPoints } : null);
      await update({ points: data.newPoints });
    } catch (err) {
      console.error('Error updating points:', err);
      setError(err instanceof Error ? err.message : 'Failed to update points');
    } finally {
      setIsUpdatingPoints(false); // Reset loading state for button
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
    router.refresh();
  };

  // Show full spinner only during the initial determination of auth state
  if (isInitialLoading && status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // After initial load, if user is not set, it means redirection or an issue.
  if (!user && !isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">
            {status === 'unauthenticated' 
              ? 'Redirecting to sign-in...'
              : 'You need to be signed in to view this page, or an error occurred.'}
          </p>
          {status !== 'unauthenticated' && (
            <button
              onClick={() => router.push('/auth/signin?callbackUrl=/dashboard')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    );
  }

  // If user is set, display the dashboard content
  if (user) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Out
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
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
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h2>
            <p className="mt-1 text-sm text-gray-500">Here's your current points balance and activity.</p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-medium text-gray-900">Your Points</h3>
                  <p className="mt-1 text-4xl font-bold text-indigo-600">{user.points}</p>
                  <p className="mt-2 text-sm text-gray-500">Earn more points by completing activities</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleAddPoints(10)}
                    disabled={isUpdatingPoints}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingPoints ? 'Adding...' : '+10 Points'}
                  </button>
                  <button
                    onClick={() => handleAddPoints(50)}
                    disabled={isUpdatingPoints}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingPoints ? 'Adding...' : '+50 Points'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  <li className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Account Created</p>
                        <p className="mt-1 text-sm text-gray-500">Welcome to our platform!</p>
                      </div>
                      <p className="text-sm font-medium text-green-600">+10 points</p>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">Just now</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }

  // Fallback for any other unhandled state, though ideally covered by the conditions above.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p>Loading dashboard...</p>
    </div>
  );
}
