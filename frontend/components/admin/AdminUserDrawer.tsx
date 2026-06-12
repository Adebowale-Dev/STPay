"use client";

import { Activity, Copy, Lock, Mail, Phone, ShieldCheck, Unlock, Wallet, X } from "lucide-react";

import { formatDateTime, formatMoney, startCase } from "@/lib/format";
import { Transaction } from "@/types/transaction";
import { AdminUser } from "@/types/user";

export function AdminUserDrawer({
  user,
  transactions,
  loading,
  onClose,
  onStatusChange,
}: {
  user: AdminUser | null;
  transactions: Transaction[];
  loading?: boolean;
  onClose: () => void;
  onStatusChange: (user: AdminUser) => void;
}) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <aside
        className="h-full w-full max-w-xl overflow-y-auto border-l border-white/[0.08] bg-[#0d100e] p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald-400/10 text-sm font-semibold text-emerald-300">
              {user.full_name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
            </span>
            <div>
              <h2 className="text-base font-semibold text-white">{user.full_name}</h2>
              <p className="mt-1 text-[10px] text-white/35">Customer ID: {user.id}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/[0.08] p-2 text-white/40 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge good={user.is_email_verified} label={user.is_email_verified ? "Email verified" : "Verification pending"} />
          <StatusBadge good={!user.is_frozen} label={user.is_frozen ? "Account frozen" : "Account active"} />
          <StatusBadge good={user.role === "user"} label={startCase(user.role)} neutral />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <DetailMetric icon={Wallet} label="Wallet balance" value={formatMoney(user.wallet_balance ?? 0, user.wallet_currency)} />
          <DetailMetric icon={Activity} label="Transactions" value={String(user.transaction_count ?? transactions.length)} />
          <DetailMetric icon={ShieldCheck} label="Risk state" value={user.is_frozen ? "Restricted" : "Normal"} />
        </div>

        <section className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">Customer information</p>
          <div className="mt-4 space-y-3">
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow icon={Phone} label="Phone" value={user.phone_number} />
            <InfoRow icon={Wallet} label="Account number" value={user.wallet_account_number ?? "Unavailable"} copy />
            <InfoRow icon={Activity} label="Last activity" value={user.last_transaction_at ? formatDateTime(user.last_transaction_at) : "No transactions yet"} />
            <InfoRow icon={ShieldCheck} label="Joined" value={formatDateTime(user.created_at)} />
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">Recent transactions</p>
            {loading ? <span className="text-[9px] text-white/25">Loading...</span> : null}
          </div>
          <div className="mt-3 space-y-2">
            {transactions.length ? transactions.slice(0, 6).map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.018] p-3">
                <span className={`h-2 w-2 rounded-full ${transaction.status === "successful" ? "bg-emerald-400" : transaction.status === "failed" ? "bg-rose-400" : "bg-amber-300"}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium text-white/75">{transaction.description || startCase(transaction.transaction_type)}</p>
                  <p className="mt-1 text-[9px] text-white/30">{transaction.reference} · {formatDateTime(transaction.created_at)}</p>
                </div>
                <p className="text-[11px] font-semibold text-white">{formatMoney(transaction.amount)}</p>
              </div>
            )) : (
              <p className="rounded-xl border border-dashed border-white/[0.08] px-4 py-6 text-center text-[10px] text-white/30">No customer transactions found.</p>
            )}
          </div>
        </section>

        {user.role !== "admin" ? (
          <div className="mt-6 border-t border-white/[0.07] pt-5">
            <button
              type="button"
              onClick={() => onStatusChange(user)}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-[11px] font-semibold ${
                user.is_frozen ? "bg-emerald-400 text-[#07100b]" : "bg-rose-400/10 text-rose-300 ring-1 ring-rose-300/20"
              }`}
            >
              {user.is_frozen ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
              {user.is_frozen ? "Restore customer access" : "Freeze customer account"}
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function StatusBadge({ good, label, neutral = false }: { good: boolean; label: string; neutral?: boolean }) {
  return <span className={`rounded-full px-2.5 py-1 text-[9px] font-medium ${neutral ? "bg-white/[0.06] text-white/50" : good ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-300/10 text-amber-200"}`}>{label}</span>;
}

function DetailMetric({ icon: Icon, label, value }: { icon: typeof Wallet; label: string; value: string }) {
  return <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3"><Icon className="h-3.5 w-3.5 text-emerald-300" /><p className="mt-4 text-[9px] text-white/30">{label}</p><p className="mt-1 truncate text-xs font-semibold text-white">{value}</p></div>;
}

function InfoRow({ icon: Icon, label, value, copy = false }: { icon: typeof Wallet; label: string; value: string; copy?: boolean }) {
  return <div className="flex items-center gap-3 text-[10px]"><Icon className="h-3.5 w-3.5 text-white/30" /><span className="w-24 text-white/30">{label}</span><span className="min-w-0 flex-1 truncate text-white/70">{value}</span>{copy ? <button type="button" onClick={() => navigator.clipboard.writeText(value)} className="text-white/30 hover:text-emerald-300"><Copy className="h-3 w-3" /></button> : null}</div>;
}
