"use client";

import { CheckCircle2, Copy, KeyRound, LoaderCircle, UserPlus, WalletCards, X } from "lucide-react";
import { FormEvent, useState } from "react";

import { AdminCreatedCustomer, createAdminCustomer, getApiErrorMessage } from "@/lib/api";
import { AdminUser } from "@/types/user";

const fieldClass = "h-11 w-full rounded-lg border border-white/[0.08] bg-[#101512] px-3 text-[11px] text-white outline-none placeholder:text-white/20 focus:border-emerald-400/40";
const emptyForm = { full_name: "", email: "", phone_number: "" };

export function AdminCreateCustomerDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (user: AdminUser) => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdminCreatedCustomer | null>(null);

  if (!open) return null;

  const set = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await createAdminCustomer(form);
      setResult(response.data);
      onCreated(response.data.user);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to create customer account."));
    } finally {
      setLoading(false);
    }
  }

  function close() {
    setForm(emptyForm);
    setResult(null);
    setError(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-black/80 px-4 py-8 backdrop-blur-md">
      <section className="w-full max-w-xl rounded-2xl border border-white/[0.09] bg-[#0f1310] shadow-[0_30px_100px_rgba(0,0,0,.6)]">
        <header className="flex items-start justify-between border-b border-white/[0.07] p-5">
          <div className="flex gap-3">
            <span className="rounded-xl bg-emerald-400/10 p-2.5 text-emerald-300"><UserPlus className="h-4 w-4" /></span>
            <div><h2 className="text-sm font-semibold text-white">{result ? "Customer account created" : "Create new customer"}</h2><p className="mt-1 text-[9px] text-white/30">{result ? "Provide these credentials securely. They are shown only once." : "Create an active STPay wallet for a new customer."}</p></div>
          </div>
          <button type="button" onClick={close} className="text-white/30 hover:text-white"><X className="h-4 w-4" /></button>
        </header>

        {result ? <CredentialHandoff result={result} onDone={close} /> : (
          <form onSubmit={submit} className="p-5">
            <div className="grid gap-4">
              <Field label="Full name"><input className={fieldClass} value={form.full_name} onChange={(event) => set("full_name", event.target.value)} placeholder="Customer's legal name" required /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email address"><input className={fieldClass} type="email" value={form.email} onChange={(event) => set("email", event.target.value)} placeholder="customer@email.com" required /></Field>
                <Field label="Phone number"><input className={fieldClass} inputMode="tel" value={form.phone_number} onChange={(event) => set("phone_number", event.target.value)} placeholder="08012345678" required /></Field>
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-emerald-300/10 bg-emerald-400/[0.04] p-4">
              <p className="text-[10px] font-semibold text-emerald-300">Generated securely by STPay</p>
              <p className="mt-2 text-[9px] leading-5 text-white/30">The customer&apos;s phone number becomes their 10-digit wallet account number without the leading zero. A temporary login password and four-digit transaction PIN will also be generated automatically.</p>
            </div>
            {error ? <p className="mt-4 text-[10px] text-rose-300">{error}</p> : null}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={close} className="h-10 rounded-lg border border-white/[0.08] px-4 text-[10px] text-white/45">Cancel</button>
              <button type="submit" disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-400 px-4 text-[10px] font-semibold text-[#07100b] disabled:opacity-50">{loading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}{loading ? "Creating account..." : "Create customer"}</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

function CredentialHandoff({ result, onDone }: { result: AdminCreatedCustomer; onDone: () => void }) {
  const rows = [
    { label: "Account number", value: result.user.wallet_account_number ?? "", icon: WalletCards },
    { label: "Temporary password", value: result.temporary_password, icon: KeyRound },
    { label: "Transaction PIN", value: result.transaction_pin, icon: KeyRound },
  ];
  return <div className="p-5"><div className="flex items-center gap-3 rounded-xl border border-emerald-300/15 bg-emerald-400/[0.06] p-4"><CheckCircle2 className="h-5 w-5 text-emerald-300" /><div><p className="text-[11px] font-semibold text-white">{result.user.full_name}</p><p className="mt-1 text-[9px] text-white/35">{result.user.email} · {result.user.phone_number}</p><p className={`mt-2 text-[8px] ${result.email_sent ? "text-emerald-300/75" : "text-amber-200/70"}`}>{result.email_sent ? "Brevo onboarding email sent successfully." : "Brevo could not send the email. Hand over the credentials securely."}</p></div></div><div className="mt-4 space-y-2">{rows.map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"><Icon className="h-4 w-4 text-emerald-300" /><div className="min-w-0 flex-1"><p className="text-[8px] uppercase tracking-[0.16em] text-white/25">{label}</p><p className="mt-1 break-all text-[11px] font-semibold text-white/75">{value}</p></div><button type="button" onClick={() => navigator.clipboard.writeText(value)} className="rounded-lg border border-white/[0.07] p-2 text-white/35 hover:text-white" aria-label={`Copy ${label}`}><Copy className="h-3.5 w-3.5" /></button></div>)}</div><p className="mt-4 text-[8px] leading-4 text-amber-200/60">For security, close this panel only after the customer has securely received their temporary credentials.</p><button type="button" onClick={onDone} className="mt-5 h-10 w-full rounded-lg bg-emerald-400 text-[10px] font-semibold text-[#07100b]">Credentials handed over</button></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-[9px] font-medium text-white/40">{label}{children}</label>;
}
