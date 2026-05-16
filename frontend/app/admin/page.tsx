"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, CircleDollarSign, ShieldAlert, Users } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { DashboardCard } from "@/components/DashboardCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TransactionCard } from "@/components/TransactionCard";
import { fetchAdminStats, fetchAdminTransactions, fetchAdminUsers } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { adminVolumeTrend, mockAdminStats, mockAdminUsers, mockTransactions } from "@/lib/mock-data";
import { Transaction } from "@/types/transaction";
import { User } from "@/types/user";

type AdminStats = {
  total_users: number;
  total_wallet_balance: number;
  total_successful_transactions: number;
  total_failed_transactions: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>(mockAdminStats);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(mockTransactions.slice(0, 4));
  const [recentUsers, setRecentUsers] = useState<User[]>(mockAdminUsers.slice(0, 3));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminOverview() {
      setLoading(true);
      setError(null);
      try {
        const [statsResponse, transactionsResponse, usersResponse] = await Promise.all([
          fetchAdminStats(),
          fetchAdminTransactions(),
          fetchAdminUsers(),
        ]);
        setStats(statsResponse.data);
        setRecentTransactions(transactionsResponse.data.slice(0, 4));
        setRecentUsers(usersResponse.data.slice(0, 3));
      } catch (err) {
        setError(
          err instanceof Error
            ? `${err.message}. Showing mock admin data.`
            : "Unable to load admin data. Showing mock fallback.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAdminOverview();
  }, []);

  const chartData = useMemo(() => adminVolumeTrend, []);

  return (
    <ProtectedRoute requireAdmin>
      <AppShell
        admin
        title="Admin dashboard"
        description="Track platform growth, watch transaction performance, and respond quickly to user account issues."
      >
        {error ? (
          <div className="mb-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            label="Total users"
            value={String(stats.total_users)}
            helper="Registered platform users"
            icon={<Users className="h-5 w-5" />}
          />
          <DashboardCard
            label="Platform balance"
            value={formatMoney(stats.total_wallet_balance)}
            helper="Combined wallet balance"
            icon={<CircleDollarSign className="h-5 w-5" />}
            accent="from-sky-500/15 to-emerald-500/10"
          />
          <DashboardCard
            label="Successful transactions"
            value={String(stats.total_successful_transactions)}
            helper="Completed operations"
            icon={<Activity className="h-5 w-5" />}
            accent="from-emerald-500/15 to-lime-500/10"
          />
          <DashboardCard
            label="Failed transactions"
            value={String(stats.total_failed_transactions)}
            helper="Needs attention"
            icon={<ShieldAlert className="h-5 w-5" />}
            accent="from-rose-500/15 to-orange-500/10"
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="stpay-panel rounded-[1.9rem] p-5">
            <div className="mb-4">
              <p className="text-lg font-semibold text-slate-950">Transaction volume</p>
              <p className="mt-1 text-sm text-slate-600">
                Weekly platform activity across transfers, funding, and bills.
              </p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="transfers" fill="#0f9f69" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="funding" fill="#0b1735" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="bills" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="stpay-panel rounded-[1.9rem] p-5">
            <p className="text-lg font-semibold text-slate-950">Recent users</p>
            <div className="mt-4 grid gap-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="rounded-[1.4rem] bg-slate-50 p-4">
                  <p className="font-semibold text-slate-950">{user.full_name}</p>
                  <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{user.is_email_verified ? "Verified" : "Pending verification"}</span>
                    <span>{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-slate-950">Recent transactions</p>
              <p className="mt-1 text-sm text-slate-600">
                {loading ? "Refreshing from the backend..." : "Most recent platform transactions."}
              </p>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {recentTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </section>
      </AppShell>
    </ProtectedRoute>
  );
}
