"use client";

import { Bell, Menu, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";

import { MobileNav } from "@/components/users/MobileNav";
import { Sidebar } from "@/components/users/Sidebar";
import { getStoredUser } from "@/lib/auth";

export function AppShell({ children, title, description }: { children: ReactNode; title: string; description: string }) {
  const user = getStoredUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080a09] text-[#f4f7f5]">
      <button type="button" onClick={() => setMobileOpen(true)} className="fixed left-4 top-4 z-40 rounded-xl border border-white/10 bg-[#111412] p-2.5 lg:hidden" aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </button>
      {mobileOpen ? <button type="button" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/70 lg:hidden" aria-label="Close navigation" /> : null}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button type="button" onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 z-10 text-white/40 lg:hidden"><X className="h-4 w-4" /></button>
        <Sidebar />
      </div>

      <main className="min-h-screen pb-24 lg:pl-[232px] lg:pb-0">
        <header className="flex min-h-16 items-center border-b border-white/[0.06] px-5 pl-16 lg:px-7">
          <div>
            <h1 className="text-sm font-semibold text-white">{title}</h1>
            <p className="mt-1 hidden text-[10px] text-white/35 sm:block">{description}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-lg border border-emerald-300/10 bg-emerald-400/[0.06] px-3 py-2 text-[9px] text-emerald-300 sm:flex">
              <ShieldCheck className="h-3 w-3" /> Protected session
            </span>
            <Link href="/notifications" className="relative rounded-lg border border-white/[0.08] bg-white/[0.025] p-2.5 text-white/50 hover:text-white">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </Link>
            <Link href="/profile" className="grid h-9 w-9 place-items-center rounded-full bg-emerald-400 text-[10px] font-bold text-[#07100b]">
              {user?.full_name.split(" ").map((part) => part[0]).slice(0, 2).join("") || "ST"}
            </Link>
          </div>
        </header>
        <div className="mx-auto max-w-[1500px] px-4 py-5 lg:px-7">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
