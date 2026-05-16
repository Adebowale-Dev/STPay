import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  CreditCard,
  Landmark,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LiveBanner } from "@/components/LiveBanner";

const featureList = [
  {
    title: "Instant Transfers",
    description:
      "Send money across STPay accounts quickly with secure confirmation and transaction PIN checks.",
    icon: ArrowRight,
  },
  {
    title: "Wallet Funding",
    description:
      "Top up your balance and keep your money ready for bills, airtime, and everyday payments.",
    icon: Wallet,
  },
  {
    title: "Smart Bill Payments",
    description:
      "Pay electricity, cable, internet, and more from one simple and consistent interface.",
    icon: CreditCard,
  },
];

const premiumPoints = [
  {
    title: "Secure transaction controls",
    description:
      "Every sensitive action is protected with authentication, transaction PIN verification, and account alerts.",
    icon: ShieldCheck,
  },
  {
    title: "Fast everyday payments",
    description:
      "Move through funding, transfers, airtime, and bills without a cluttered or confusing banking flow.",
    icon: Smartphone,
  },
  {
    title: "Clear account visibility",
    description:
      "Track receipts, history, wallet balance, and notifications from a single organized dashboard.",
    icon: BellRing,
  },
];

const activity = [
  ["Wallet funded", "+N20,000", "2 mins ago"],
  ["Airtime purchase", "-N1,500", "18 mins ago"],
  ["Transfer sent", "-N12,000", "Today"],
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--brand-cream)] text-foreground">
      <Navbar />
      {/* <div className="h-[81px]" /> */}
      <LiveBanner />
      {/* <div className="h-[1px]" /> */}

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-[6%] top-20 h-44 w-44 rounded-full bg-[color:rgba(19,168,104,0.18)] blur-3xl" />
        <div className="pointer-events-none absolute right-[8%] top-16 h-64 w-64 rounded-full bg-[color:rgba(13,23,48,0.08)] blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(13,23,48,0.14),transparent)]" />

        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:pb-28 lg:pt-16">
          <div className="relative z-10 max-w-3xl pt-4 lg:pt-14">
            <Badge className="rounded-full bg-[var(--brand-mint)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-green-dark)] hover:bg-[var(--brand-mint)]">
              Fast, Secure, and Simple Digital Banking
            </Badge>

            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.07em] text-[var(--brand-navy)] sm:text-6xl lg:text-7xl">
              Bank Smarter
              <br />
              with STPay
              <br />
              Every Day
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              Fund wallets, send money, buy airtime, pay bills, and manage your
              account with a cleaner digital banking experience designed for
              speed, confidence, and everyday clarity.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-[var(--brand-green)] px-6 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(19,168,104,0.22)] hover:bg-[var(--brand-green-dark)]"
              >
                <Link href="/register">
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-border bg-white px-6 text-sm font-semibold text-[var(--brand-navy)] hover:bg-muted"
              >
                <Link href="/login">Login</Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                "Wallet funding in seconds",
                "Transfers with PIN protection",
                "Bill and airtime receipts by email",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-border bg-white/90 px-4 py-4 text-sm font-medium text-[var(--brand-navy)] shadow-[0_18px_40px_rgba(13,23,48,0.05)]"
                >
                  <span className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-green)]" />
                    <span>{item}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-white/90 px-4 py-3 text-sm text-muted-foreground shadow-[0_14px_32px_rgba(13,23,48,0.05)]">
              <Landmark className="h-4 w-4 text-[var(--brand-green)]" />
              Built for secure digital wallet operations and simple online
              banking workflows.
            </div>
          </div>

          <div className="relative flex min-h-[640px] items-center justify-center lg:min-h-[720px]">
            <div className="pointer-events-none absolute inset-y-20 right-0 w-[78%] rounded-[3rem] bg-[linear-gradient(180deg,rgba(13,23,48,0.05),rgba(13,23,48,0.02))]" />
            <div className="pointer-events-none absolute left-6 top-24 h-48 w-48 rounded-full bg-[color:rgba(19,168,104,0.18)] blur-3xl" />
            <div className="pointer-events-none absolute right-0 bottom-20 h-52 w-52 rounded-full bg-[color:rgba(13,23,48,0.09)] blur-3xl" />

            <Card className="absolute left-0 top-20 z-10 w-[230px] rounded-[2rem] border-0 bg-white/95 py-0 shadow-[0_24px_80px_rgba(13,23,48,0.1)]">
              <CardHeader className="pb-3">
                <CardDescription className="text-[11px] uppercase tracking-[0.22em]">
                  Balance Overview
                </CardDescription>
                <CardTitle className="text-3xl font-black tracking-[-0.05em] text-[var(--brand-navy)]">
                  N256,400
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-5">
                <div className="rounded-2xl bg-[var(--brand-navy)] p-4 text-white">
                  <p className="text-xs text-white/60">Primary Wallet</p>
                  <p className="mt-4 text-sm tracking-[0.26em] text-white/88">
                    1048 2020 5647
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-2xl bg-[var(--brand-mint)] px-3 py-3 text-[var(--brand-green-dark)]">
                    +N45,000
                  </div>
                  <div className="rounded-2xl bg-muted px-3 py-3 text-[var(--brand-navy)]">
                    12 receipts
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="relative z-20 rotate-[-7deg]">
              <PhoneMock />
            </div>

            <Card className="absolute bottom-18 right-2 z-30 w-[260px] rounded-[2rem] border-0 bg-white/96 py-0 shadow-[0_24px_80px_rgba(13,23,48,0.1)]">
              <CardHeader className="pb-2">
                <CardDescription className="text-[11px] uppercase tracking-[0.22em]">
                  Recent Activity
                </CardDescription>
                <CardTitle className="text-base font-bold text-[var(--brand-navy)]">
                  Seamless daily banking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-5">
                {activity.map(([title, amount, time]) => (
                  <div
                    key={title}
                    className="flex items-center justify-between rounded-2xl bg-muted/80 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--brand-navy)]">
                        {title}
                      </p>
                      <p className="text-xs text-muted-foreground">{time}</p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--brand-navy)]">
                      {amount}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 lg:px-10">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-green-dark)]">
            Core Features
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[var(--brand-navy)] sm:text-4xl">
            The essentials of modern banking, without the clutter
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featureList.map(({ title, description, icon: Icon }) => (
            <Card
              key={title}
              className="rounded-[2rem] border-0 bg-white/95 py-0 shadow-[0_18px_46px_rgba(13,23,48,0.06)]"
            >
              <CardHeader>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-mint)] text-[var(--brand-green-dark)]">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3 text-xl font-bold tracking-[-0.03em] text-[var(--brand-navy)]">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-sm leading-7 text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="why-stpay"
        className="relative overflow-hidden border-y border-border bg-white"
      >
        <div className="pointer-events-none absolute left-[12%] top-[32%] h-36 w-36 rounded-full bg-[color:rgba(19,168,104,0.12)] blur-3xl" />
        <div className="pointer-events-none absolute right-[8%] bottom-[20%] h-44 w-44 rounded-full bg-[color:rgba(13,23,48,0.08)] blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:px-10">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-[24rem] w-[24rem] rounded-full border border-border" />
            <div className="absolute h-[28rem] w-[28rem] rounded-full border border-border/60" />
            <div className="absolute h-44 w-44 rounded-full bg-[color:rgba(19,168,104,0.16)] blur-3xl" />
            <div className="relative z-10">
              <PhoneMock compact />
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[var(--brand-green-dark)]">
              Features
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[var(--brand-navy)] sm:text-5xl">
              STPay Premium
            </h2>

            <div className="mt-8 space-y-8">
              {premiumPoints.map(({ title, description, icon: Icon }) => (
                <div key={title} className="flex gap-4">
                  <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-mint)] text-[var(--brand-green-dark)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-[-0.02em] text-[var(--brand-navy)]">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer id="support" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-10 border-t border-border pt-0 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold tracking-[-0.03em] text-[var(--brand-navy)]">
              STPay
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Fast, Secure, and Simple Digital Banking
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm font-medium text-muted-foreground">
            <Link href="/register">Create Account</Link>
            <Link href="/login">Login</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function PhoneMock({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-[2.7rem] border-[6px] border-[var(--brand-navy)] bg-white p-3 shadow-[0_30px_70px_rgba(13,23,48,0.14)] ${
        compact ? "w-[250px]" : "w-[285px]"
      }`}
    >
      <div className="mx-auto mb-3 h-6 w-28 rounded-full bg-[var(--brand-navy)]" />
      <div className="rounded-[2rem] bg-[#f7f8f5] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Hello</p>
            <p className="mt-1 text-sm font-semibold text-[var(--brand-navy)]">
              Sami
            </p>
          </div>
          <div className="flex -space-x-2">
            <span className="h-8 w-8 rounded-full border-2 border-white bg-emerald-200" />
            <span className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
          </div>
        </div>

        <div className="mt-5 rounded-[1.6rem] bg-[var(--brand-navy)] p-4 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">STPay</p>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">
              Visa
            </p>
          </div>
          <p className="mt-8 text-xs tracking-[0.34em] text-white/76">
            0000 8888 2222 3333
          </p>
          <div className="mt-5 flex items-center justify-between text-[11px] text-white/55">
            <span>07/28</span>
            <span>Primary</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[1.2rem] bg-white p-3">
            <p className="text-[11px] text-muted-foreground">Wallet</p>
            <p className="mt-1 text-sm font-semibold text-[var(--brand-navy)]">
              N4,264
            </p>
          </div>
          <div className="rounded-[1.2rem] bg-white p-3">
            <p className="text-[11px] text-muted-foreground">Savings</p>
            <p className="mt-1 text-sm font-semibold text-[var(--brand-navy)]">
              N3,897
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[1.4rem] bg-[#fbe8e2] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-green)]/16 text-[var(--brand-green-dark)]">
                <Wallet className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--brand-navy)]">
                  N56,000
                </p>
                <p className="text-[11px] text-muted-foreground">Top up</p>
              </div>
            </div>
            <p className="text-[11px] font-semibold text-rose-500">Credit</p>
          </div>
        </div>
      </div>
    </div>
  );
}
