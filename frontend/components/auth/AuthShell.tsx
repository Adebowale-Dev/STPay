import Link from "next/link";
import { ArrowLeft, BadgeCheck, LockKeyhole, ShieldCheck, WalletCards } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const benefits = [
  { icon: ShieldCheck, label: "Protected account access" },
  { icon: WalletCards, label: "One wallet for everyday banking" },
  { icon: LockKeyhole, label: "Secure transaction PIN controls" },
];

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f7faf8] text-[var(--brand-navy)]">
      <div className="grid min-h-screen lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative hidden overflow-hidden bg-[linear-gradient(145deg,#075c3d_0%,#0e8b56_52%,#13a868_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full border border-white/12" />
          <div className="pointer-events-none absolute -left-12 top-32 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute bottom-[-11rem] right-[-7rem] h-[32rem] w-[32rem] rounded-full bg-white/8 blur-3xl" />

          <Link href="/" className="relative z-10 inline-flex w-fit items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-black text-[var(--brand-green-dark)] shadow-[0_14px_30px_rgba(0,0,0,0.12)]">
              ST
            </span>
            <div>
              <p className="text-xl font-bold tracking-[-0.04em]">STPay</p>
              <p className="text-xs text-white/62">Digital banking, made clearer</p>
            </div>
          </Link>

          <div className="relative z-10 max-w-xl">
            <Badge className="border border-white/14 bg-white/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white hover:bg-white/10">
              Fast, secure, and simple
            </Badge>
            <h2 className="mt-7 text-5xl font-black leading-[1.02] tracking-[-0.065em] xl:text-6xl">
              Your money,
              <br />
              always within
              <br />
              easy reach.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-white/72">
              Fund your wallet, transfer money, buy airtime, pay bills, and keep
              every transaction visible from one secure account.
            </p>

            <div className="mt-8 grid gap-3">
              {benefits.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 px-4 py-3.5 backdrop-blur-sm"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/12">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-white/88">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-white/48">
            Secure wallet operations powered by the STPay backend.
          </p>
        </section>

        <section className="flex min-h-screen flex-col bg-white">
          <header className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-[var(--brand-navy)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to STPay
            </Link>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-green-dark)]">
              <BadgeCheck className="h-4 w-4" />
              Secure access
            </div>
          </header>

          <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
            <div className="w-full max-w-[30rem]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brand-green-dark)]">
                  {eyebrow}
                </p>
                <h1 className="mt-4 text-4xl font-black tracking-[-0.055em] text-[var(--brand-navy)] sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  {description}
                </p>
              </div>

              <div className="mt-8">{children}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
