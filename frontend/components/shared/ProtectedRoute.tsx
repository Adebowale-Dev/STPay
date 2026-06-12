"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useSyncExternalStore } from "react";

import { isAdminUser, isAuthenticated } from "@/lib/auth";

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
      <div
        className="stpay-session-loader"
        role="status"
        aria-live="polite"
        aria-label="Preparing your secure STPay session"
      >
        <div className="stpay-session-mark" aria-hidden="true">
          <span className="stpay-session-ring stpay-session-ring-outer" />
          <span className="stpay-session-ring stpay-session-ring-inner" />
          <span className="stpay-session-logo">ST</span>
        </div>
        {/* <p className="stpay-session-label">Securing your session</p> */}
      </div>
    );
  }

  return <>{children}</>;
}
