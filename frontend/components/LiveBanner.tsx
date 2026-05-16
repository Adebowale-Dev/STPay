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
    <section className="fixed inset-x-0 top-[660px] z-40 px-2 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-none overflow-hidden rounded-full border border-white/20 bg-[rgba(13,23,48,0.52)] text-white shadow-[0_20px_50px_rgba(13,23,48,0.18)] backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-2 sm:px-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
            <BellRing className="h-4 w-4 text-[var(--brand-mint)]" />
          </div>

          <div className="ticker-mask min-w-0 flex-1">
            <div className="ticker-track">
              {[...bannerItems, ...bannerItems].map((item, index) => {
                const Icon = item.icon;

                return (
                  <div key={`${item.title}-${index}`} className="ticker-item">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <Icon className="h-3.5 w-3.5 text-[var(--brand-mint)]" />
                    </span>
                    <p className="text-[13px] font-semibold tracking-[-0.02em] text-white">
                      {item.title}
                    </p>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/35" />
                    <p className="whitespace-nowrap text-[13px] text-white/72">
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
