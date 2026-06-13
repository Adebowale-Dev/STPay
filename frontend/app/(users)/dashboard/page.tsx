"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Copy, CreditCard, Eye, EyeOff, ReceiptText, Send, Smartphone, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { AppShell } from "@/components/users/AppShell";
import { fetchCurrentUser, fetchNotifications, fetchTransactions, fetchWalletBalance, getApiErrorMessage } from "@/lib/api";
import { formatMoney, startCase } from "@/lib/format";
import { mockNotifications, mockTransactions, mockUser, mockWallet } from "@/lib/mock-data";
import { Notification } from "@/types/notification";
import { Transaction } from "@/types/transaction";
import { User, WalletBalance } from "@/types/user";

export default function DashboardPage() {
  const [user, setUser] = useState<User>(mockUser);
  const [wallet, setWallet] = useState<WalletBalance>(mockWallet);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchCurrentUser(), fetchWalletBalance(), fetchTransactions(), fetchNotifications()])
      .then(([userResponse, walletResponse, transactionResponse, notificationResponse]) => {
        setUser(userResponse.data); setWallet(walletResponse.data); setTransactions(transactionResponse.data); setNotifications(notificationResponse.data);
      })
      .catch((err) => setError(`${getApiErrorMessage(err)} Showing the latest local preview.`));
  }, []);

  const chartData = useMemo(() => [...transactions].reverse().slice(-8).map((item, index) => ({ label: `T${index + 1}`, debit: item.direction === "debit" ? item.amount : 0, credit: item.direction === "credit" ? item.amount : 0 })), [transactions]);

  return (
    <ProtectedRoute>
      <AppShell title={`Good day, ${user.full_name.split(" ")[0]}`} description="Your wallet, payments, and account activity in one place.">
        {error ? <div className="mb-4 rounded-xl border border-amber-300/15 bg-amber-300/[0.06] px-4 py-3 text-[10px] text-amber-200">{error}</div> : null}
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="min-w-0">
            <section className="overflow-hidden rounded-2xl border border-emerald-300/10 bg-[linear-gradient(135deg,#0f5d3d,#0d3e2c_55%,#101713)] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.25)] sm:p-6">
              <div className="flex items-start justify-between">
                <div><p className="text-[9px] uppercase tracking-[0.2em] text-emerald-100/55">Available balance</p><p className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{balanceVisible ? formatMoney(wallet.balance, wallet.currency) : "••••••••"}</p></div>
                <button type="button" onClick={() => setBalanceVisible((value) => !value)} className="rounded-lg bg-white/[0.08] p-2 text-white/55">{balanceVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>
              </div>
              <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
                <button type="button" onClick={() => navigator.clipboard.writeText(wallet.account_number)} className="text-left"><p className="text-[9px] text-emerald-100/45">STPay account number</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold tracking-[0.18em]">{wallet.account_number}<Copy className="h-3 w-3 text-white/35" /></p></button>
                <div className="flex gap-2"><Quick href="/fund-wallet" label="Fund wallet" icon={Wallet} primary /><Quick href="/send-money" label="Send money" icon={Send} /></div>
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 sm:p-5">
              <div className="flex items-center justify-between"><div><p className="text-xs font-semibold">Money movement</p><p className="mt-1 text-[9px] text-white/30">Recent credits and debits</p></div><Link href="/transactions" className="text-[9px] text-emerald-300">View all activity</Link></div>
              <div className="mt-4 h-[240px]">
                <ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ left: -28, right: 5, top: 5 }}><defs><linearGradient id="userCredit" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" stopOpacity={0.25}/><stop offset="100%" stopColor="#34d399" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="rgba(255,255,255,.05)" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#626c66", fontSize: 8 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#626c66", fontSize: 8 }} /><Tooltip contentStyle={{ background: "#111512", border: "1px solid rgba(255,255,255,.08)", borderRadius: 8, fontSize: 10 }} /><Area type="monotone" dataKey="credit" stroke="#34d399" fill="url(#userCredit)" isAnimationActive /><Area type="monotone" dataKey="debit" stroke="#7b847e" fill="transparent" isAnimationActive /></AreaChart></ResponsiveContainer>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
              <p className="text-xs font-semibold">Quick services</p>
              <div className="mt-4 grid grid-cols-2 gap-2"><Service href="/airtime" label="Buy airtime" icon={Smartphone} /><Service href="/bills" label="Pay bills" icon={CreditCard} /><Service href="/transactions" label="Receipts" icon={ReceiptText} /><Service href="/beneficiaries" label="Beneficiaries" icon={Send} /></div>
            </section>
            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
              <div className="flex justify-between"><p className="text-xs font-semibold">Recent activity</p><Link href="/transactions" className="text-[9px] text-emerald-300">See all</Link></div>
              <div className="mt-3 space-y-1">{transactions.slice(0, 5).map((item) => <Activity key={item.id} transaction={item} />)}</div>
            </section>
            <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4"><div className="flex justify-between"><p className="text-xs font-semibold">Notifications</p><Link href="/notifications" className="text-[9px] text-emerald-300">Open inbox</Link></div><div className="mt-3 space-y-3">{notifications.slice(0, 3).map((item) => <div key={item.id} className="border-l border-emerald-300/30 pl-3"><p className="text-[10px] font-medium text-white/70">{item.title}</p><p className="mt-1 line-clamp-2 text-[9px] leading-4 text-white/30">{item.message}</p></div>)}</div></section>
          </aside>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}

function Quick({ href, label, icon: Icon, primary = false }: { href: string; label: string; icon: typeof Wallet; primary?: boolean }) { return <Link href={href} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-semibold ${primary ? "bg-emerald-400 text-[#07100b]" : "bg-white/[0.08] text-white"}`}><Icon className="h-3.5 w-3.5" />{label}</Link>; }
function Service({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Wallet }) { return <Link href={href} className="rounded-xl border border-white/[0.06] bg-white/[0.018] p-3 transition hover:bg-white/[0.05]"><Icon className="h-4 w-4 text-emerald-300" /><p className="mt-4 text-[10px] font-medium text-white/65">{label}</p></Link>; }
function Activity({ transaction }: { transaction: Transaction }) { const credit = transaction.direction === "credit"; return <div className="flex items-center gap-3 rounded-lg px-1 py-2.5"><span className={`rounded-lg p-2 ${credit ? "bg-emerald-400/10 text-emerald-300" : "bg-white/[0.05] text-white/40"}`}>{credit ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}</span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-medium text-white/70">{transaction.description || startCase(transaction.transaction_type)}</p><p className="mt-1 text-[8px] text-white/25">{startCase(transaction.status)}</p></div><p className={`text-[10px] font-semibold ${credit ? "text-emerald-300" : "text-white/65"}`}>{credit ? "+" : "-"}{formatMoney(transaction.amount)}</p></div>; }
