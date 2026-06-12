import { Search } from "lucide-react";

import { Transaction } from "@/types/transaction";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

export function TransactionTable({
  transactions,
  search,
  onSearchChange,
}: {
  transactions: Transaction[];
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="stpay-panel rounded-[1.8rem] p-5">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-950">Transaction history</p>
          <p className="mt-1 text-sm text-slate-600">
            Search by description or reference, then open receipts from your next actions.
          </p>
        </div>
        <label className="flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500">
          <Search className="h-4 w-4" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search transactions"
            className="w-full bg-transparent outline-none"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.22em] text-slate-500">
            <tr>
              <th className="px-3 py-3">Reference</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Amount</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t border-slate-100 text-slate-700">
                <td className="px-3 py-4 font-medium text-slate-950">{transaction.reference}</td>
                <td className="px-3 py-4 capitalize">
                  {transaction.direction} / {transaction.transaction_type.replace("_", " ")}
                </td>
                <td className="px-3 py-4 font-semibold">{formatMoney(transaction.amount)}</td>
                <td className="px-3 py-4">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {transaction.status}
                  </span>
                </td>
                <td className="px-3 py-4">{new Date(transaction.created_at).toLocaleString()}</td>
                <td className="px-3 py-4">{transaction.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
