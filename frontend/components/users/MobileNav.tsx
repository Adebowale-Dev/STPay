"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, LayoutDashboard, ReceiptText, Send, Wallet } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/fund-wallet", label: "Fund", icon: Wallet },
  { href: "/send-money", label: "Send", icon: Send },
  { href: "/bills", label: "Bills", icon: CreditCard },
  { href: "/transactions", label: "Activity", icon: ReceiptText },
];
export function MobileNav() {
  const pathname = usePathname();
  return <nav className="fixed inset-x-3 bottom-3 z-30 flex rounded-2xl border border-white/[0.08] bg-[#111512]/95 p-1.5 shadow-2xl backdrop-blur lg:hidden">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[9px] ${pathname === href ? "bg-emerald-400 text-[#07100b]" : "text-white/40"}`}><Icon className="h-3.5 w-3.5" />{label}</Link>)}</nav>;
}
