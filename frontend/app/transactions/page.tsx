"use client";

import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TransactionTable } from "@/components/TransactionTable";
import { mockTransactions } from "@/lib/mock-data";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");

  const filteredTransactions = useMemo(() => {
    const query = search.toLowerCase();
    return mockTransactions.filter((transaction) =>
      `${transaction.reference} ${transaction.description ?? ""}`
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  return (
    <ProtectedRoute>
      <AppShell
        title="Transaction History"
        description="Browse your complete funding, transfer, airtime, and bill payment records."
      >
        <TransactionTable
          transactions={filteredTransactions}
          search={search}
          onSearchChange={setSearch}
        />
      </AppShell>
    </ProtectedRoute>
  );
}
