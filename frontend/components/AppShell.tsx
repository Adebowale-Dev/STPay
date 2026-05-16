"use client";

import { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

import { MobileNav } from "@/components/MobileNav";
import { Sidebar } from "@/components/Sidebar";
import { getStoredUser } from "@/lib/auth";

export function AppShell({
  children,
  title,
  description,
  admin = false,
}: {
  children: ReactNode;
  title: string;
  description: string;
  admin?: boolean;
}) {
  const user = getStoredUser();

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-6">
        <Sidebar admin={admin} />

        <div className="min-w-0 flex-1 pb-28 lg:pb-6">
          <div className="stpay-panel mb-6 overflow-hidden rounded-[2rem] p-0">
            <div className="border-b border-slate-100 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(246,248,247,0.92))] px-6 py-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    {admin ? "Admin workspace" : "Secure banking"}
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                    {title}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
                </div>

                <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    {user ? `Signed in as ${user.full_name}` : "Protected route"}
                  </div>
                  <p className="mt-1 text-xs text-emerald-700">
                    Token-protected interface ready for live backend requests.
                  </p>
                </div>
              </div>
            </div>

            <div className="h-1 w-full bg-[linear-gradient(90deg,_#0f9f69,_#0b1735,_#38bdf8)]" />
          </div>

          {children}
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
