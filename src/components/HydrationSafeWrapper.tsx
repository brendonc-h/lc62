'use client';

import { useState, useEffect } from 'react';

interface HydrationSafeWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HydrationSafeWrapper({ children, fallback }: HydrationSafeWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
