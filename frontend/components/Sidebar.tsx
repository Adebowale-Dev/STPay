"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CircleDollarSign,
  CreditCard,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Send,
  Settings,
  Shield,
  Smartphone,
  Users,
  Wallet,
} from "lucide-react";

import { clearAuthSession } from "@/lib/auth";

type SidebarProps = {
  admin?: boolean;
};

const userLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/fund-wallet", label: "Fund Wallet", icon: Wallet },
  { href: "/send-money", label: "Send Money", icon: Send },
  { href: "/airtime", label: "Buy Airtime", icon: Smartphone },
  { href: "/bills", label: "Pay Bills", icon: CreditCard },
  { href: "/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/beneficiaries", label: "Beneficiaries", icon: Users },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: Settings },
];

const adminLinks = [
  { href: "/admin", label: "Admin Dashboard", icon: Shield },
  { href: "/admin/users", label: "Admin Users", icon: Users },
  { href: "/admin/transactions", label: "Admin Transactions", icon: CircleDollarSign },
];

export function Sidebar({ admin = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const items = admin ? adminLinks : userLinks;

  return (
    <aside className="hidden h-[calc(100vh-2rem)] w-[280px] shrink-0 flex-col rounded-[2rem] bg-[linear-gradient(180deg,_#081225_0%,_#0b1735_100%)] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] lg:flex">
      <div className="mb-8">
        <p className="text-xl font-semibold tracking-tight">STPay</p>
        <p className="mt-1 text-sm text-slate-300">
          {admin ? "Platform control center" : "Fast, Secure, and Simple Digital Banking"}
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-white text-slate-950 shadow-[0_16px_30px_rgba(255,255,255,0.18)]"
                  : "text-slate-300 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => {
          clearAuthSession();
          router.push("/login");
        }}
        className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/8"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
