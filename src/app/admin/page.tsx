"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import AdminTempPage from './temp-page';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        
        if (error || !authUser) {
          router.replace('/auth/signin?callbackUrl=/admin');
          return;
        }

        // Fetch user profile to check role
        const { data: profile, error: profileError } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_id', authUser.id)
          .single();

        if (profileError) throw profileError;

        if (profile.role !== 'admin') {
          router.replace('/dashboard');
          return;
        }

        setUser({
          ...authUser,
          role: profile.role,
          name: profile.name || authUser.email?.split('@')[0] || 'Admin'
        });
      } catch (error) {
        console.error('Error checking auth status:', error);
        router.replace('/auth/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth/signin');
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/auth/signin');
            }}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
          >
            Sign Out
          </button>
        </div>
        <AdminTempPage />
      </div>
    </div>
  );
}
