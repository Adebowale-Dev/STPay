"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import {
  BankingDropdown,
  BankingForm,
  bankingFieldClass,
  bankingLabelClass,
  OperationResult,
  SubmitButton,
} from "@/components/users/BankingForm";
import { AppShell } from "@/components/users/AppShell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BillCategory,
  BillProvider,
  billCategories,
  billProviders,
  providerLogoUrl,
} from "@/lib/bill-providers";
import { getApiErrorMessage, payBill } from "@/lib/api";

const customerLabels: Record<BillCategory, string> = {
  Electricity: "Meter number",
  "Cable TV": "Smartcard or IUC number",
  Internet: "Customer or account ID",
  "School Fees": "Student, registration, or examination number",
  "Water Bill": "Customer or property account number",
};

export default function BillsPage() {
  const [form, setForm] = useState({
    category: "Electricity" as BillCategory,
    provider: "",
    customer_number: "",
    amount: "",
    transaction_pin: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ reference: string; balance: number } | null>(null);

  const providers = billProviders[form.category];
  const selectedProvider = useMemo(
    () => providers.find((provider) => provider.name === form.provider),
    [form.provider, providers],
  );

  function setField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function changeCategory(value: string) {
    setForm((current) => ({
      ...current,
      category: value as BillCategory,
      provider: "",
      customer_number: "",
    }));
    setError(null);
    setResult(null);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.provider) {
      setError("Select a bill provider before continuing.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await payBill({ ...form, amount: Number(form.amount) });
      setResult(response.data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <AppShell title="Pay bills" description="Settle everyday services securely from your STPay wallet.">
        <BankingForm
          title="Bill payment"
          note="Choose a category and verified provider, then enter the customer reference exactly as shown on the service account."
          side={result ? <OperationResult {...result} message="Bill payment successful" /> : undefined}
        >
          <form onSubmit={submit} className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <BankingDropdown
                label="Category"
                value={form.category}
                onChange={changeCategory}
                options={billCategories.map((category) => ({ label: category, value: category }))}
              />
              <ProviderDropdown
                providers={providers}
                selected={selectedProvider}
                onSelect={(provider) => setField("provider", provider.name)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={bankingLabelClass}>
                {customerLabels[form.category]}
                <input
                  className={bankingFieldClass}
                  value={form.customer_number}
                  onChange={(event) => setField("customer_number", event.target.value)}
                  required
                />
              </label>
              <label className={bankingLabelClass}>
                Amount
                <input
                  className={bankingFieldClass}
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(event) => setField("amount", event.target.value)}
                  required
                />
              </label>
              <label className={bankingLabelClass}>
                Transaction PIN
                <input
                  className={bankingFieldClass}
                  type="password"
                  maxLength={4}
                  inputMode="numeric"
                  value={form.transaction_pin}
                  onChange={(event) => setField("transaction_pin", event.target.value.replace(/\D/g, "").slice(0, 4))}
                  required
                />
              </label>
            </div>

            {error ? <p className="text-[10px] text-rose-300">{error}</p> : null}
            <SubmitButton loading={loading} label="Pay bill" />
          </form>
        </BankingForm>
      </AppShell>
    </ProtectedRoute>
  );
}

function ProviderDropdown({
  providers,
  selected,
  onSelect,
}: {
  providers: BillProvider[];
  selected?: BillProvider;
  onSelect: (provider: BillProvider) => void;
}) {
  return (
    <div className={bankingLabelClass}>
      <span>Provider</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={`${bankingFieldClass} flex items-center justify-between text-left`}>
            <span className="flex min-w-0 items-center gap-2">
              {selected ? <ProviderLogo provider={selected} /> : null}
              <span className="truncate">{selected?.name ?? "Select a provider"}</span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/30" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-80 border border-white/[0.08] bg-[#101512] p-1.5 text-white shadow-[0_18px_50px_rgba(0,0,0,.45)]">
          <DropdownMenuLabel className="px-2 py-1.5 text-[8px] uppercase tracking-[0.18em] text-white/25">
            Select provider
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/[0.07]" />
          {providers.map((provider) => (
            <DropdownMenuItem
              key={provider.name}
              onSelect={() => onSelect(provider)}
              className="cursor-pointer gap-2 px-2.5 py-2 text-[10px] text-white/55 focus:bg-emerald-400/10 focus:text-emerald-200"
            >
              <ProviderLogo provider={provider} />
              <span className="min-w-0 flex-1 truncate">{provider.name}</span>
              {selected?.name === provider.name ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ProviderLogo({ provider }: { provider: BillProvider }) {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-white p-1">
      <Image
        unoptimized
        src={providerLogoUrl(provider)}
        alt={`${provider.name} logo`}
        width={28}
        height={28}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
