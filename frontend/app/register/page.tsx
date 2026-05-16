"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    transaction_pin: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        transaction_pin: formData.transaction_pin,
      });
      setMessage("A verification code has been sent to your email address.");
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your STPay account"
      description="Open your secure wallet, set your transaction PIN, and start banking smarter."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-700">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <AuthField label="Full name" value={formData.full_name} onChange={(value) => setFormData((current) => ({ ...current, full_name: value }))} />
        <AuthField label="Email address" type="email" value={formData.email} onChange={(value) => setFormData((current) => ({ ...current, email: value }))} />
        <AuthField label="Phone number" value={formData.phone_number} onChange={(value) => setFormData((current) => ({ ...current, phone_number: value }))} />
        <AuthField label="Password" type="password" value={formData.password} onChange={(value) => setFormData((current) => ({ ...current, password: value }))} />
        <AuthField label="Confirm password" type="password" value={formData.confirmPassword} onChange={(value) => setFormData((current) => ({ ...current, confirmPassword: value }))} />
        <AuthField label="4-digit transaction PIN" value={formData.transaction_pin} onChange={(value) => setFormData((current) => ({ ...current, transaction_pin: value }))} />
        <StatusMessage error={error} message={message} />
        <button type="submit" disabled={loading} className="rounded-full bg-[linear-gradient(135deg,_#0f9f69,_#0c7a51)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}

function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="stpay-auth-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2.5rem] bg-[linear-gradient(145deg,_#081225,_#0f1c3d)] p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">STPay</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{title}</h1>
          <p className="mt-5 text-sm leading-8 text-slate-300">{description}</p>

          <div className="mt-10 grid gap-4">
            <InfoPanel
              title="Secure onboarding"
              subtitle="Registration connects directly to email verification and backend-powered account setup."
            />
            <InfoPanel
              title="Wallet created automatically"
              subtitle="Each successful signup gets an STPay wallet and account number provisioned in the backend."
            />
            <InfoPanel
              title="Transaction PIN included"
              subtitle="Users can start with a protected payment flow from the moment their account is created."
            />
          </div>
        </div>

        <div className="stpay-auth-card rounded-[2.5rem] p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Open account</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
            Create Account
          </h2>
          <p className="mt-4 text-sm leading-8 text-slate-600">
            Enter your details below to begin your STPay setup.
          </p>
          {children}
          <p className="mt-6 text-sm text-slate-600">{footer}</p>
        </div>
      </div>
    </main>
  );
}

function InfoPanel({ title, subtitle }: { title: string; subtitle: string }) {
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

function StatusMessage({
  error,
  message,
}: {
  error: string | null;
  message: string | null;
}) {
  if (!error && !message) {
    return null;
  }

  return (
    <p
      className={`rounded-2xl px-4 py-3 text-sm ${
        error ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {error ?? message}
    </p>
  );
}
