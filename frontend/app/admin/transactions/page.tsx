"use client";

import { useEffect, useMemo, useState } from "react";

import { AdminTransactionsTable } from "@/components/AdminTransactionsTable";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { fetchAdminTransactions } from "@/lib/api";
import { startCase } from "@/lib/format";
import { mockTransactions } from "@/lib/mock-data";
import { Transaction } from "@/types/transaction";

const filters = ["all", "funding", "transfer", "airtime", "bill_payment"] as const;

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const response = await fetchAdminTransactions();
        setTransactions(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? `${err.message}. Showing mock transaction list.`
            : "Unable to load admin transactions.",
        );
      }
    }

    loadTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesFilter =
        filter === "all" ? true : transaction.transaction_type === filter;
      const matchesSearch =
        search.trim().length === 0
          ? true
          : `${transaction.reference} ${transaction.description ?? ""}`
              .toLowerCase()
              .includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search, transactions]);

  return (
    <ProtectedRoute requireAdmin>
      <AppShell
        admin
        title="Admin transactions"
        description="Audit platform-wide transaction flow, filter by type, and investigate failed or suspicious activity."
      >
        {error ? (
          <div className="mb-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        ) : null}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  filter === item
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {startCase(item)}
              </button>
            ))}
          </div>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by reference or description"
            className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-500 lg:max-w-sm"
          />
        </div>

        <AdminTransactionsTable transactions={filteredTransactions} />
      </AppShell>
    </ProtectedRoute>
  );
}
