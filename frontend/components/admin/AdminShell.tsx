"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CircleHelp,
  CircleUserRound,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  Users,
  X,
} from "lucide-react";
import { ReactNode, useState } from "react";

import { clearAuthSession, getStoredUser } from "@/lib/auth";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/transactions", label: "Transactions", icon: ReceiptText },
];

export function AdminShell({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getStoredUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  function logout() {
    clearAuthSession();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#080a09] text-[#f3f7f4]">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl border border-white/10 bg-[#111412] p-2.5 text-white lg:hidden"
        aria-label="Open admin navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[232px] flex-col border-r border-white/[0.07] bg-[#0d100e] p-3 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2 py-2">
          <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-400 text-[11px] font-black text-[#07100b]">
              ST
            </span>
            <span className="text-sm font-semibold tracking-tight">STPay Admin</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="text-white/50 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-2.5">
          <div className="flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-full bg-[linear-gradient(135deg,#6ee7b7,#16a34a)] shadow-[0_0_20px_rgba(52,211,153,0.22)]" />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">STPay Platform</p>
              <p className="mt-0.5 text-[10px] text-white/38">Operations workspace</p>
            </div>
          </div>
        </div>

        <AdminNavGroup
          label="Platform"
          links={adminLinks}
          pathname={pathname}
          close={() => setMobileOpen(false)}
        />
        <div className="mt-auto space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-white/45 transition hover:bg-white/[0.05] hover:text-white"
          >
            <CircleHelp className="h-3.5 w-3.5" />
            Help center
          </Link>
          <div className="flex items-center gap-2.5 border-t border-white/[0.07] px-2 pt-3">
            <CircleUserRound className="h-7 w-7 text-white/55" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold">{user?.full_name ?? "STPay Admin"}</p>
              <p className="truncate text-[9px] text-white/35">{user?.email ?? "admin@gmail.com"}</p>
            </div>
            <button type="button" onClick={logout} className="text-white/35 transition hover:text-rose-400" aria-label="Logout">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-[232px]">
        <header className="flex min-h-16 items-center border-b border-white/[0.06] px-5 pl-16 lg:px-7">
          <div>
            <h1 className="text-sm font-semibold">{title}</h1>
            {description ? <p className="mt-1 hidden text-[10px] text-white/35 sm:block">{description}</p> : null}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[10px] text-white/55 sm:inline-flex">
              Live platform data
            </span>
            <Link
              href="/admin/transactions"
              className="rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-[10px] font-medium transition hover:bg-white/[0.08]"
            >
              <CreditCard className="mr-1.5 inline h-3 w-3" />
              Review activity
            </Link>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function AdminNavGroup({
  label,
  links,
  pathname,
  close,
}: {
  label: string;
  links: typeof adminLinks;
  pathname: string;
  close: () => void;
}) {
  return (
    <div className="mt-6">
      <p className="px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">{label}</p>
      <nav className="mt-2 space-y-1">
        {links.map(({ href, label: itemLabel, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={`${itemLabel}-${href}`}
              href={href}
              onClick={close}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[11px] transition ${
                active
                  ? "bg-white/[0.09] font-semibold text-white"
                  : "text-white/42 hover:bg-white/[0.045] hover:text-white/80"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {itemLabel}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
