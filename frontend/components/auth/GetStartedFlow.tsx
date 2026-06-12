"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Camera,
  Check,
  CreditCard,
  Fingerprint,
  Landmark,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const benefits = [
  { icon: Landmark, label: "A secure wallet account" },
  { icon: CreditCard, label: "Digital payment access" },
  { icon: BadgePercent, label: "Deals and rewards" },
];

const requirements = [
  { icon: Fingerprint, label: "Your identity details" },
  { icon: Camera, label: "A clear profile photo" },
];

export function GetStartedFlow() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [agreed, setAgreed] = useState(false);
  const [country, setCountry] = useState("Nigeria");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function proceedToRegistration() {
    const query = new URLSearchParams({
      country,
      phone,
      email,
    });
    router.push(`/register?${query.toString()}`);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#fbfcfb] px-4 py-5 text-[var(--brand-navy)] sm:px-6 lg:h-screen lg:overflow-hidden lg:py-4">
      <DecorativeShapes />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col lg:h-full lg:min-h-0">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-green)] text-sm font-black text-white shadow-[0_14px_30px_rgba(19,168,104,0.2)]">
              ST
            </span>
            <div>
              <p className="text-xl font-black tracking-[-0.04em]">STPay</p>
              <p className="text-xs text-muted-foreground">Open your account</p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            {[1, 2].map((item) => (
              <span
                key={item}
                className={`h-2 rounded-full transition-all ${
                  item === step
                    ? "w-8 bg-[var(--brand-green)]"
                    : "w-2 bg-[rgba(13,23,48,0.14)]"
                }`}
              />
            ))}
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center py-6 lg:min-h-0 lg:py-2">
          {step === 1 ? (
            <WelcomeStep
              agreed={agreed}
              onAgreementChange={setAgreed}
              onProceed={() => setStep(2)}
            />
          ) : (
            <DetailsStep
              country={country}
              phone={phone}
              email={email}
              onCountryChange={setCountry}
              onPhoneChange={setPhone}
              onEmailChange={setEmail}
              onBack={() => setStep(1)}
              onProceed={proceedToRegistration}
            />
          )}
        </div>

        <div className="pb-1 text-center text-sm text-muted-foreground">
          {step === 1 ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[var(--brand-green-dark)]">
                Login
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 font-bold text-[var(--brand-green-dark)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function WelcomeStep({
  agreed,
  onAgreementChange,
  onProceed,
}: {
  agreed: boolean;
  onAgreementChange: (value: boolean) => void;
  onProceed: () => void;
}) {
  return (
    <section className="w-full max-w-[38rem] rounded-[1.5rem] border border-white bg-white/96 p-4 shadow-[0_24px_64px_rgba(13,23,48,0.07)] sm:p-5 lg:max-h-full">
      <div className="text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-[var(--brand-mint)] text-[var(--brand-green-dark)]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h1 className="mt-3 text-2xl font-black tracking-[-0.05em] sm:text-3xl">
          Welcome 👋
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Before we create your wallet, here is what you will receive and what
          you should have ready.
        </p>
      </div>

      <div className="mt-5">
        <h2 className="text-center text-base font-bold">What you&apos;ll get with STPay</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {benefits.map(({ icon: Icon, label }) => (
            <OnboardingItem key={label} icon={Icon} label={label} />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-center text-base font-bold">What we will require ✅</h2>
        <div className="mx-auto mt-4 grid max-w-lg gap-5 sm:grid-cols-2">
          {requirements.map(({ icon: Icon, label }) => (
            <OnboardingItem key={label} icon={Icon} label={label} />
          ))}
        </div>
      </div>

      <label className="mx-auto mt-4 flex w-fit max-w-full cursor-pointer items-start gap-3 px-1 py-2 text-xs leading-5 sm:text-sm">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => onAgreementChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[var(--brand-green)] bg-white text-white peer-checked:bg-[var(--brand-green)]">
          {agreed ? <Check className="h-3.5 w-3.5" /> : null}
        </span>
        <span>
          I agree to the{" "}
          <span className="font-bold text-[var(--brand-green-dark)]">
            terms and conditions
          </span>{" "}
          and{" "}
          <span className="font-bold text-[var(--brand-green-dark)]">
            privacy policy
          </span>
          .
        </span>
      </label>

      <Button
        type="button"
        disabled={!agreed}
        onClick={onProceed}
        className="mx-auto mt-4 flex h-11 w-52 rounded-xl bg-[var(--brand-green)] text-sm font-bold text-white shadow-[0_14px_28px_rgba(19,168,104,0.18)] hover:bg-[var(--brand-green-dark)] disabled:bg-slate-200 disabled:text-slate-400"
      >
        Proceed
        <ArrowRight className="h-4 w-4" />
      </Button>

      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        * New STPay customers only.
      </p>
    </section>
  );
}

function DetailsStep({
  country,
  phone,
  email,
  onCountryChange,
  onPhoneChange,
  onEmailChange,
  onBack,
  onProceed,
}: {
  country: string;
  phone: string;
  email: string;
  onCountryChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onBack: () => void;
  onProceed: () => void;
}) {
  const valid = phone.trim().length >= 7 && /^\S+@\S+\.\S+$/.test(email);

  return (
    <section className="w-full max-w-xl rounded-[2.2rem] border border-white bg-white/96 p-6 shadow-[0_28px_80px_rgba(13,23,48,0.08)] sm:p-10">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-green)] text-sm font-black text-white">
        ST
      </div>
      <h1 className="mt-7 text-4xl font-black tracking-[-0.055em]">Get started</h1>
      <div className="mt-3 h-1 w-14 rounded-full bg-[var(--brand-green)]" />
      <p className="mt-8 text-lg font-semibold">Let&apos;s get to know you.</p>

      <div className="mt-7 grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="country">Country of residence</Label>
          <select
            id="country"
            value={country}
            onChange={(event) => onCountryChange(event.target.value)}
            className="h-11 rounded-xl border border-input bg-white px-3 text-sm outline-none focus:border-[var(--brand-green)] focus:ring-4 focus:ring-[rgba(19,168,104,0.12)]"
          >
            <option>Nigeria</option>
            <option>Ghana</option>
            <option>United Kingdom</option>
            <option>United States</option>
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone number</Label>
          <div className="grid grid-cols-[7.5rem_1fr] gap-3">
            <div className="flex h-11 items-center justify-center rounded-xl border border-input bg-[#f8fbf9] text-sm font-semibold">
              🇳🇬 +234
            </div>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) =>
                onPhoneChange(event.target.value.replace(/[^\d+]/g, ""))
              }
              placeholder="8012345678"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-[auto_1fr]">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 rounded-xl px-5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          disabled={!valid}
          onClick={onProceed}
          className="h-12 rounded-xl bg-[var(--brand-green)] text-sm font-bold text-white shadow-[0_14px_28px_rgba(19,168,104,0.18)] hover:bg-[var(--brand-green-dark)] disabled:bg-slate-200 disabled:text-slate-400"
        >
          Proceed to account setup
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}

function OnboardingItem({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="px-2 py-1 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-[var(--brand-mint)] text-[var(--brand-green-dark)]">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm font-medium">{label}</p>
    </div>
  );
}

function DecorativeShapes() {
  return (
    <>
      <div className="pointer-events-none absolute -left-36 top-0 h-[32rem] w-[32rem] rounded-full bg-[rgba(19,168,104,0.12)]" />
      <div className="pointer-events-none absolute -right-32 -top-28 h-[26rem] w-[26rem] rotate-[-20deg] rounded-[42%_58%_38%_62%] bg-[rgba(13,23,48,0.08)]" />
      <div className="pointer-events-none absolute -bottom-48 -left-16 h-[28rem] w-[28rem] rounded-full bg-[rgba(237,190,91,0.18)]" />
      <div className="pointer-events-none absolute -bottom-44 -right-20 h-[28rem] w-[28rem] rounded-full bg-[rgba(13,23,48,0.08)]" />
    </>
  );
}
