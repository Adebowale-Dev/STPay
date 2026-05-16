import { ArrowDownLeft, ArrowUpRight, ReceiptText } from "lucide-react";

import { Transaction } from "@/types/transaction";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function TransactionCard({ transaction }: { transaction: Transaction }) {
  const isCredit = transaction.direction === "credit";

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`rounded-2xl p-3 ${
              isCredit ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {isCredit ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">{transaction.description || "STPay transaction"}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
              {transaction.transaction_type.replace("_", " ")}
            </p>
          </div>
        </div>
        <p className={`text-sm font-semibold ${isCredit ? "text-emerald-700" : "text-slate-950"}`}>
          {isCredit ? "+" : "-"}
          {formatMoney(transaction.amount)}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>{new Date(transaction.created_at).toLocaleString()}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
          <ReceiptText className="h-3.5 w-3.5" />
          {transaction.reference}
        </span>
      </div>
    </div>
  );
}
