"use client";

import { ArrowDownLeft, ArrowUpRight, Copy, ReceiptText, UserRound, X } from "lucide-react";

import { formatDateTime, formatMoney, startCase } from "@/lib/format";
import { Transaction } from "@/types/transaction";
import { AdminUser } from "@/types/user";

export function AdminTransactionDrawer({
  transaction,
  sender,
  receiver,
  loading,
  onClose,
}: {
  transaction: Transaction | null;
  sender: AdminUser | null;
  receiver: AdminUser | null;
  loading?: boolean;
  onClose: () => void;
}) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <aside className="h-full w-full max-w-lg overflow-y-auto border-l border-white/[0.08] bg-[#0d100e] p-5" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/30">Transaction investigation</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{formatMoney(transaction.amount)}</h2>
            <p className="mt-1 text-[10px] text-white/35">{transaction.reference}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/[0.08] p-2 text-white/40 hover:text-white"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Metric label="Status" value={startCase(transaction.status)} accent={transaction.status === "successful"} />
          <Metric label="Direction" value={startCase(transaction.direction)} accent={transaction.direction === "credit"} />
          <Metric label="Type" value={startCase(transaction.transaction_type)} />
          <Metric label="Recorded" value={formatDateTime(transaction.created_at)} />
        </div>

        <section className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/30">Money movement</p>
          <Party icon={ArrowUpRight} label="Sender" user={sender} fallback={transaction.sender_id ?? "System funding"} />
          <div className="mx-4 h-5 border-l border-dashed border-white/10" />
          <Party icon={ArrowDownLeft} label="Receiver" user={receiver} fallback={transaction.receiver_id ?? "External service"} />
        </section>

        <section className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/30">Audit information</p>
          <div className="mt-4 space-y-3 text-[10px]">
            <AuditRow label="Transaction ID" value={transaction.id} copy />
            <AuditRow label="Reference" value={transaction.reference} copy />
            <AuditRow label="Description" value={transaction.description ?? "No description"} />
            <AuditRow label="Risk signal" value={transaction.status === "failed" ? "Review recommended" : "No immediate concern"} />
          </div>
        </section>

        {loading ? <p className="mt-4 text-[9px] text-white/25">Resolving customer details...</p> : null}
      </aside>
    </div>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3"><p className="text-[9px] text-white/30">{label}</p><p className={`mt-2 text-[11px] font-semibold ${accent ? "text-emerald-300" : "text-white/75"}`}>{value}</p></div>;
}

function Party({ icon: Icon, label, user, fallback }: { icon: typeof UserRound; label: string; user: AdminUser | null; fallback: string }) {
  return <div className="mt-4 flex items-center gap-3"><span className="rounded-lg bg-white/[0.05] p-2 text-white/40"><Icon className="h-3.5 w-3.5" /></span><div><p className="text-[9px] text-white/30">{label}</p><p className="mt-1 text-[11px] font-medium text-white/75">{user?.full_name ?? fallback}</p>{user ? <p className="mt-1 text-[9px] text-white/30">{user.wallet_account_number ?? user.email}</p> : null}</div></div>;
}

function AuditRow({ label, value, copy = false }: { label: string; value: string; copy?: boolean }) {
  return <div className="flex items-start gap-3"><ReceiptText className="mt-0.5 h-3 w-3 text-white/25" /><span className="w-24 shrink-0 text-white/30">{label}</span><span className="min-w-0 flex-1 break-words text-white/65">{value}</span>{copy ? <button type="button" onClick={() => navigator.clipboard.writeText(value)} className="text-white/25 hover:text-emerald-300"><Copy className="h-3 w-3" /></button> : null}</div>;
}
