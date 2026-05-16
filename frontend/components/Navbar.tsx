"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#why-stpay", label: "Why STPay" },
  { href: "#support", label: "Support" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-[rgba(13,23,48,0.52)] text-white shadow-[0_20px_50px_rgba(13,23,48,0.18)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-green)] text-sm font-semibold text-white shadow-[0_14px_30px_rgba(19,168,104,0.22)]">
            ST
          </span>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">
              STPay
            </p>
            <p className="text-xs text-white/68">
              Digital Wallet & Online Banking
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-white/74 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="rounded-full px-5 text-sm text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[var(--brand-green)] px-6 text-sm text-white shadow-[0_14px_28px_rgba(19,168,104,0.2)] hover:bg-[var(--brand-green-dark)]"
          >
            <Link href="/register">Create Account</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/20 bg-[rgba(13,23,48,0.7)] px-4 py-4 backdrop-blur-xl md:hidden sm:px-6">
          <div className="grid gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-white/74 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <Button
              asChild
              variant="ghost"
              className="justify-start rounded-2xl px-3 py-6 text-sm text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              className="justify-start rounded-2xl bg-[var(--brand-green)] px-3 py-6 text-sm text-white hover:bg-[var(--brand-green-dark)]"
            >
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
