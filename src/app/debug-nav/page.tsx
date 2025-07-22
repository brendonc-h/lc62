'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DebugNav() {
  const router = useRouter();

  const testNavigation = () => {
    console.log('Testing navigation to /auth/signin');
    router.push('/auth/signin');
  };

  const testWindowLocation = () => {
    console.log('Testing window.location to /auth/signin');
    window.location.href = '/auth/signin';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Navigation Debug</h1>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Link Component:</h3>
            <Link 
              href="/auth/signin"
              className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700"
            >
              Go to Sign In (Link)
            </Link>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Router Push:</h3>
            <button 
              onClick={testNavigation}
              className="block w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Sign In (Router)
            </button>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Window Location:</h3>
            <button 
              onClick={testWindowLocation}
              className="block w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Go to Sign In (Window)
            </button>
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium mb-2">Current URL:</h3>
            <p className="text-sm text-gray-600">{typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
