"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, CreditCard, LayoutDashboard, LogOut, ReceiptText, Send, Settings, Smartphone, Users, Wallet } from "lucide-react";

import { clearAuthSession, getStoredUser } from "@/lib/auth";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/fund-wallet", label: "Fund wallet", icon: Wallet },
  { href: "/send-money", label: "Send money", icon: Send },
  { href: "/airtime", label: "Buy airtime", icon: Smartphone },
  { href: "/bills", label: "Pay bills", icon: CreditCard },
  { href: "/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/beneficiaries", label: "Beneficiaries", icon: Users },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getStoredUser();
  return (
    <aside className="flex h-screen w-[232px] flex-col border-r border-white/[0.07] bg-[#0d100e] p-3 text-white">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 py-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-400 text-[11px] font-black text-[#07100b]">ST</span>
        <span className="text-sm font-semibold">STPay</span>
      </Link>
      <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
        <p className="truncate text-[11px] font-semibold">{user?.full_name ?? "STPay customer"}</p>
        <p className="mt-1 truncate text-[9px] text-white/35">{user?.email ?? "Secure personal wallet"}</p>
      </div>
      <p className="mt-6 px-3 text-[9px] uppercase tracking-[0.2em] text-white/25">Banking</p>
      <nav className="mt-2 flex-1 space-y-1 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return <Link key={href} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[11px] transition ${active ? "bg-white/[0.09] font-semibold text-white" : "text-white/42 hover:bg-white/[0.045] hover:text-white/80"}`}><Icon className="h-3.5 w-3.5" />{label}</Link>;
        })}
      </nav>
      <button type="button" onClick={() => { clearAuthSession(); router.push("/login"); }} className="flex items-center gap-3 border-t border-white/[0.07] px-3 pt-4 text-[11px] text-white/35 hover:text-rose-300"><LogOut className="h-3.5 w-3.5" /> Sign out</button>
    </aside>
  );
}
