"use client";

import { Lock, Unlock } from "lucide-react";

import { formatDateTime, formatMoney } from "@/lib/format";
import { User } from "@/types/user";

type AdminUserRow = User & { wallet_balance?: number };

export function AdminUsersTable({
  users,
  actionLoadingId,
  onFreeze,
  onUnfreeze,
}: {
  users: AdminUserRow[];
  actionLoadingId?: string | null;
  onFreeze: (id: string) => void;
  onUnfreeze: (id: string) => void;
}) {
  return (
    <div className="stpay-panel overflow-hidden rounded-[1.8rem]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.22em] text-slate-500">
            <tr>
              <th className="px-4 py-4">User</th>
              <th className="px-4 py-4">Wallet Balance</th>
              <th className="px-4 py-4">Verified</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Joined</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const loading = actionLoadingId === user.id;
              const isFrozen = user.is_frozen;
              return (
                <tr key={user.id} className="border-t border-slate-100 text-slate-700">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-950">{user.full_name}</p>
                    <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                    <p className="mt-1 text-xs text-slate-500">{user.phone_number}</p>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-950">
                    {user.wallet_balance !== undefined ? formatMoney(user.wallet_balance) : "Unavailable"}
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
                  <td className="px-4 py-4 text-slate-600">{formatDateTime(user.created_at)}</td>
                  <td className="px-4 py-4">
                    {isFrozen ? (
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
