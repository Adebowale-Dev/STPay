"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useSyncExternalStore } from "react";

import { getStoredUser, isAdminUser, isAuthenticated } from "@/lib/auth";

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) {
  const router = useRouter();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const user = isClient ? getStoredUser() : null;
  const authenticated = isClient ? isAuthenticated() : false;
  const adminUser = isClient ? isAdminUser() : false;

  useEffect(() => {
    if (!isClient) {
      return;
    }

    if (!authenticated) {
      router.replace("/login");
      return;
    }

    if (requireAdmin && !adminUser) {
      router.replace("/dashboard");
      return;
    }
  }, [adminUser, authenticated, isClient, requireAdmin, router]);

  if (!isClient || !authenticated || (requireAdmin && !adminUser)) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="stpay-surface rounded-[2rem] px-8 py-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            STPay
          </p>
          <p className="mt-3 text-lg font-semibold text-slate-950">Preparing your secure session...</p>
          {user ? <p className="mt-2 text-sm text-slate-600">Welcome back, {user.full_name}.</p> : null}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
