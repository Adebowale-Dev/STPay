"use client";

import { Bell, CheckCheck, LogOut, Menu, Settings, ShieldCheck, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileNav } from "@/components/users/MobileNav";
import { Sidebar } from "@/components/users/Sidebar";
import { fetchNotifications, markNotificationRead } from "@/lib/api";
import { clearAuthSession, getStoredUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { Notification } from "@/types/notification";

export function AppShell({ children, title, description }: { children: ReactNode; title: string; description: string }) {
  const user = getStoredUser();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let active = true;
    fetchNotifications()
      .then((response) => {
        if (active) setNotifications(response.data);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  async function readNotification(notification: Notification) {
    if (notification.is_read) return;
    try {
      await markNotificationRead(notification.id);
      setNotifications((current) =>
        current.map((item) => item.id === notification.id ? { ...item, is_read: true } : item),
      );
    } catch {
      // The full inbox remains available if this quick action cannot complete.
    }
  }

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" aria-label="Open recent notifications" className="relative rounded-lg border border-white/[0.08] bg-white/[0.025] p-2.5 text-white/50 outline-none hover:text-white focus:border-emerald-400/30">
                  <Bell className="h-3.5 w-3.5" />
                  {unreadCount ? <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-emerald-400 px-1 text-[7px] font-bold text-[#07100b]">{unreadCount > 9 ? "9+" : unreadCount}</span> : null}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[min(340px,calc(100vw-2rem))] border border-white/[0.08] bg-[#101512] p-1.5 text-white shadow-[0_18px_50px_rgba(0,0,0,.45)]">
                <DropdownMenuLabel className="flex items-center justify-between px-2 py-2">
                  <span><span className="block text-[10px] font-semibold text-white/75">Recent notifications</span><span className="mt-1 block text-[8px] font-normal text-white/30">{unreadCount ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}` : "You are all caught up"}</span></span>
                  <Bell className="h-3.5 w-3.5 text-emerald-300" />
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/[0.07]" />
                {notifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onSelect={() => readNotification(notification)}
                    className={`cursor-pointer items-start gap-3 px-2.5 py-2.5 focus:bg-emerald-400/10 ${notification.is_read ? "text-white/40" : "text-white/70"}`}
                  >
                    <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${notification.is_read ? "bg-white/[0.04] text-white/30" : "bg-emerald-400/10 text-emerald-300"}`}>
                      {notification.is_read ? <CheckCheck className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[9px] font-semibold">{notification.title}</span>
                      <span className="mt-1 line-clamp-2 block text-[8px] leading-4 text-white/30">{notification.message}</span>
                      <span className="mt-1.5 block text-[7px] text-white/20">{formatDateTime(notification.created_at)}</span>
                    </span>
                    {!notification.is_read ? <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" /> : null}
                  </DropdownMenuItem>
                ))}
                {!notifications.length ? <p className="px-3 py-8 text-center text-[9px] text-white/25">No recent notifications.</p> : null}
                <DropdownMenuSeparator className="bg-white/[0.07]" />
                <DropdownMenuItem asChild className="cursor-pointer justify-center px-2.5 py-2.5 text-[9px] font-semibold text-emerald-300 focus:bg-emerald-400/10 focus:text-emerald-200">
                  <Link href="/notifications">View all notifications</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" aria-label="Open account menu" className="grid h-9 w-9 place-items-center rounded-full bg-emerald-400 text-[10px] font-bold text-[#07100b] outline-none ring-emerald-300/30 focus:ring-4">
                  {user?.full_name.split(" ").map((part) => part[0]).slice(0, 2).join("") || "ST"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border border-white/[0.08] bg-[#101512] p-1.5 text-white shadow-[0_18px_50px_rgba(0,0,0,.45)]">
                <DropdownMenuLabel className="px-2 py-2">
                  <p className="truncate text-[10px] font-semibold text-white/75">{user?.full_name ?? "STPay customer"}</p>
                  <p className="mt-1 truncate text-[8px] font-normal text-white/30">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/[0.07]" />
                <DropdownMenuItem asChild className="cursor-pointer px-2.5 py-2 text-[10px] text-white/55 focus:bg-emerald-400/10 focus:text-emerald-200">
                  <Link href="/profile"><UserRound className="h-3.5 w-3.5" /> Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer px-2.5 py-2 text-[10px] text-white/55 focus:bg-emerald-400/10 focus:text-emerald-200">
                  <Link href="/notifications"><Bell className="h-3.5 w-3.5" /> Notifications</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer px-2.5 py-2 text-[10px] text-white/55 focus:bg-emerald-400/10 focus:text-emerald-200">
                  <Link href="/profile"><Settings className="h-3.5 w-3.5" /> Account settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.07]" />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => { clearAuthSession(); router.push("/login"); }}
                  className="cursor-pointer px-2.5 py-2 text-[10px] text-rose-300 focus:bg-rose-400/10 focus:text-rose-200"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="mx-auto max-w-[1500px] px-4 py-5 lg:px-7">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
