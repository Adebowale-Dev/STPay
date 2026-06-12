"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: "airtime",
    tab: "Quick Airtime",
    eyebrow: "STPay Everyday Banking",
    title: (
      <>
        Quick airtime,
        <br />
        <span className="text-[var(--brand-green-dark)]">fast recharge</span>
        <br />
        with cleaner
        <br />
        wallet funding.
      </>
    ),
    body:
      "Move from wallet balance to airtime purchase in a few guided steps, with clearer pricing and instant account visibility.",
    ctaLabel: "Buy Airtime",
    ctaHref: "/airtime",
    note: "Wallet funding and transaction alerts stay connected in one flow.",
    shellClass:
      "bg-[radial-gradient(circle_at_22%_24%,rgba(135,192,255,0.22),transparent_24%),linear-gradient(135deg,#f4faff_0%,#eaf4ff_42%,#f6fbff_100%)]",
    stage: "airtime" as const,
  },
  {
    id: "identity",
    tab: "Identity Update",
    eyebrow: "STPay Account Security",
    title: (
      <>
        Link your BVN
        <br />
        and NIN to keep
        <br />
        your account
        <br />
        <span className="text-[var(--brand-green-dark)]">active and safe.</span>
      </>
    ),
    body:
      "Guide users through identity updates with a calm onboarding screen that explains why verification matters and what comes next.",
    ctaLabel: "Update Identity",
    ctaHref: "/profile",
    note: "Secure verification steps help protect transfers, wallet access, and account recovery.",
    shellClass:
      "bg-[radial-gradient(circle_at_48%_24%,rgba(255,226,92,0.32),transparent_18%),linear-gradient(135deg,#ffffff_0%,#fffef7_44%,#fcfcfa_100%)]",
    stage: "identity" as const,
  },
  {
    id: "merchant",
    tab: "Merchant Payments",
    eyebrow: "STPay Business Tools",
    title: (
      <>
        Accept payments
        <br />
        with cleaner
        <br />
        <span className="text-[var(--brand-green-dark)]">merchant flows</span>
        <br />
        and lower friction.
      </>
    ),
    body:
      "Support merchant collections, wallet transfers, and transaction receipts with a product surface that feels modern and dependable.",
    ctaLabel: "Explore Payments",
    ctaHref: "/dashboard",
    note: "Built for students, founders, and businesses that need clearer digital money movement.",
    shellClass:
      "bg-[radial-gradient(circle_at_82%_28%,rgba(19,168,104,0.12),transparent_20%),linear-gradient(135deg,#ffffff_0%,#f3fbf7_44%,#ffffff_100%)]",
    stage: "merchant" as const,
  },
  {
    id: "open-account",
    tab: "Open Account",
    eyebrow: "STPay Mobile App",
    title: (
      <>
        Open an account
        <br />
        on STPay and
        <br />
        start banking
        <br />
        <span className="text-white/82">from your phone.</span>
      </>
    ),
    body:
      "Create a wallet, verify your email, and get started from a mobile-first banking experience designed to feel simple from day one.",
    ctaLabel: "Get Started",
    ctaHref: "/get-started",
    note: "Built for onboarding, transfers, bills, airtime, and account history in one product.",
    shellClass:
      "bg-[linear-gradient(135deg,#0b5f3f_0%,#0e8b56_42%,#13a868_100%)] text-white",
    stage: "open-account" as const,
  },
];

export function HeroShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  const goNext = () => {
    setActiveIndex((value) => (value === slides.length - 1 ? 0 : value + 1));
  };

  return (
    <section className="relative overflow-hidden pt-40 sm:pt-44">
      <div className="pointer-events-none absolute left-[6%] top-24 h-56 w-56 rounded-full bg-[color:rgba(19,168,104,0.1)] blur-3xl" />
      <div className="pointer-events-none absolute right-[8%] top-28 h-72 w-72 rounded-full bg-[color:rgba(13,23,48,0.06)] blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-10">
        <div
          className={`relative overflow-hidden rounded-[2.9rem] border border-[rgba(13,23,48,0.08)] shadow-[0_30px_90px_rgba(13,23,48,0.08)] transition-colors duration-500 ${activeSlide.shellClass}`}
        >
          <div className="grid gap-8 px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-[0.9fr_1.05fr_0.46fr] lg:items-center lg:px-12 lg:py-12">
            <div className="relative z-10 max-w-xl">
              <Badge
                className={`rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                  activeSlide.stage === "open-account"
                    ? "border-white/18 bg-white/12 text-white hover:bg-white/12"
                    : "bg-white/92 text-[var(--brand-green-dark)] hover:bg-white"
                }`}
              >
                {activeSlide.eyebrow}
              </Badge>

              <h1
                className={`mt-7 text-4xl font-black leading-[1.02] tracking-[-0.07em] sm:text-5xl lg:text-[4.4rem] ${
                  activeSlide.stage === "open-account"
                    ? "text-white"
                    : "text-[var(--brand-navy)]"
                }`}
              >
                {activeSlide.title}
              </h1>

              <p
                className={`mt-6 max-w-lg text-base leading-8 sm:text-lg ${
                  activeSlide.stage === "open-account"
                    ? "text-white/78"
                    : "text-muted-foreground"
                }`}
              >
                {activeSlide.body}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className={`h-12 rounded-full px-6 text-sm font-semibold shadow-[0_16px_32px_rgba(13,23,48,0.16)] ${
                    activeSlide.stage === "open-account"
                      ? "bg-[var(--brand-navy)] text-white hover:bg-[#132043]"
                      : "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-dark)]"
                  }`}
                >
                  <Link href={activeSlide.ctaHref}>
                    {activeSlide.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={goNext}
                  className={`h-12 rounded-full px-6 text-sm font-semibold ${
                    activeSlide.stage === "open-account"
                      ? "border-white/18 bg-white/10 text-white hover:bg-white/14"
                      : "border-border bg-white/88 text-[var(--brand-navy)] hover:bg-white"
                  }`}
                >
                  See Next View
                </Button>
              </div>

              <div
                className={`mt-8 flex items-start gap-3 text-sm ${
                  activeSlide.stage === "open-account"
                    ? "text-white/76"
                    : "text-muted-foreground"
                }`}
              >
                <BadgeCheck
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    activeSlide.stage === "open-account"
                      ? "text-white"
                      : "text-[var(--brand-green)]"
                  }`}
                />
                <p className="max-w-md leading-7">{activeSlide.note}</p>
              </div>
            </div>

            <div className="relative z-10">
              <HeroVisual stage={activeSlide.stage} />
            </div>

            <div className="relative z-10 lg:justify-self-end">
              <OnlinePanel />
            </div>
          </div>

          <div className="px-6 py-5 sm:px-8 lg:px-12">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={`${slide.id}-dot`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Go to ${slide.tab}`}
                    className={`h-3 w-3 rounded-full transition ${
                      index === activeIndex
                        ? activeSlide.stage === "open-account"
                          ? "bg-white"
                          : "bg-[var(--brand-green)]"
                        : activeSlide.stage === "open-account"
                          ? "bg-white/34"
                          : "bg-[rgba(13,23,48,0.16)]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OnlinePanel() {
  return (
    <div className="mx-auto w-full max-w-[16rem] rounded-[2rem] border border-[rgba(13,23,48,0.08)] bg-white/95 p-0 text-[var(--brand-navy)] shadow-[0_20px_50px_rgba(13,23,48,0.1)] backdrop-blur-sm">
      <div className="border-b border-[rgba(13,23,48,0.06)] px-5 py-5 text-center">
        <p className="text-xl font-bold tracking-[-0.03em]">Online Banking</p>
      </div>
      <div className="border-b border-[rgba(13,23,48,0.06)] px-5 py-4">
        <div className="grid grid-cols-2 gap-4 text-center text-sm font-semibold">
          <button type="button" className="border-b-2 border-[var(--brand-green)] pb-2 text-[var(--brand-green-dark)]">
            Personal
          </button>
          <button type="button" className="pb-2 text-muted-foreground">
            Business
          </button>
        </div>
      </div>
      <div className="px-5 py-5">
        <Button className="h-12 w-full rounded-md bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-dark)]">
          Login
        </Button>
        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <Link href="/get-started" className="transition hover:text-[var(--brand-navy)]">
            Register
          </Link>
          <span className="text-[rgba(13,23,48,0.22)]">|</span>
          <Link href="/login" className="transition hover:text-[var(--brand-navy)]">
            Demo
          </Link>
        </div>
      </div>
    </div>
  );
}

function HeroVisual({ stage }: { stage: (typeof slides)[number]["stage"] }) {
  if (stage === "identity") {
    return (
      <div className="relative mx-auto h-[24rem] w-full max-w-[33rem]">
        <div className="absolute left-1/2 top-4 h-48 w-48 -translate-x-1/2 rounded-full bg-[rgba(19,168,104,0.22)] blur-3xl" />
        <div className="absolute left-1/2 top-8 h-36 w-36 -translate-x-1/2 rounded-full border-[18px] border-[rgba(19,168,104,0.38)] bg-transparent opacity-95 shadow-[0_12px_30px_rgba(19,168,104,0.14)]" />
        <div className="absolute left-1/2 top-18 h-28 w-28 -translate-x-1/2 rounded-full border-[18px] border-[rgba(19,168,104,0.24)] opacity-85" />
        <div className="absolute bottom-0 left-1/2 flex w-full max-w-[20rem] -translate-x-1/2 justify-between gap-4">
          <IdentityCard title="NIN" subtitle="National Identity" />
          <IdentityCard title="BVN" subtitle="Bank Verification" />
        </div>
      </div>
    );
  }

  if (stage === "merchant") {
    return (
      <div className="relative mx-auto h-[24rem] w-full max-w-[33rem]">
        <div className="absolute right-2 top-0 h-32 w-20 rotate-[12deg] rounded-b-[1rem] rounded-t-md bg-[#f7f4ef] shadow-[0_12px_32px_rgba(13,23,48,0.1)]" />
        <div className="absolute right-8 top-12 h-[19rem] w-[13rem] rotate-[14deg] rounded-[1.8rem] bg-[var(--brand-green)] p-4 shadow-[0_28px_80px_rgba(19,168,104,0.22)]">
          <div className="rounded-[1.4rem] bg-[#171717] p-3">
            <div className="h-32 rounded-[1rem] bg-[linear-gradient(135deg,#101828_0%,#172554_34%,#0e8b56_34%,#13a868_68%,#7dd8ab_68%,#dff5ea_100%)] p-3" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["#", "Pay", "Txn", "1", "2", "3", "4", "5", "6"].map((key) => (
                <div
                  key={key}
                  className="flex h-9 items-center justify-center rounded-lg bg-white/92 text-xs font-semibold text-[#171717]"
                >
                  {key}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "open-account") {
    return (
      <div className="relative mx-auto h-[24rem] w-full max-w-[33rem]">
        <div className="absolute left-6 top-8 max-w-[13rem] text-white">
          <p className="text-4xl font-black leading-[0.95] tracking-[-0.06em]">
            Open your
            <br />
            STPay wallet
            <br />
            in minutes.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <MiniStoreBadge label="App Store" />
            <MiniStoreBadge label="Google Play" />
          </div>
        </div>

        <div className="absolute right-0 top-5 w-[13rem] rounded-[2rem] border border-white/16 bg-[#121621] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.26)] sm:right-2 lg:right-0">
          <div className="mx-auto mb-3 h-6 w-24 rounded-full bg-[#232938]" />
          <div className="rounded-[1.5rem] bg-[#1b2230] p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#43db52] text-lg font-bold text-[#0d1730]">
                ✓
              </div>
              <div>
                <p className="text-xl font-bold tracking-[-0.04em]">Congrats!</p>
                <p className="text-xs text-white/60">Your account summary is ready.</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <SummaryRow label="Account Tier" value="Tier 2" />
              <SummaryRow label="Account Type" value="Savings" />
              <SummaryRow label="Account Number" value="7124 853 905" />
            </div>
            <div className="mt-4 rounded-xl bg-[var(--brand-green)] px-3 py-3 text-center text-sm font-semibold text-white">
              Go to the app
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-[24rem] w-full max-w-[33rem]">
      <div className="absolute left-1/2 top-18 h-[17rem] w-[11rem] -translate-x-1/2 rounded-[2.1rem] border-[5px] border-[#1a1a1a] bg-white shadow-[0_28px_80px_rgba(0,0,0,0.18)]" />
      <div className="absolute left-1/2 top-20 h-5 w-24 -translate-x-1/2 rounded-full bg-[#1a1a1a]" />
      <div className="absolute left-1/2 top-30 flex h-[12.5rem] w-[9rem] -translate-x-1/2 items-center justify-center rounded-[1.6rem] border border-[rgba(13,23,48,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#f5f7fb_100%)] text-center shadow-[inset_0_0_0_1px_rgba(13,23,48,0.02)]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Just dial
          </p>
          <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-[var(--brand-navy)]">
            *737*
          </p>
          <p className="text-3xl font-black tracking-[-0.05em] text-[var(--brand-navy)]">
            90#
          </p>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            to recharge quickly
          </p>
        </div>
      </div>
      <div className="absolute left-1/2 top-8 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#3c4a58] px-8 py-3 text-xl font-black tracking-[0.22em] text-white shadow-[0_16px_32px_rgba(60,74,88,0.24)]">
        JUST DIAL
      </div>
        <div className="absolute left-1/2 top-22 -translate-x-1/2 rounded-[2rem] bg-[var(--brand-green)] px-7 py-4 text-center text-5xl font-black tracking-[-0.05em] text-white shadow-[0_26px_50px_rgba(19,168,104,0.22)] sm:text-6xl">
          *737*90#
        </div>
      <FloatingRateCard className="left-1 bottom-0" title="Our Fee" value="2.95%" />
      <FloatingRateCard className="right-1 bottom-0" title="Others" value="15%" dim />
    </div>
  );
}

function IdentityCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex h-28 flex-1 flex-col items-center justify-center rounded-[1.6rem] border border-[rgba(13,23,48,0.08)] bg-white/88 text-center shadow-[0_16px_36px_rgba(13,23,48,0.08)]">
      <p className="text-3xl font-black tracking-[-0.05em] text-[var(--brand-green-dark)]">
        {title}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}

function FloatingRateCard({
  className,
  title,
  value,
  dim = false,
}: {
  className: string;
  title: string;
  value: string;
  dim?: boolean;
}) {
  return (
    <div
      className={`absolute w-[9.5rem] rounded-[1.5rem] border border-white/55 bg-white/72 px-4 py-4 shadow-[0_18px_40px_rgba(13,23,48,0.08)] backdrop-blur-sm ${className}`}
    >
      <p className="text-sm font-semibold text-[var(--brand-navy)]/72">{title}</p>
      <p
        className={`mt-2 text-4xl font-black tracking-[-0.05em] ${
          dim ? "text-[var(--brand-navy)]/74" : "text-[var(--brand-green-dark)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function MiniStoreBadge({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-white/18 bg-[#131313] px-3 py-2 text-xs font-semibold text-white shadow-[0_14px_24px_rgba(0,0,0,0.16)]">
      {label}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-[#222938] px-3 py-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-white/42">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
