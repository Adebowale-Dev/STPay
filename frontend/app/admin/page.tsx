"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  MoreHorizontal,
  ReceiptText,
  ShieldAlert,
  UserRoundCheck,
  Users,
} from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { fetchAdminStats, fetchAdminTransactions, fetchAdminUsers } from "@/lib/api";
import { formatMoney, startCase } from "@/lib/format";
import { mockAdminStats, mockAdminUsers, mockTransactions } from "@/lib/mock-data";
import { Transaction } from "@/types/transaction";
import { User } from "@/types/user";

type AdminStats = typeof mockAdminStats;

const revenueTrend = [
  { day: "May 13", value: 62 },
  { day: "May 17", value: 68 },
  { day: "May 21", value: 66 },
  { day: "May 25", value: 75 },
  { day: "May 29", value: 72 },
  { day: "Jun 2", value: 81 },
  { day: "Jun 6", value: 86 },
  { day: "Jun 11", value: 94 },
];

const orderTrend = [
  { day: "14", value: 31 }, { day: "16", value: 39 }, { day: "18", value: 34 },
  { day: "20", value: 46 }, { day: "22", value: 41 }, { day: "24", value: 37 },
  { day: "26", value: 52 }, { day: "28", value: 58 }, { day: "30", value: 51 },
  { day: "01", value: 64 }, { day: "03", value: 59 }, { day: "05", value: 68 },
  { day: "07", value: 73 }, { day: "09", value: 82 }, { day: "11", value: 69 },
];

const customerBars = [28, 36, 49, 38, 58, 44, 63, 52, 76, 65, 82, 69, 91, 73, 88, 96, 78, 92, 84, 100, 87, 94];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>(mockAdminStats);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [users, setUsers] = useState<User[]>(mockAdminUsers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminOverview() {
      try {
        const [statsResponse, transactionsResponse, usersResponse] = await Promise.all([
          fetchAdminStats(),
          fetchAdminTransactions(),
          fetchAdminUsers(),
        ]);
        setStats(statsResponse.data);
        setTransactions(transactionsResponse.data);
        setUsers(usersResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Live data is temporarily unavailable.");
      } finally {
        setLoading(false);
      }
    }

    loadAdminOverview();
  }, []);

  const successfulValue = useMemo(
    () => transactions.filter((item) => item.status === "successful").reduce((sum, item) => sum + item.amount, 0),
    [transactions],
  );
  const activeUsers = users.filter((user) => user.is_active && !user.is_frozen).length;
  const verifiedRate = users.length
    ? Math.round((users.filter((user) => user.is_email_verified).length / users.length) * 100)
    : 0;
  const successRate = stats.total_successful_transactions + stats.total_failed_transactions
    ? Math.round(
        (stats.total_successful_transactions /
          (stats.total_successful_transactions + stats.total_failed_transactions)) *
          100,
      )
    : 100;
  const revenueBreakdown = [
    { name: "Successful", value: Math.max(stats.total_successful_transactions, 1), fill: "#34d399" },
    { name: "Failed", value: Math.max(stats.total_failed_transactions, 1), fill: "#242a27" },
  ];

  return (
    <ProtectedRoute requireAdmin>
      <AdminShell title="Good evening" description="Here is what is happening across STPay today.">
        <div className="mx-auto max-w-[1500px] px-4 py-5 lg:px-7">
          <div className="mb-5 flex flex-wrap items-center justify-end gap-2">
            <ControlButton><CalendarDays className="h-3 w-3" /> May 13 - Jun 11, 2026</ControlButton>
            <ControlButton>Last 30 days</ControlButton>
            <ControlButton><MoreHorizontal className="h-3.5 w-3.5" /></ControlButton>
          </div>

          {error ? (
            <div className="mb-4 rounded-lg border border-amber-300/15 bg-amber-300/[0.06] px-3 py-2 text-[10px] text-amber-200">
              {error} Showing the latest local preview.
            </div>
          ) : null}

          <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_310px]">
            <div className="min-w-0 xl:border-r xl:border-white/[0.07] xl:pr-6">
              <div className="grid gap-4 border-b border-white/[0.07] pb-5 sm:grid-cols-3">
                <Metric label="Verified customer rate" value={`${verifiedRate}%`} change="2.7% vs prior 30 days" tone="green" />
                <Metric label="Successful transactions" value={stats.total_successful_transactions.toLocaleString()} change="4.1% vs prior 30 days" tone="green" />
                <Metric label="Average transaction value" value={formatMoney(transactions.length ? successfulValue / transactions.length : 0)} change="1.3% vs prior 30 days" tone="red" />
              </div>

              <section className="border-b border-white/[0.07] py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] text-white/38">Processed transaction value</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">{formatMoney(successfulValue)}</p>
                  </div>
                  <p className="mt-5 text-[9px] font-medium text-emerald-400">+27.4% over last 30 days</p>
                </div>
                <div className="mt-4 h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueTrend} margin={{ left: -25, right: 6, top: 8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="adminRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a7b0aa" stopOpacity={0.24} />
                          <stop offset="100%" stopColor="#a7b0aa" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.055)" strokeDasharray="3 3" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#69736d", fontSize: 9 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#69736d", fontSize: 9 }} />
                      <Tooltip content={<DarkTooltip suffix="k" />} cursor={{ stroke: "rgba(52,211,153,.24)" }} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8a948e"
                        strokeWidth={1.5}
                        fill="url(#adminRevenue)"
                        isAnimationActive
                        animationDuration={1400}
                        animationEasing="ease-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="grid gap-6 border-b border-white/[0.07] py-5 md:grid-cols-[1fr_1.1fr]">
                <div>
                  <p className="flex items-center gap-2 text-[10px] font-medium text-white/72">
                    <CircleDollarSign className="h-3.5 w-3.5" /> Platform insight
                  </p>
                  <p className="mt-5 max-w-sm text-xl leading-7 text-white/75">
                    Successful transaction volume is <span className="font-semibold text-white">{successRate}%</span> of recorded activity.
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-white/38">Platform wallet balance</p>
                    <p className="text-[9px] text-white/35">Allocation health</p>
                  </div>
                  <p className="mt-1 text-2xl font-semibold">{formatMoney(stats.total_wallet_balance)}</p>
                  <div className="mt-8 grid grid-cols-[2fr_1fr_1fr] gap-1">
                    <ProgressBlock width="78%" label="Available" />
                    <ProgressBlock width="54%" label="In transfer" muted />
                    <ProgressBlock width="36%" label="Reserved" muted />
                  </div>
                </div>
              </section>

              <section className="pt-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-2xl font-semibold">{stats.total_successful_transactions.toLocaleString()}</p>
                    <p className="mt-1 text-[10px] text-white/38">Successful transactions in the last 30 days</p>
                  </div>
                  <p className="text-[9px] text-emerald-400">Peak activity on Jun 11</p>
                </div>
                <div className="mt-5 h-[215px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orderTrend} margin={{ left: -30, right: 0, top: 8, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.045)" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#59625d", fontSize: 8 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#59625d", fontSize: 8 }} />
                      <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,.025)" }} />
                      <Bar dataKey="value" fill="#323733" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={1200}>
                        {orderTrend.map((entry, index) => (
                          <Cell key={entry.day} fill={index === 12 ? "#8a948e" : "#323733"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            <aside className="mt-6 space-y-0 xl:mt-0 xl:pl-6">
              <section className="border-b border-white/[0.07] pb-5">
                <div className="mx-auto h-[210px] max-w-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueBreakdown}
                        dataKey="value"
                        innerRadius={68}
                        outerRadius={91}
                        startAngle={215}
                        endAngle={-35}
                        paddingAngle={3}
                        stroke="none"
                        isAnimationActive
                        animationDuration={1600}
                      >
                        {revenueBreakdown.map((item) => <Cell key={item.name} fill={item.fill} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none relative -top-[126px] text-center">
                    <p className="text-[9px] text-white/35">Total processed</p>
                    <p className="mt-1 text-sm font-semibold">{formatMoney(successfulValue)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-[9px] text-white/40">
                  <span><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" /> Successful</span>
                  <span><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#323733]" /> Failed</span>
                </div>
              </section>

              <section className="border-b border-white/[0.07] py-5">
                <p className="text-[9px] text-white/35">Active customers</p>
                <div className="mt-1 flex items-end justify-between">
                  <p className="text-xl font-semibold">{activeUsers.toLocaleString()}</p>
                  <p className="text-[9px] font-semibold text-white/70">{verifiedRate}% verified</p>
                </div>
                <div className="mt-4 flex h-10 items-end gap-[3px]">
                  {customerBars.map((height, index) => (
                    <span
                      key={`${height}-${index}`}
                      className="w-full rounded-t-[1px] bg-white/25 animate-in fade-in slide-in-from-bottom-2"
                      style={{ height: `${height}%`, animationDelay: `${index * 35}ms` }}
                    />
                  ))}
                </div>
              </section>

              <section className="border-b border-white/[0.07] py-5">
                <p className="text-[9px] text-white/35">Latest transaction</p>
                {transactions[0] ? (
                  <div className="mt-4 space-y-3 text-[10px]">
                    <DataRow label="Reference" value={transactions[0].reference.slice(-10)} />
                    <DataRow label="Amount" value={formatMoney(transactions[0].amount)} />
                    <DataRow label="Type" value={startCase(transactions[0].transaction_type)} />
                    <DataRow label="Status" value={startCase(transactions[0].status)} good={transactions[0].status === "successful"} />
                  </div>
                ) : null}
              </section>

              <section className="py-5">
                <p className="text-[9px] text-white/35">Needs attention</p>
                <div className="mt-3 space-y-1">
                  <Attention icon={ShieldAlert} label="Failed transactions" count={stats.total_failed_transactions} />
                  <Attention icon={Users} label="Frozen accounts" count={users.filter((user) => user.is_frozen).length} />
                  <Attention icon={UserRoundCheck} label="Pending verification" count={users.filter((user) => !user.is_email_verified).length} />
                  <Attention icon={ReceiptText} label="Pending settlements" count={transactions.filter((item) => item.status === "pending").length} />
                </div>
              </section>
            </aside>
          </div>

          {loading ? <p className="mt-5 text-[9px] text-white/25">Refreshing platform data...</p> : null}
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}

function ControlButton({ children }: { children: React.ReactNode }) {
  return <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.025] px-2.5 py-2 text-[9px] text-white/55 transition hover:bg-white/[0.07]">{children}</button>;
}

function Metric({ label, value, change, tone }: { label: string; value: string; change: string; tone: "green" | "red" }) {
  return (
    <div className="border-l border-white/[0.07] pl-4 first:border-l-0 first:pl-0">
      <p className="text-[9px] text-white/35">{label}</p>
      <p className="mt-1.5 text-xl font-semibold tracking-tight">{value}</p>
      <p className={`mt-1.5 text-[8px] ${tone === "green" ? "text-emerald-400" : "text-rose-400"}`}>
        <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
        {change}
      </p>
    </div>
  );
}

function ProgressBlock({ width, label, muted = false }: { width: string; label: string; muted?: boolean }) {
  return (
    <div>
      <div className="h-2 rounded-full bg-white/[0.06]">
        <div className={`h-full rounded-full ${muted ? "bg-white/20" : "bg-white/45"}`} style={{ width }} />
      </div>
      <p className="mt-2 text-[8px] text-white/30">{label}</p>
    </div>
  );
}

function DataRow({ label, value, good = false }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-white/35">{label}</span>
      <span className={good ? "text-emerald-400" : "text-white/75"}>{value}</span>
    </div>
  );
}

function Attention({ icon: Icon, label, count }: { icon: typeof AlertCircle; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 rounded-lg px-1 py-2 text-[10px] text-white/55">
      <Icon className="h-3.5 w-3.5 text-white/45" />
      <span className="flex-1">{label}</span>
      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/[0.07] px-1 text-[8px] text-white/75">{count}</span>
      <ArrowUpRight className="h-3 w-3 text-white/25" />
    </div>
  );
}

function DarkTooltip({ active, payload, suffix = "" }: { active?: boolean; payload?: Array<{ value?: number }>; suffix?: string }) {
  if (!active || !payload?.[0]) return null;
  return <div className="rounded-lg border border-white/10 bg-[#151916] px-2.5 py-2 text-[9px] text-white shadow-xl">{payload[0].value}{suffix}</div>;
}
