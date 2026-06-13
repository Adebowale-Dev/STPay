"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { getApiErrorMessage, resendVerificationCode, verifyEmail } from "@/lib/api";

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
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.replace(/\D/g, "");

    if (!normalizedEmail) {
      setError("Enter the email address used to create your account.");
      return;
    }
    if (normalizedOtp.length !== 6) {
      setError("Enter the complete 6-digit verification code.");
      return;
    }

    setVerifying(true);
    setError(null);
    try {
      const response = await verifyEmail({ email: normalizedEmail, otp: normalizedOtp });
      setVerified(true);
      setMessage(`${response.message} Redirecting you to login...`);
      window.setTimeout(() => {
        window.location.assign(
          `/login?verified=true&email=${encodeURIComponent(normalizedEmail)}`,
        );
      }, 800);
    } catch (err) {
      setError(getApiErrorMessage(err, "Verification failed."));
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Enter the email address used to create your account.");
      return;
    }

    setResending(true);
    setError(null);
    try {
      const response = await resendVerificationCode(normalizedEmail);
      setOtp("");
      setResendCooldown(30);
      setMessage(`${response.message} Previous verification codes are no longer valid.`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to resend OTP."));
    } finally {
      setResending(false);
    }
  }

  return (
    <SimpleAuthPage
      title="Verify your email"
      description="Enter the OTP sent to your inbox to unlock login and protected wallet actions."
    >
      <form onSubmit={handleVerify} className="grid gap-4">
        <Field label="Email address" value={email} onChange={setEmail} type="email" />
        <Field
          label="OTP code"
          value={otp}
          onChange={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          maxLength={6}
        />
        {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={verified || verifying || resending} className="rounded-full bg-[linear-gradient(135deg,_#0f9f69,_#0c7a51)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
            {verifying ? "Verifying..." : "Verify"}
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={verified || verifying || resending || resendCooldown > 0}
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resending
              ? "Sending new code..."
              : resendCooldown > 0
                ? `Resend available in ${resendCooldown}s`
                : "Request new OTP"}
          </button>
        </div>
        <Link
          href={`/login?${verified ? "verified=true&" : ""}email=${encodeURIComponent(email.trim().toLowerCase())}`}
          className="mx-auto inline-flex w-fit text-center text-sm font-semibold text-emerald-700 transition hover:text-emerald-600 hover:underline focus-visible:underline"
        >
          {verified ? "Continue to login" : "Already verified? Continue to login"}
        </Link>
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
  type = "text",
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: "numeric";
  maxLength?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-emerald-500"
      />
    </label>
  );
}
