"use client";

import { ChevronRight, Lock, Unlock } from "lucide-react";

import { formatDateTime, formatMoney } from "@/lib/format";
import { AdminUser } from "@/types/user";

export function AdminUsersTable({
  users,
  actionLoadingId,
  onFreeze,
  onUnfreeze,
  onView,
}: {
  users: AdminUser[];
  actionLoadingId?: string | null;
  onFreeze: (id: string) => void;
  onUnfreeze: (id: string) => void;
  onView: (user: AdminUser) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.025] text-[9px] uppercase tracking-[0.18em] text-white/30">
            <tr>
              <th className="px-4 py-4">User</th>
              <th className="px-4 py-4">Wallet Balance</th>
              <th className="px-4 py-4">Verified</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Joined</th>
              <th className="px-4 py-4">Actions</th>
              <th className="px-4 py-4" />
            </tr>
          </thead>
          <tbody>
            {!users.length ? (
              <tr>
                <td colSpan={7} className="px-4 py-14 text-center text-[11px] text-white/30">
                  No customers match the selected filters.
                </td>
              </tr>
            ) : null}
            {users.map((user) => {
              const loading = actionLoadingId === user.id;
              const isFrozen = user.is_frozen;
              return (
                <tr key={user.id} className="border-t border-white/[0.06] text-white/55 transition hover:bg-white/[0.018]">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">{user.full_name}</p>
                    <p className="mt-1 text-xs text-white/35">{user.email}</p>
                    <p className="mt-1 text-xs text-white/35">{user.phone_number}</p>
                  </td>
                  <td className="px-4 py-4 font-semibold text-white">
                    {formatMoney(user.wallet_balance ?? 0, user.wallet_currency)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.is_email_verified
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {user.is_email_verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isFrozen ? "bg-rose-50 text-rose-700" : "bg-sky-50 text-sky-700"
                      }`}
                    >
                      {isFrozen ? "Frozen" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-white/45">{formatDateTime(user.created_at)}</td>
                  <td className="px-4 py-4">
                    {user.role === "admin" ? (
                      <span className="text-[10px] text-white/25">Protected admin</span>
                    ) : isFrozen ? (
                      <button
                        type="button"
                        onClick={() => onUnfreeze(user.id)}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 disabled:opacity-60"
                      >
                        <Unlock className="h-3.5 w-3.5" />
                        {loading ? "Updating..." : "Unfreeze"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onFreeze(user.id)}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 disabled:opacity-60"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        {loading ? "Updating..." : "Freeze"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button type="button" onClick={() => onView(user)} className="rounded-lg border border-white/[0.07] p-2 text-white/30 transition hover:bg-white/[0.06] hover:text-white" aria-label={`Review ${user.full_name}`}>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
