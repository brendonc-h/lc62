"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function PointsCard() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const points = (session?.user as any)?.points ?? 0;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="bg-white shadow-lg rounded-lg p-4 mb-2 w-64 border">
          <h2 className="text-lg font-semibold mb-2">Points</h2>
          {status === "loading" ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : session ? (
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
