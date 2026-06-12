import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Camera,
  Download,
  Globe,
  MessageCircleMore,
  Play,
  ScanLine,
  Wallet,
} from "lucide-react";

import { HeroShowcase } from "@/components/landing/HeroShowcase";
import { LandingPerformance } from "@/components/landing/LandingPerformance";
import { LiveBanner } from "@/components/landing/LiveBanner";
import { Navbar } from "@/components/landing/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const featureCards = [
  {
    title: "Virtual and physical cards",
    description:
      "Spend your way with fast virtual cards and a clear path to managing card activity from one place.",
    icon: Wallet,
  },
  {
    title: "Voice-guided banking",
    description:
      "Move through balances, transfers, and bills with a simpler guided banking flow built for speed and clarity.",
    icon: MessageCircleMore,
  },
  {
    title: "Tap and pay",
    description:
      "Handle contactless-style everyday payments, wallet actions, and quick money movement with less friction.",
    icon: ArrowRight,
  },
];

const testimonials = [
  {
    quote:
      "The wallet funding flow is simple and clean. I always know exactly what happened after each transaction.",
    name: "Amaka Ebun",
    role: "Everyday banking user",
    badge: "Funding",
  },
  {
    quote:
      "Transfers feel more reliable here because the confirmation steps are clear and the account history is easy to follow.",
    name: "Adeniyi Gabriel",
    role: "Frequent transfer user",
    badge: "Transfers",
  },
  {
    quote:
      "I like that airtime, bills, and notifications all feel connected. The product feels organized instead of noisy.",
    name: "Anita Eyeta",
    role: "Bills and airtime user",
    badge: "Utilities",
  },
  {
    quote:
      "The dashboard gives a better view of recent activity. I can check receipts and balance without searching around.",
    name: "Yasheu Williams",
    role: "Wallet customer",
    badge: "Dashboard",
  },
  {
    quote:
      "The app feels calm. Even small actions like checking recent transactions or alerts are easier to trust here.",
    name: "Nnaife Edward",
    role: "Active account holder",
    badge: "Alerts",
  },
  {
    quote:
      "I appreciate how the banking experience stays straightforward. It feels like it was designed for daily use.",
    name: "Chisom Joy",
    role: "Digital banking user",
    badge: "Experience",
  },
];

const assistantPrompts = [
  {
    quote: "Hi STPay, how much did I spend on bills this week?",
    name: "Akin",
    tone: "mint",
    avatar: "/avatars/avatar-1.svg",
  },
  {
    quote: "Hi STPay, send N30,000 to my saved beneficiary.",
    name: "Mercy",
    tone: "violet",
    avatar: "/avatars/avatar-2.svg",
  },
  {
    quote: "Hey STPay, create a new savings goal for school fees.",
    name: "Firdausi",
    tone: "orange",
    avatar: "/avatars/avatar-3.svg",
  },
  {
    quote: "Hey STPay, buy N2,000 airtime for my MTN number.",
    name: "Faheedat",
    tone: "purple",
    avatar: "/avatars/avatar-4.svg",
  },
] as const;

const faqItems = [
  {
    question: "How do I open an STPay account?",
    answer:
      "It is quick and fully digital. Create your account with your full name, email address, phone number, password, and transaction PIN, then verify your email to activate your wallet experience.",
  },
  {
    question: "What if I do not have a BVN yet?",
    answer:
      "You can still explore parts of the onboarding flow, but some wallet and transfer features may require identity details before full access is enabled.",
  },
  {
    question: "Can I use STPay without a smartphone?",
    answer:
      "The main product experience is designed for modern web and mobile flows, but the interface is intentionally simple so users can move through everyday actions without friction.",
  },
  {
    question: "What do I need before I can fund my wallet?",
    answer:
      "You need a verified account and a successful sign-in. Once your profile is active, you can use the funding flow and immediately see the updated balance on your dashboard.",
  },
  {
    question: "Can I manage transfers, airtime, and bills in one place?",
    answer:
      "Yes. STPay is designed to keep funding, transfers, airtime, bill payments, receipts, and notifications inside one connected digital banking experience.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--brand-cream)] text-foreground">
      <Navbar />
      <LiveBanner />
      <LandingPerformance />
      <HeroShowcase />

      <section className="landing-lazy border-y border-border bg-white/75">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="rounded-full bg-white px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-navy)] shadow-[0_10px_24px_rgba(13,23,48,0.04)] hover:bg-white">
              Banking that listens, learns, and acts
            </Badge>
            <h2 className="mt-6 text-4xl font-black leading-[1.14] tracking-[-0.05em] text-[var(--brand-navy)] sm:text-5xl">
              Meet <span className="text-[var(--brand-green-dark)]">STPay Assist.</span>
              <br />
              Your smart banking companion.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              A guided assistant experience that helps users check balances,
              send money, buy airtime, and move through common banking actions
              with more clarity.
            </p>
          </div>

          <div className="relative mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-[1fr_15rem_1fr] lg:grid-rows-2 lg:items-center">
            <div className="hidden lg:block" />
            <div className="relative row-span-2 mx-auto flex h-[15rem] w-[15rem] items-center justify-center">
              <AnimatedAssistantOrb />
            </div>
            <div className="hidden lg:block" />

            <AssistantPromptCard item={assistantPrompts[0]} className="lg:justify-self-end lg:self-end" />
            <AssistantPromptCard item={assistantPrompts[1]} className="lg:justify-self-start lg:self-end" />
            <AssistantPromptCard item={assistantPrompts[2]} className="lg:justify-self-end lg:self-start" />
            <AssistantPromptCard item={assistantPrompts[3]} className="lg:justify-self-start lg:self-start" />
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-[var(--brand-green)] px-7 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(19,168,104,0.16)] hover:bg-[var(--brand-green-dark)]"
            >
              <Link href="/get-started">
                Explore STPay Assist
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="landing-lazy bg-[linear-gradient(180deg,#e8f5ee_0%,#edf8f1_100%)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="rounded-full bg-white px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-green-dark)] shadow-[0_10px_24px_rgba(13,23,48,0.04)] hover:bg-white">
              Everyday Banking, Reinvented
            </Badge>
            <h2 className="mt-6 text-4xl font-black tracking-[-0.05em] text-[var(--brand-navy)] sm:text-5xl">
              All-in-one smart app
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              STPay brings cards, payments, transfers, and everyday account
              actions into one cleaner digital banking experience.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {featureCards.map(({ title, description, icon: Icon }) => (
              <Card
                key={title}
                className="rounded-[2rem] border border-white/70 bg-white/96 py-0 shadow-[0_18px_46px_rgba(13,23,48,0.06)]"
              >
              <CardHeader className="px-8 pb-3 pt-8">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[var(--brand-mint)] text-[var(--brand-green-dark)] shadow-[0_10px_24px_rgba(19,168,104,0.12)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-5 text-2xl font-bold tracking-[-0.04em] text-[var(--brand-navy)]">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-base leading-8 text-muted-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mx-auto mt-18 max-w-5xl">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="rounded-full bg-white px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-navy)] shadow-[0_10px_24px_rgba(13,23,48,0.04)] hover:bg-white">
                Save, spend, track, and grow - all in one place.
              </Badge>
              <h3 className="mt-6 text-4xl font-black leading-[1.14] tracking-[-0.05em] text-[var(--brand-navy)] sm:text-5xl">
                This is your sign to break
                <br />
                up with your old bank.
              </h3>
            </div>

            <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-between">
                <div>
                  <h4 className="text-3xl font-black leading-[1.14] tracking-[-0.04em] text-[var(--brand-navy)]">
                    Bank anytime,
                    <span className="text-[var(--brand-green-dark)]"> even in your pyjamas.</span>
                  </h4>
                  <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
                    No long queues, confusing flows, or friction around
                    everyday actions. STPay keeps wallet funding, cards, bills,
                    and balance checks inside one calmer experience.
                  </p>
                </div>

                <div className="mt-10 max-w-[19rem] space-y-4">
                  <div className="rounded-[1.65rem] border border-white/70 bg-white p-5 shadow-[0_18px_46px_rgba(13,23,48,0.06)]">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-navy)]/58">
                        Quick access
                      </p>
                      <button className="text-xs font-semibold text-[var(--brand-green-dark)]">
                        View all
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[
                        ["Transfer", "↗"],
                        ["Cards", "💳"],
                        ["Pay bills", "🧾"],
                      ].map(([label, icon]) => (
                        <div
                          key={label}
                          className="rounded-[1rem] bg-[#f8fbf9] px-3 py-3 text-center"
                        >
                          <div className="text-lg">{icon}</div>
                          <p className="mt-2 text-[11px] font-medium text-[var(--brand-navy)]/72">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[var(--brand-green)]" />
                      <span className="h-2 w-2 rounded-full bg-[rgba(13,23,48,0.16)]" />
                    </div>
                  </div>

                  <div className="rounded-[1.65rem] border border-white/70 bg-white p-5 shadow-[0_18px_46px_rgba(13,23,48,0.06)]">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-navy)]/58">
                        Featured billers
                      </p>
                      <button className="text-xs font-semibold text-[var(--brand-green-dark)]">
                        View all
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-3">
                      {[
                        { label: "DSTV", src: "/biller-logos/dstv.svg" },
                        { label: "GOTV", src: "/biller-logos/gotv.svg" },
                        { label: "EKO", src: "/biller-logos/eko.svg" },
                        { label: "Airtime", src: "/biller-logos/airtime.svg" },
                      ].map((item) => (
                        <div key={item.label} className="text-center">
                          <div className="mx-auto flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_8px_18px_rgba(13,23,48,0.06)]">
                            <Image
                              src={item.src}
                              alt={`${item.label} logo`}
                              width={40}
                              height={40}
                              className="h-10 w-10 object-cover"
                            />
                          </div>
                          <p className="mt-2 text-[11px] font-medium text-[var(--brand-navy)]/72">
                            {item.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between border-t border-white/30 pt-2 lg:border-l lg:border-t-0 lg:pl-12">
                <div className="mx-auto w-full max-w-[17rem] rounded-[2.2rem] border border-white/70 bg-white p-4 shadow-[0_24px_60px_rgba(13,23,48,0.08)]">
                  <div className="rounded-[1.6rem] bg-[linear-gradient(135deg,#0b5f3f_0%,#0e8b56_52%,#13a868_100%)] p-4 text-white">
                    <div className="flex items-center justify-between text-xs">
                      <span>STPay Wallet</span>
                      <span className="rounded-full bg-white/16 px-2 py-1">Active</span>
                    </div>
                    <p className="mt-3 text-2xl font-black tracking-[-0.04em]">
                      N250,550.00
                    </p>
                    <p className="mt-2 text-[11px] text-white/70">
                      5736736676 | STPay Account
                    </p>
                  </div>

                  <div className="mt-4 rounded-[1.4rem] border border-border bg-[#fbfcfa] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[var(--brand-navy)]">
                        Local Transfer
                      </p>
                      <span className="text-xs text-[var(--brand-green-dark)]">
                        Send to self
                      </span>
                    </div>
                    <div className="mt-4 rounded-[1rem] border border-border bg-white px-3 py-3 text-sm text-[var(--brand-navy)]">
                      8161
                    </div>
                    <div className="mt-4 flex items-center gap-3 rounded-[1rem] bg-white px-3 py-3 shadow-[0_10px_22px_rgba(13,23,48,0.04)]">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-mint)] text-sm font-bold text-[var(--brand-green-dark)]">
                        V
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--brand-navy)]">
                          Abayomi Damilare Christopher
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          8169249302 | STPay Wallet
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <h4 className="text-3xl font-black leading-[1.14] tracking-[-0.04em] text-[var(--brand-navy)]">
                    Transfers in seconds.
                    <br />
                    <span className="text-[var(--brand-green-dark)]">No hidden drama.</span>
                  </h4>
                  <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
                    Send money instantly, confirm beneficiary details clearly,
                    and move through funding or payments without the usual
                    stress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="why-stpay"
        className="landing-lazy overflow-hidden border-y border-white/6 bg-[#0a0d14] py-20 text-white"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 hover:bg-white/6">
              Testimonials
            </Badge>
            <h2 className="mt-6 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Why people love banking
              <br />
              with STPay
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/62">
              A clean banking experience is easier to trust. These are the
              kinds of product moments STPay is designed to deliver every day.
            </p>
          </div>

          <div className="mt-14 hidden grid-cols-3 gap-4 lg:grid">
            <TestimonialColumn
              items={[testimonials[0], testimonials[3], testimonials[4], testimonials[1]]}
              direction="up"
            />
            <TestimonialColumn
              items={[testimonials[1], testimonials[5], testimonials[2], testimonials[0]]}
              direction="down"
            />
            <TestimonialColumn
              items={[testimonials[2], testimonials[4], testimonials[3], testimonials[5]]}
              direction="up"
            />
          </div>

          <div className="mt-12 grid gap-5 lg:hidden">
            {testimonials.slice(0, 4).map((item) => (
              <TestimonialCard key={item.name + item.badge} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="landing-lazy mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="rounded-full bg-white px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-navy)] shadow-[0_10px_24px_rgba(13,23,48,0.04)] hover:bg-white">
            Frequently Asked Questions
          </Badge>
          <h2 className="mt-6 text-4xl font-black leading-[1.12] tracking-[-0.05em] text-[var(--brand-navy)] sm:text-5xl">
            Still have questions?
            <br />
            We&apos;ve got you covered.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            No guesswork. Just clear answers to the things people ask the most.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl space-y-4">
          {faqItems.map((item, index) => (
            <details
              key={item.question}
              className="group overflow-hidden rounded-[1.6rem] bg-white/96 shadow-[0_14px_34px_rgba(13,23,48,0.04)]"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left sm:px-6">
                <span className="pr-4 text-lg font-semibold tracking-[-0.03em] text-[var(--brand-navy)]">
                  {item.question}
                </span>
                <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[rgba(13,23,48,0.22)] text-[var(--brand-navy)]">
                  <span className="absolute h-px w-3 bg-current" />
                  <span className="absolute h-3 w-px bg-current transition group-open:scale-y-0" />
                </span>
              </summary>
              <div className="px-5 pb-6 pt-0 sm:px-6">
                <p className="max-w-3xl text-base leading-8 text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-[var(--brand-green)] px-7 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(19,168,104,0.16)] hover:bg-[var(--brand-green-dark)]"
          >
            <Link href="#support">
              See more FAQs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="landing-lazy mx-auto max-w-7xl px-4 pb-18 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[2.8rem] bg-[linear-gradient(135deg,#0b5f3f_0%,#0e8b56_52%,#13a868_100%)] px-7 py-10 text-white shadow-[0_28px_80px_rgba(14,139,86,0.2)] sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute right-[-2rem] top-1/2 h-[22rem] w-[22rem] -translate-y-1/2 rounded-full border border-white/14" />
          <div className="pointer-events-none absolute right-[2rem] top-1/2 h-[18rem] w-[18rem] -translate-y-1/2 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(255,255,255,0.12),transparent_24%)]" />

          <div className="relative grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
                Trusted by thousands
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
                Loved for
                <br />
                simplicity.
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-white/80">
                Download STPay and manage funding, transfers, airtime, bills,
                and account activity from one clean digital banking experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <StoreBadge label="Get it on Google Play" dark />
                <StoreBadge label="Download on the App Store" apple dark />
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <PromoPhoneMock />
            </div>
          </div>
        </div>
      </section>

      <footer
        id="support"
        className="relative mt-8 overflow-hidden bg-[#090c14] text-white"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(19,168,104,0.14),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:44px_44px] opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-4xl font-black leading-tight tracking-[-0.05em] sm:text-5xl">
              Never miss a smart
              <br />
              money move
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/68">
              Join users who want early updates on STPay features, account
              improvements, and product releases.
            </p>

            <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                className="h-13 flex-1 rounded-2xl border border-white/10 bg-white px-5 text-sm text-[var(--brand-navy)] outline-none transition focus:border-[var(--brand-green)]"
              />
              <Button
                size="lg"
                className="h-13 rounded-2xl bg-[linear-gradient(135deg,#13a868,#0e8b56)] px-7 text-sm font-semibold text-white hover:opacity-95"
              >
                Subscribe
              </Button>
            </div>
          </div>

          <div className="mt-18 grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.7fr]">
            <div className="max-w-sm">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-white/8 text-xl font-black tracking-[-0.04em]">
                ST
              </div>
              <p className="mt-5 text-2xl font-bold tracking-[-0.03em]">STPay</p>
              <p className="mt-4 text-sm leading-8 text-white/66">
                STPay is a secure digital wallet and online banking platform
                built to help users fund, transfer, pay, and manage money with
                clarity from anywhere.
              </p>

              <div className="mt-6 flex items-center gap-4 text-white/78">
                <SocialIcon>
                  <Globe className="h-4 w-4" />
                </SocialIcon>
                <SocialIcon>
                  <BriefcaseBusiness className="h-4 w-4" />
                </SocialIcon>
                <SocialIcon>
                  <MessageCircleMore className="h-4 w-4" />
                </SocialIcon>
                <SocialIcon>
                  <Camera className="h-4 w-4" />
                </SocialIcon>
              </div>

              <div className="mt-10 max-w-[13rem]">
                <Button
                  className="h-11 w-full rounded-2xl bg-[linear-gradient(135deg,#13a868,#0e8b56)] text-sm font-semibold text-white hover:opacity-95"
                >
                  <ScanLine className="mr-2 h-4 w-4" />
                  Scan
                </Button>
                <p className="mt-3 text-xs leading-6 text-white/56">
                  Click to scan and download the STPay app
                </p>
              </div>
            </div>

            <FooterColumn
              title="Company"
              links={[
                ["About STPay", "/"],
                ["Help center", "/"],
                ["Contact us", "/"],
              ]}
            />
            <FooterColumn
              title="Products"
              links={[
                ["Personal Banking", "/register"],
                ["Wallet Funding", "/fund-wallet"],
                ["Transactions", "/transactions"],
              ]}
            />
            <FooterColumn
              title="Resources"
              links={[
                ["FAQs", "/"],
                ["Notifications", "/notifications"],
                ["Profile Settings", "/profile"],
              ]}
            />
            <FooterColumn
              title="Legal"
              links={[
                ["Privacy Policy", "/"],
                ["Accessibility", "/"],
              ]}
            />
          </div>

          <div className="mt-16 border-t border-white/8 pt-8 text-center">
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-16">
              <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/42">
                Supported by
              </p>
              <div className="mt-1.5 text-sm font-semibold text-white/78">
                STPay Platform
              </div>
              </div>
              <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/42">
                Licensed by
              </p>
              <div className="mt-1.5 text-sm font-semibold text-white/78">
                Internal Demo Use
              </div>
              </div>
            </div>
            <p className="mt-5 text-sm font-medium text-white/56">
              © STPAY 2026 | All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StoreBadge({
  label,
  apple = false,
  dark = false,
}: {
  label: string;
  apple?: boolean;
  dark?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-3 ${
        dark
          ? "border-white/12 bg-[#111111] shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
          : "border-border bg-white shadow-[0_10px_24px_rgba(13,23,48,0.04)]"
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          dark ? "bg-white/12 text-white" : "bg-[var(--brand-navy)] text-white"
        }`}
      >
        {apple ? <Download className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
      </span>
      <div>
        <p
          className={`text-[11px] uppercase tracking-[0.2em] ${
            dark ? "text-white/58" : "text-muted-foreground"
          }`}
        >
          Mobile App
        </p>
        <p
          className={`text-sm font-semibold ${
            dark ? "text-white" : "text-[var(--brand-navy)]"
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

function AnimatedAssistantOrb() {
  return (
    <div className="assistant-orb-wrap relative flex h-full w-full items-center justify-center">
      <div className="assistant-orb-halo absolute inset-0 rounded-full" />
      <div className="assistant-orb-ring absolute inset-[0.65rem] rounded-full border border-[rgba(19,168,104,0.26)]" />
      <div className="assistant-orb-ring assistant-orb-ring-delayed absolute inset-[1.3rem] rounded-full border border-[rgba(19,168,104,0.16)]" />
      <div className="assistant-orb relative h-[6.5rem] w-[6.5rem] overflow-hidden rounded-full border border-white/60 bg-[radial-gradient(circle_at_30%_28%,#d8fff0_0%,#8cf0c4_22%,#21cb83_48%,#0e8b56_72%,#094830_100%)] shadow-[0_28px_60px_rgba(19,168,104,0.22)]">
        <div className="assistant-orb-blob assistant-orb-blob-primary absolute left-[-8%] top-[18%] h-[3.8rem] w-[8rem] rounded-full bg-[linear-gradient(90deg,rgba(207,255,236,0.72),rgba(112,238,187,0.34),rgba(255,255,255,0))]" />
        <div className="assistant-orb-blob assistant-orb-blob-secondary absolute left-[8%] top-[48%] h-[2.2rem] w-[7rem] rounded-full bg-[linear-gradient(90deg,rgba(5,102,64,0.08),rgba(5,102,64,0.28),rgba(5,102,64,0.02))]" />
        <div className="assistant-orb-wave absolute left-[-12%] top-[42%] h-[2.2rem] w-[124%] rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.0),rgba(255,255,255,0.18),rgba(255,255,255,0.04))]" />
        <div className="assistant-orb-core absolute inset-[1rem] rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.54),rgba(255,255,255,0.06)_52%,transparent_70%)]" />
        <div className="assistant-orb-gloss absolute inset-[0.65rem] rounded-full border border-white/16" />
      </div>
      <span className="assistant-orb-spark absolute left-[1.4rem] top-[2.1rem] h-2.5 w-2.5 rounded-full bg-white/72" />
      <span className="assistant-orb-spark assistant-orb-spark-delayed absolute right-[1.9rem] top-[3rem] h-1.5 w-1.5 rounded-full bg-[var(--brand-mint)]" />
    </div>
  );
}

function AssistantPromptCard({
  item,
  className = "",
}: {
  item: (typeof assistantPrompts)[number];
  className?: string;
}) {
  const toneMap = {
    mint: "bg-[var(--brand-mint)] text-[var(--brand-green-dark)]",
    violet: "bg-[#efe6ff] text-[#7a42db]",
    orange: "bg-[#fff0e2] text-[#f26a00]",
    purple: "bg-[#efe7ff] text-[#7748d6]",
  } as const;

  return (
    <div
      className={`relative w-full max-w-[18rem] rounded-[1.4rem] border border-border bg-white px-4 py-4 shadow-[0_16px_36px_rgba(13,23,48,0.06)] ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-[rgba(13,23,48,0.06)]">
          <Image
            src={item.avatar}
            alt={`${item.name} avatar`}
            fill
            className="object-cover"
            sizes="44px"
          />
        </div>
        <p className="text-[15px] leading-6 text-[var(--brand-navy)]">
          “{item.quote}”
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${toneMap[item.tone]}`}
        >
          {item.name}
        </span>
      </div>
    </div>
  );
}

function PromoPhoneMock() {
  return (
    <div className="relative w-[18rem] sm:w-[20rem]">
          <div className="absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/12 blur-sm" />
      <div className="absolute left-1/2 top-1/2 h-[17rem] w-[17rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12" />

      <div className="relative mx-auto rounded-[2.4rem] border-[6px] border-[#101010] bg-white p-3 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
        <div className="mx-auto mb-3 h-6 w-28 rounded-full bg-[#111111]" />
        <div className="rounded-[2rem] bg-[#f7f7f5] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Profile</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                Chisom Joy
              </p>
            </div>
            <div className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-500 shadow-sm">
              Theme
            </div>
          </div>

          <div className="mt-4 rounded-[1.35rem] bg-[linear-gradient(135deg,#0b5f3f,#13a868)] p-4 text-white">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/62">
              STPay Reward Points
            </p>
            <p className="mt-3 text-2xl font-bold tracking-[-0.04em]">100</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              "My Accounts",
              "Expense Tracker",
              "Personalization",
              "Settings",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.1rem] bg-white p-3 shadow-[0_10px_24px_rgba(13,23,48,0.04)]"
              >
                <div className="h-8 w-8 rounded-xl bg-[var(--brand-mint)]" />
                <p className="mt-3 text-xs font-semibold text-slate-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<[label: string, href: string]>;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="mt-5 space-y-4">
        {links.map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="block text-sm text-white/64 transition hover:text-white"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/6">
      {children}
    </span>
  );
}

function TestimonialColumn({
  items,
  direction,
}: {
  items: typeof testimonials;
  direction: "up" | "down";
}) {
  const duplicated = [...items, ...items];

  return (
    <div className="testimonial-window h-[30rem] overflow-hidden">
      <div
        className={`flex flex-col gap-4 ${
          direction === "up"
            ? "animate-[testimonial-up_26s_linear_infinite]"
            : "animate-[testimonial-down_26s_linear_infinite]"
        }`}
      >
        {duplicated.map((item, index) => (
          <TestimonialCard key={`${item.name}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({
  item,
}: {
  item: (typeof testimonials)[number];
}) {
  return (
    <Card className="rounded-[1.5rem] border border-white/8 bg-white/6 py-0 text-white shadow-none backdrop-blur-sm">
      <CardContent className="px-4 py-4">
        <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/62">
          {item.badge}
        </div>
        <p className="text-[13px] leading-6 text-white/86">{item.quote}</p>
        <div className="mt-4 border-t border-white/8 pt-3">
          <p className="text-[13px] font-semibold text-white">{item.name}</p>
          <p className="mt-1 text-[11px] text-white/52">{item.role}</p>
        </div>
      </CardContent>
    </Card>
  );
}
