"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { resendVerificationCode, verifyEmail } from "@/lib/api";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const initialEmail = useMemo(() => searchParams.get("email") ?? "", [searchParams]);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("A verification code has been sent to your email address.");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await verifyEmail({ email, otp });
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setLoading(true);
    setError(null);
    try {
      const response = await resendVerificationCode(email);
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resend OTP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SimpleAuthPage
      title="Verify your email"
      description="Enter the OTP sent to your inbox to unlock login and protected wallet actions."
    >
      <form onSubmit={handleVerify} className="grid gap-4">
        <Field label="Email address" value={email} onChange={setEmail} />
        <Field label="OTP code" value={otp} onChange={setOtp} />
        {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={loading} className="rounded-full bg-[linear-gradient(135deg,_#0f9f69,_#0c7a51)] px-5 py-3 text-sm font-semibold text-white">
            {loading ? "Verifying..." : "Verify"}
          </button>
          <button type="button" onClick={handleResend} disabled={loading} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
            Resend OTP
          </button>
        </div>
      </form>
    </SimpleAuthPage>
  );
}

function VerifyEmailFallback() {
  return (
    <SimpleAuthPage
      title="Verify your email"
      description="Enter the OTP sent to your inbox to unlock login and protected wallet actions."
    >
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
        Loading verification form...
      </div>
    </SimpleAuthPage>
  );
}

function SimpleAuthPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="stpay-surface w-full max-w-2xl rounded-[2.4rem] p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">STPay Security</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-4 text-sm leading-8 text-slate-600">{description}</p>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-emerald-500"
      />
    </label>
  );
}
