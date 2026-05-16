"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { loginUser } from "@/lib/api";
import { storeAuthSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser(formData);
      storeAuthSession(response.data.access_token, response.data.user);
      router.push(response.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="stpay-auth-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[2.5rem] bg-[linear-gradient(145deg,_#081225,_#0f1c3d)] p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
            Welcome back
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Sign in to your STPay account
          </h1>
          <p className="mt-5 max-w-md text-sm leading-8 text-slate-300">
            Access wallet funding, transfers, airtime, bills, notifications, and
            your full transaction history from one secure account.
          </p>

          <div className="mt-10 grid gap-4">
            <InfoStrip title="Protected wallet operations" subtitle="Sensitive flows stay behind authentication and transaction PIN checks." />
            <InfoStrip title="Real backend connection" subtitle="This frontend is wired for live FastAPI responses and secure token sessions." />
            <InfoStrip title="Clear account visibility" subtitle="Review receipts, transfers, alerts, and account activity in one place." />
          </div>
        </div>

        <div className="stpay-auth-card rounded-[2.5rem] p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">STPay Access</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
            Login
          </h2>
          <p className="mt-4 text-sm leading-8 text-slate-600">
            Sign in with your email address or phone number.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <AuthField label="Email or phone number" value={formData.identifier} onChange={(value) => setFormData((current) => ({ ...current, identifier: value }))} />
            <AuthField label="Password" type="password" value={formData.password} onChange={(value) => setFormData((current) => ({ ...current, password: value }))} />
            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
            <button type="submit" disabled={loading} className="rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
            <Link href="/register" className="font-semibold text-emerald-700">
              Create account
            </Link>
            <Link href="/forgot-password" className="font-semibold text-slate-700">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoStrip({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/6 px-5 py-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-300">{subtitle}</p>
    </div>
  );
}

function AuthField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="stpay-field"
      />
    </label>
  );
}
