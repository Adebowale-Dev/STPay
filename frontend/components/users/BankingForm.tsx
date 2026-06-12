import { CheckCircle2, Wallet } from "lucide-react";
import { ReactNode } from "react";

import { formatMoney } from "@/lib/format";

export const bankingFieldClass = "h-11 w-full rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-emerald-400/45 focus:bg-white/[0.04]";
export const bankingLabelClass = "grid gap-2 text-[10px] font-medium text-white/45";

export function BankingForm({ title, note, children, side }: { title: string; note: string; children: ReactNode; side?: ReactNode }) {
  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"><section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6"><p className="text-sm font-semibold text-white">{title}</p><p className="mt-2 max-w-xl text-[10px] leading-5 text-white/30">{note}</p><div className="mt-6">{children}</div></section><aside className="space-y-4">{side ?? <SecurityNote />}</aside></div>;
}

export function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return <button type="submit" disabled={loading} className="mt-2 h-11 rounded-lg bg-emerald-400 px-5 text-[11px] font-semibold text-[#07100b] transition hover:bg-emerald-300 disabled:opacity-50">{loading ? "Processing securely..." : label}</button>;
}

export function OperationResult({ reference, balance, message }: { reference: string; balance: number; message: string }) {
  return <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/[0.06] p-5"><CheckCircle2 className="h-5 w-5 text-emerald-300" /><p className="mt-4 text-xs font-semibold text-white">{message}</p><p className="mt-2 break-all text-[9px] text-white/35">Reference: {reference}</p><div className="mt-5 border-t border-white/[0.07] pt-4"><p className="text-[9px] text-white/30">Updated balance</p><p className="mt-1 text-lg font-semibold text-emerald-300">{formatMoney(balance)}</p></div></div>;
}

export function SecurityNote() {
  return <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"><Wallet className="h-4 w-4 text-emerald-300" /><p className="mt-5 text-xs font-semibold text-white">Secure wallet operation</p><p className="mt-2 text-[10px] leading-5 text-white/30">Every completed operation is recorded in your transaction history and may trigger an email alert.</p></div>;
}
