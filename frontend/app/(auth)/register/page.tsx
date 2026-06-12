"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

import { AuthFormField } from "@/components/auth/AuthFormField";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7faf8]" />}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: searchParams.get("email") ?? "",
    phone_number: searchParams.get("phone") ?? "",
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

    if (!/^\d{4}$/.test(formData.transaction_pin)) {
      setError("Transaction PIN must contain exactly 4 digits.");
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
      eyebrow="Open your account"
      title="Create your STPay account"
      description="Set up your secure wallet and transaction PIN. It only takes a few minutes."
    >
      <form onSubmit={handleSubmit} className="grid gap-5">
        <AuthFormField
          label="Full name"
          value={formData.full_name}
          onChange={(value) =>
            setFormData((current) => ({ ...current, full_name: value }))
          }
          placeholder="Adebowale Stephen"
          autoComplete="name"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <AuthFormField
            label="Email address"
            type="email"
            value={formData.email}
            onChange={(value) =>
              setFormData((current) => ({ ...current, email: value }))
            }
            placeholder="you@example.com"
            autoComplete="email"
          />
          <AuthFormField
            label="Phone number"
            type="tel"
            value={formData.phone_number}
            onChange={(value) =>
              setFormData((current) => ({ ...current, phone_number: value }))
            }
            placeholder="08012345678"
            autoComplete="tel"
            inputMode="tel"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <AuthFormField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(value) =>
              setFormData((current) => ({ ...current, password: value }))
            }
            placeholder="Create a strong password"
            autoComplete="new-password"
          />
          <AuthFormField
            label="Confirm password"
            type="password"
            value={formData.confirmPassword}
            onChange={(value) =>
              setFormData((current) => ({ ...current, confirmPassword: value }))
            }
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
        </div>

        <AuthFormField
          label="4-digit transaction PIN"
          type="password"
          value={formData.transaction_pin}
          onChange={(value) =>
            setFormData((current) => ({
              ...current,
              transaction_pin: value.replace(/\D/g, "").slice(0, 4),
            }))
          }
          placeholder="Enter 4 digits"
          autoComplete="off"
          inputMode="numeric"
          maxLength={4}
        />

        {error || message ? (
          <p
            role="status"
            className={`rounded-xl border px-4 py-3 text-sm ${
              error
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error ?? message}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={loading}
          className="mt-1 h-12 w-full rounded-xl bg-[var(--brand-green)] text-sm font-bold text-white shadow-[0_14px_28px_rgba(19,168,104,0.18)] hover:bg-[var(--brand-green-dark)]"
        >
          {loading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-[var(--brand-green-dark)] transition hover:text-[var(--brand-green)]"
        >
          Login
        </Link>
      </div>

      <p className="mt-5 text-center text-xs leading-6 text-muted-foreground">
        By creating an account, you agree to STPay&apos;s terms of service and
        privacy policy.
      </p>
    </AuthShell>
  );
}
