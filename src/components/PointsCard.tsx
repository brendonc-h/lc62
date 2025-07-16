"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { AuthChangeEvent } from "@supabase/supabase-js";

export default function PointsCard() {
  const [user, setUser] = useState<any>(null);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user) {
        // Fetch user profile to get points
        const { data: profile } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', data.user.id)
          .single();
        setPoints(profile?.points || 0);
      }
      setLoading(false);
    };

    getUser();
    
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      getUser();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="bg-white shadow-lg rounded-lg p-4 mb-2 w-64 border">
          <h2 className="text-lg font-semibold mb-2">Points</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : user ? (
            <p className="text-sm">
              You have <span className="font-bold">{points}</span> points.
            </p>
          ) : (
            <p className="text-sm">
              <Link href="/auth/signin" className="text-indigo-600 underline">
                Sign in
              </Link>{" "}
              to see your points.
            </p>
          )}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="bg-indigo-600 text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
        aria-label="Toggle points card"
      >
        {open ? "×" : "Points"}
      </button>
    </div>
  );
}
