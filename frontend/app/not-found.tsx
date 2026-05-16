import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="stpay-surface max-w-xl rounded-[2.4rem] p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
          404 Error
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          This STPay page could not be found
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          The page may have moved, or the route is not available yet. Return to the
          landing page or continue to the dashboard.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-[linear-gradient(135deg,_#0f9f69,_#0c7a51)] px-6 py-3 text-sm font-semibold text-white"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700"
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
