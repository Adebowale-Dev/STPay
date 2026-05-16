"use client";

import { ArrowDownRight, ArrowUpRight, Bell, CreditCard, Send, Smartphone, Wallet } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AppShell } from "@/components/AppShell";
import { DashboardCard } from "@/components/DashboardCard";
import { NotificationCard } from "@/components/NotificationCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TransactionCard } from "@/components/TransactionCard";
import { formatMoney } from "@/lib/format";
import { mockNotifications, mockTransactions, mockUser, mockWallet, spendingTrend } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppShell
        title={`Welcome back, ${mockUser.full_name.split(" ")[0]}`}
        description="Monitor your wallet, review recent activity, and jump straight into the most important STPay actions."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            label="Wallet balance"
            value={formatMoney(mockWallet.balance)}
            helper={`Account No: ${mockWallet.account_number}`}
            icon={<Wallet className="h-5 w-5" />}
          />
          <DashboardCard
            label="Total money sent"
            value={formatMoney(52000)}
            helper="This month"
            icon={<ArrowUpRight className="h-5 w-5" />}
            accent="from-rose-500/12 to-orange-500/10"
          />
          <DashboardCard
            label="Total money received"
            value={formatMoney(81000)}
            helper="This month"
            icon={<ArrowDownRight className="h-5 w-5" />}
            accent="from-sky-500/15 to-emerald-500/10"
          />
          <DashboardCard
            label="Bills + Airtime"
            value={formatMoney(9700)}
            helper="Combined spend"
            icon={<CreditCard className="h-5 w-5" />}
            accent="from-violet-500/12 to-sky-500/10"
          />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <QuickAction href="/fund-wallet" label="Fund Wallet" icon={<Wallet className="h-5 w-5" />} />
          <QuickAction href="/send-money" label="Send Money" icon={<Send className="h-5 w-5" />} />
          <QuickAction href="/airtime" label="Buy Airtime" icon={<Smartphone className="h-5 w-5" />} />
          <QuickAction href="/bills" label="Pay Bills" icon={<CreditCard className="h-5 w-5" />} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="stpay-panel rounded-[1.9rem] p-5">
            <div className="mb-4">
              <p className="text-lg font-semibold text-slate-950">Spending trend</p>
              <p className="mt-1 text-sm text-slate-600">
                Mock analytics ready to swap over to live backend data.
              </p>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingTrend}>
                  <defs>
                    <linearGradient id="sentFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f9f69" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0f9f69" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Area type="monotone" dataKey="sent" stroke="#0f9f69" fill="url(#sentFill)" strokeWidth={3} />
                  <Area type="monotone" dataKey="received" stroke="#0b1735" fill="transparent" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="stpay-panel rounded-[1.9rem] p-5">
            <p className="text-lg font-semibold text-slate-950">Notification preview</p>
            <div className="mt-4 grid gap-4">
              {mockNotifications.slice(0, 3).map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-700" />
            <p className="text-lg font-semibold text-slate-950">Recent transactions</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {mockTransactions.slice(0, 4).map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </section>
      </AppShell>
    </ProtectedRoute>
  );
}

function QuickAction({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="stpay-panel flex items-center justify-between rounded-[1.5rem] px-5 py-4 transition hover:translate-y-[-1px]"
    >
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <span className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">{icon}</span>
    </a>
  );
}
