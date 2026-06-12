"use client";

import { BellRing, ShieldCheck, Wallet } from "lucide-react";

const bannerItems = [
  {
    title: "Instant wallet funding",
    description: "Fund your STPay wallet and get email alerts from the backend in real time.",
    icon: Wallet,
  },
  {
    title: "Secure transfers",
    description: "Every transfer is protected with authentication and transaction PIN verification.",
    icon: ShieldCheck,
  },
  {
    title: "Live account updates",
    description: "Track funding, transfers, airtime, bills, and notifications from one place.",
    icon: BellRing,
  },
];

export function LiveBanner() {
  return (
    <section className="fixed inset-x-0 top-[88px] z-40 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-full border border-[rgba(13,23,48,0.08)] bg-[rgba(255,255,255,0.96)] text-[var(--brand-navy)] shadow-[0_16px_40px_rgba(13,23,48,0.08)]">
        <div className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-mint)]">
            <BellRing className="h-4 w-4 text-[var(--brand-mint)]" />
          </div>

          <div className="ticker-mask min-w-0 flex-1">
            <div className="ticker-track">
              {[...bannerItems, ...bannerItems].map((item, index) => {
                const Icon = item.icon;

                return (
                  <div key={`${item.title}-${index}`} className="ticker-item">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-mint)]">
                      <Icon className="h-3.5 w-3.5 text-[var(--brand-green-dark)]" />
                    </span>
                    <p className="text-[13px] font-semibold tracking-[-0.02em] text-[var(--brand-navy)]">
                      {item.title}
                    </p>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[rgba(13,23,48,0.22)]" />
                    <p className="whitespace-nowrap text-[13px] text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
