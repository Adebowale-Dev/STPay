"use client";

import { FormEvent, useState } from "react";

import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start password reset.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="stpay-surface w-full max-w-xl rounded-[2.4rem] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">STPay Support</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Forgot password</h1>
        <p className="mt-4 text-sm leading-8 text-slate-600">
          Enter your email address and STPay will send a password reset code through the backend.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-emerald-500"
            />
          </label>
          {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          <button type="submit" disabled={loading} className="rounded-full bg-[linear-gradient(135deg,_#0f9f69,_#0c7a51)] px-5 py-3 text-sm font-semibold text-white">
            {loading ? "Submitting..." : "Send reset code"}
          </button>
        </form>
      </div>
    </main>
  );
}
