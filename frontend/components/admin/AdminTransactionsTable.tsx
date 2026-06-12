"use client";

import { formatDateTime, formatMoney, startCase } from "@/lib/format";
import { Transaction } from "@/types/transaction";
import { ChevronRight } from "lucide-react";

export function AdminTransactionsTable({
  transactions,
  onView,
}: {
  transactions: Transaction[];
  onView: (transaction: Transaction) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.025] text-[9px] uppercase tracking-[0.18em] text-white/30">
            <tr>
              <th className="px-4 py-4">Reference</th>
              <th className="px-4 py-4">Sender</th>
              <th className="px-4 py-4">Receiver</th>
              <th className="px-4 py-4">Amount</th>
              <th className="px-4 py-4">Type</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4" />
            </tr>
          </thead>
          <tbody>
            {!transactions.length ? (
              <tr>
                <td colSpan={8} className="px-4 py-14 text-center text-[11px] text-white/30">
                  No transactions match the selected filters.
                </td>
              </tr>
            ) : null}
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t border-white/[0.06] text-white/55 transition hover:bg-white/[0.018]">
                <td className="px-4 py-4 font-semibold text-white">{transaction.reference}</td>
                <td className="px-4 py-4">{transaction.sender_id ?? "System"}</td>
                <td className="px-4 py-4">{transaction.receiver_id ?? "N/A"}</td>
                <td className="px-4 py-4 font-semibold text-white">
                  {formatMoney(transaction.amount)}
                </td>
                <td className="px-4 py-4">{startCase(transaction.transaction_type)}</td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      transaction.status === "successful"
                        ? "bg-emerald-50 text-emerald-700"
                        : transaction.status === "failed"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {startCase(transaction.status)}
                  </span>
                </td>
                <td className="px-4 py-4">{formatDateTime(transaction.created_at)}</td>
                <td className="px-4 py-4">
                  <button type="button" onClick={() => onView(transaction)} className="rounded-lg border border-white/[0.07] p-2 text-white/30 transition hover:bg-white/[0.06] hover:text-white" aria-label={`Review ${transaction.reference}`}>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
