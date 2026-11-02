'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { UserRole } from '@/types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

/**
 * Strict Role-Based Access Control UI Guard.
 * If the current user lacks the required role, immediately redirects to the home page or specified route.
 */
export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = '/',
}: RoleGuardProps) {
  const { role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const isAuthorized = isAuthenticated && !!role && allowedRoles.includes(role);

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.replace(redirectTo);
    }
  }, [isLoading, isAuthorized, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
        <span className="text-xs font-mono text-zinc-400">Verifying role permissions...</span>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl font-bold">
          !
        </div>
        <h2 className="text-base font-bold text-white">Access Restricted</h2>
        <p className="text-xs text-zinc-400 max-w-sm">
          You do not have the required permissions to view this area. Redirecting to home...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
