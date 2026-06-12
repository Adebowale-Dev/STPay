"use client";

import { AlertTriangle, CheckCircle2, ChevronDown, Clock3, Download, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTransactionDrawer } from "@/components/admin/AdminTransactionDrawer";
import { AdminTransactionsTable } from "@/components/admin/AdminTransactionsTable";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchAdminTransaction, fetchAdminTransactions } from "@/lib/api";
import { downloadCsv } from "@/lib/export";
import { formatMoney, startCase } from "@/lib/format";
import { mockTransactions } from "@/lib/mock-data";
import { Transaction, TransactionDirection, TransactionStatus } from "@/types/transaction";
import { AdminUser } from "@/types/user";

const typeFilters = ["all", "funding", "transfer", "airtime", "bill_payment"] as const;
const PAGE_SIZE = 10;

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [typeFilter, setTypeFilter] = useState<(typeof typeFilters)[number]>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | TransactionStatus>("all");
  const [directionFilter, setDirectionFilter] = useState<"all" | TransactionDirection>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [sender, setSender] = useState<AdminUser | null>(null);
  const [receiver, setReceiver] = useState<AdminUser | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminTransactions()
      .then((response) => setTransactions(response.data))
      .catch((err) => setError(err instanceof Error ? `${err.message}. Showing local preview.` : "Unable to load transactions."));
  }, []);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesType = typeFilter === "all" || transaction.transaction_type === typeFilter;
      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
      const matchesDirection = directionFilter === "all" || transaction.direction === directionFilter;
      const matchesSearch = !query || [transaction.reference, transaction.description, transaction.sender_id, transaction.receiver_id]
        .some((value) => value?.toLowerCase().includes(query));
      return matchesType && matchesStatus && matchesDirection && matchesSearch;
    });
  }, [directionFilter, search, statusFilter, transactions, typeFilter]);

  const totalValue = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const visibleTransactions = filteredTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function openTransaction(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setSender(null);
    setReceiver(null);
    setDetailLoading(true);
    try {
      const response = await fetchAdminTransaction(transaction.reference);
      setSelectedTransaction(response.data.transaction);
      setSender(response.data.sender);
      setReceiver(response.data.receiver);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resolve transaction details.");
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <AdminShell title="Transaction operations" description="Investigate money movement, payment status, and platform settlement activity.">
        <div className="mx-auto max-w-[1500px] px-4 py-6 lg:px-7">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Summary icon={CheckCircle2} label="Successful" value={transactions.filter((item) => item.status === "successful").length.toLocaleString()} />
            <Summary icon={Clock3} label="Pending review" value={transactions.filter((item) => item.status === "pending").length.toLocaleString()} />
            <Summary icon={AlertTriangle} label="Failed" value={transactions.filter((item) => item.status === "failed").length.toLocaleString()} alert />
            <Summary icon={Download} label="Filtered value" value={formatMoney(totalValue)} />
          </div>

          {error ? <div className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/[0.06] px-4 py-3 text-xs text-amber-200">{error}</div> : null}

          <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.018] p-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <div className="flex flex-wrap gap-2">
                {typeFilters.map((item) => <button key={item} type="button" onClick={() => { setTypeFilter(item); setPage(1); }} className={`rounded-lg px-3 py-2 text-[10px] font-medium ${typeFilter === item ? "bg-emerald-400 text-[#07100b]" : "border border-white/[0.07] text-white/40"}`}>{startCase(item)}</button>)}
              </div>
              <div className="ml-auto flex flex-col gap-2 sm:flex-row">
                <FilterDropdown value={statusFilter} onChange={(value) => { setStatusFilter(value as typeof statusFilter); setPage(1); }} options={["all", "successful", "pending", "failed"]} label="Status" />
                <FilterDropdown value={directionFilter} onChange={(value) => { setDirectionFilter(value as typeof directionFilter); setPage(1); }} options={["all", "credit", "debit"]} label="Direction" />
                <label className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 sm:w-64">
                  <Search className="h-3.5 w-3.5 text-white/25" />
                  <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Reference, description, user ID..." className="h-10 min-w-0 flex-1 bg-transparent text-[10px] text-white outline-none placeholder:text-white/25" />
                </label>
                <button type="button" onClick={() => downloadCsv("stpay-transactions.csv", filteredTransactions.map((item) => ({ reference: item.reference, type: item.transaction_type, direction: item.direction, amount: item.amount, status: item.status, sender_id: item.sender_id, receiver_id: item.receiver_id, description: item.description, created_at: item.created_at })))} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-3 text-[10px] text-white/55 hover:bg-white/[0.05]"><Download className="h-3.5 w-3.5" /> Export</button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <AdminTransactionsTable transactions={visibleTransactions} onView={openTransaction} />
          </div>
          <Pagination page={page} pageCount={pageCount} count={filteredTransactions.length} onPage={setPage} />
        </div>

        <AdminTransactionDrawer transaction={selectedTransaction} sender={sender} receiver={receiver} loading={detailLoading} onClose={() => setSelectedTransaction(null)} />
      </AdminShell>
    </ProtectedRoute>
  );
}

function Summary({ icon: Icon, label, value, alert = false }: { icon: typeof CheckCircle2; label: string; value: string; alert?: boolean }) {
  return <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"><Icon className={`h-4 w-4 ${alert ? "text-rose-300" : "text-emerald-300"}`} /><p className="mt-5 text-[9px] uppercase tracking-[0.16em] text-white/30">{label}</p><p className="mt-2 truncate text-xl font-semibold text-white">{value}</p></div>;
}

function FilterDropdown({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: string[]; label: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group flex h-10 min-w-32 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-left outline-none transition hover:bg-white/[0.05] focus-visible:border-emerald-400/40 data-[state=open]:border-emerald-400/35 data-[state=open]:bg-white/[0.055]"
        >
          <span className="text-[9px] text-white/30">{label}</span>
          <span className="text-[10px] font-medium text-white/75">{startCase(value)}</span>
          <ChevronDown className="ml-auto h-3.5 w-3.5 text-white/45 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="min-w-40 rounded-lg border border-white/[0.1] bg-[#0d100e] p-1.5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.45)] ring-0"
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-[9px] uppercase tracking-[0.16em] text-white/30">
          Filter by {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-0 bg-white/[0.07]" />
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option}
              value={option}
              className="my-0.5 rounded-md px-2 py-2 pr-8 text-[10px] text-white/60 outline-none focus:bg-emerald-400 focus:text-[#07100b] data-[state=checked]:text-emerald-300 data-[state=checked]:focus:text-[#07100b]"
            >
              {startCase(option)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Pagination({ page, pageCount, count, onPage }: { page: number; pageCount: number; count: number; onPage: (page: number) => void }) {
  return <div className="mt-4 flex items-center justify-between text-[10px] text-white/30"><span>{count} transaction records</span><div className="flex items-center gap-2"><button disabled={page === 1} onClick={() => onPage(page - 1)} className="rounded-lg border border-white/[0.07] px-3 py-2 disabled:opacity-30">Previous</button><span>Page {page} of {pageCount}</span><button disabled={page === pageCount} onClick={() => onPage(page + 1)} className="rounded-lg border border-white/[0.07] px-3 py-2 disabled:opacity-30">Next</button></div></div>;
}
