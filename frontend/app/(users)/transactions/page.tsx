"use client";

import { ChevronDown, Download, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppShell } from "@/components/users/AppShell";
import { fetchTransactions, getApiErrorMessage } from "@/lib/api";
import { downloadCsv } from "@/lib/export";
import { formatDateTime, formatMoney, startCase } from "@/lib/format";
import { mockTransactions } from "@/lib/mock-data";
import { Transaction } from "@/types/transaction";

const filters = ["all", "credit", "debit", "funding", "airtime", "bill_payment"];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions()
      .then((response) => setTransactions(response.data))
      .catch((requestError) => setError(getApiErrorMessage(requestError)));
  }, []);

  const visible = useMemo(
    () =>
      transactions.filter(
        (item) =>
          (filter === "all" || item.direction === filter || item.transaction_type === filter) &&
          `${item.reference} ${item.description ?? ""}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [filter, search, transactions],
  );

  return (
    <ProtectedRoute>
      <AppShell title="Transaction history" description="Review every credit, debit, payment, and receipt.">
        {error ? <p className="mb-4 text-[10px] text-rose-300">{error}</p> : null}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <TransactionFilter value={filter} onChange={setFilter} />
            <div className="flex gap-2 lg:ml-auto">
              <label className="flex flex-1 items-center gap-2 rounded-lg border border-white/[0.08] px-3 lg:flex-none">
                <Search className="h-3 w-3 text-white/25" />
                <input className="h-9 min-w-0 bg-transparent text-[10px] outline-none placeholder:text-white/20" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search activity" />
              </label>
              <button type="button" onClick={() => downloadCsv("my-stpay-transactions.csv", visible)} className="rounded-lg border border-white/[0.08] px-3 text-white/45 hover:bg-white/[0.04]">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-[10px]">
              <thead className="text-white/25"><tr><th className="px-3 py-3">Reference</th><th className="px-3 py-3">Activity</th><th className="px-3 py-3">Amount</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Date</th></tr></thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id} className="border-t border-white/[0.06] text-white/50">
                    <td className="px-3 py-4 font-medium text-white/75">{item.reference}</td>
                    <td className="px-3 py-4">{startCase(item.direction)} · {startCase(item.transaction_type)}<p className="mt-1 text-[8px] text-white/25">{item.description}</p></td>
                    <td className={`px-3 py-4 font-semibold ${item.direction === "credit" ? "text-emerald-300" : "text-white/70"}`}>{item.direction === "credit" ? "+" : "-"}{formatMoney(item.amount)}</td>
                    <td className="px-3 py-4">{startCase(item.status)}</td>
                    <td className="px-3 py-4">{formatDateTime(item.created_at)}</td>
                  </tr>
                ))}
                {!visible.length ? <tr><td colSpan={5} className="py-12 text-center text-white/25">No transactions found.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}

function TransactionFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="inline-flex h-10 min-w-40 items-center justify-between gap-4 rounded-lg border border-white/[0.08] bg-[#101512] px-3 text-[10px] text-white/60 outline-none hover:border-emerald-400/30">
          <span>Filter: <strong className="font-semibold text-white/80">{startCase(value)}</strong></span>
          <ChevronDown className="h-3.5 w-3.5 text-white/30" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="border border-white/[0.08] bg-[#101512] p-1.5 text-white shadow-[0_18px_50px_rgba(0,0,0,.45)]">
        <DropdownMenuLabel className="px-2 py-1.5 text-[8px] uppercase tracking-[0.18em] text-white/25">Transaction type</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {filters.map((item) => <DropdownMenuRadioItem key={item} value={item} className="cursor-pointer px-2.5 py-2 text-[10px] text-white/55 focus:bg-emerald-400/10 focus:text-emerald-200 data-[state=checked]:text-emerald-300">{startCase(item)}</DropdownMenuRadioItem>)}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
