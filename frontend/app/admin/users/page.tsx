"use client";

import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { AdminUsersTable } from "@/components/AdminUsersTable";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { fetchAdminUsers, freezeAdminUser, unfreezeAdminUser } from "@/lib/api";
import { mockAdminUsers } from "@/lib/mock-data";
import { User } from "@/types/user";

type AdminUserRow = User & { wallet_balance?: number };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>(mockAdminUsers);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetchAdminUsers();
        setUsers((current) =>
          response.data.map((user) => {
            const mock = current.find((item) => item.id === user.id);
            return { ...user, wallet_balance: mock?.wallet_balance };
          }),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? `${err.message}. Showing mock user balances where needed.`
            : "Unable to load admin users.",
        );
      }
    }

    loadUsers();
  }, []);

  const totalFrozen = useMemo(() => users.filter((user) => user.is_frozen).length, [users]);

  async function handleFreeze(id: string) {
    setActionLoadingId(id);
    try {
      await freezeAdminUser(id);
      setUsers((current) =>
        current.map((user) => (user.id === id ? { ...user, is_frozen: true } : user)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to freeze account.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleUnfreeze(id: string) {
    setActionLoadingId(id);
    try {
      await unfreezeAdminUser(id);
      setUsers((current) =>
        current.map((user) => (user.id === id ? { ...user, is_frozen: false } : user)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to unfreeze account.");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <AppShell
        admin
        title="Admin users"
        description="Review account status, verification progress, and freeze or unfreeze access when needed."
      >
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MiniCard label="Total users" value={String(users.length)} />
          <MiniCard label="Frozen accounts" value={String(totalFrozen)} />
          <MiniCard
            label="Verification pending"
            value={String(users.filter((user) => !user.is_email_verified).length)}
          />
        </div>

        {error ? (
          <div className="mb-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        ) : null}

        <AdminUsersTable
          users={users}
          actionLoadingId={actionLoadingId}
          onFreeze={handleFreeze}
          onUnfreeze={handleUnfreeze}
        />
      </AppShell>
    </ProtectedRoute>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="stpay-panel rounded-[1.5rem] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
