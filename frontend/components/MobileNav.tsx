"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CreditCard,
  LayoutDashboard,
  ReceiptText,
  Send,
  Smartphone,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/send-money", label: "Send", icon: Send },
  { href: "/airtime", label: "Airtime", icon: Smartphone },
  { href: "/bills", label: "Bills", icon: CreditCard },
  { href: "/transactions", label: "History", icon: ReceiptText },
  { href: "/notifications", label: "Alerts", icon: Bell },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 flex rounded-[1.8rem] border border-white/80 bg-white/95 p-2 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-[1.3rem] px-2 py-3 text-[11px] font-semibold ${
              active ? "bg-emerald-50 text-emerald-700" : "text-slate-500"
            }`}
          >
            <Icon className="mb-1 h-4 w-4" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
