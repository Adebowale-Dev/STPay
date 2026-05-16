"use client";

import { formatDateTime, formatMoney, startCase } from "@/lib/format";
import { Transaction } from "@/types/transaction";

export function AdminTransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="stpay-panel overflow-hidden rounded-[1.8rem]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.22em] text-slate-500">
            <tr>
              <th className="px-4 py-4">Reference</th>
              <th className="px-4 py-4">Sender</th>
              <th className="px-4 py-4">Receiver</th>
              <th className="px-4 py-4">Amount</th>
              <th className="px-4 py-4">Type</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t border-slate-100 text-slate-700">
                <td className="px-4 py-4 font-semibold text-slate-950">{transaction.reference}</td>
                <td className="px-4 py-4">{transaction.sender_id ?? "System"}</td>
                <td className="px-4 py-4">{transaction.receiver_id ?? "N/A"}</td>
                <td className="px-4 py-4 font-semibold text-slate-950">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
