"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

import { AuthFormField } from "@/components/auth/AuthFormField";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage, loginUser } from "@/lib/api";
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
      const response = await loginUser({
        identifier: formData.identifier.trim(),
        password: formData.password,
      });
      storeAuthSession(response.data.access_token, response.data.user);
      router.push(response.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to STPay"
      description="Enter your account details to continue to your wallet and banking dashboard."
    >
      <form onSubmit={handleSubmit} className="grid gap-5">
        <AuthFormField
          label="Email address or phone number"
          value={formData.identifier}
          onChange={(value) =>
            setFormData((current) => ({ ...current, identifier: value }))
          }
          placeholder="you@example.com or 080..."
          autoComplete="username"
        />

        <div className="grid gap-2">
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[var(--brand-green-dark)] transition hover:text-[var(--brand-green)]"
            >
              Forgot password?
            </Link>
          </div>
          <AuthFormField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(value) =>
              setFormData((current) => ({ ...current, password: value }))
            }
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {error}
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
              Signing in...
            </>
          ) : (
            <>
              Login
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        New to STPay?{" "}
        <Link
          href="/get-started"
          className="font-bold text-[var(--brand-green-dark)] transition hover:text-[var(--brand-green)]"
        >
          Create an account
        </Link>
      </div>

      <p className="mt-5 text-center text-xs leading-6 text-muted-foreground">
        By continuing, you agree to STPay&apos;s terms of service and privacy policy.
      </p>
    </AuthShell>
  );
}
