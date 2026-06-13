"use client";

import { FormEvent, useState } from "react";

import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { AppShell } from "@/components/users/AppShell";
import {
  BankingDropdown,
  BankingForm,
  bankingFieldClass,
  bankingLabelClass,
  OperationResult,
  SubmitButton,
} from "@/components/users/BankingForm";
import { buyAirtime, getApiErrorMessage } from "@/lib/api";
import {
  detectNigerianNetwork,
  NigerianNetwork,
  normalizeNigerianPhoneNumber,
} from "@/lib/nigerian-network";

const networkOptions: { label: string; value: NigerianNetwork }[] = [
  { label: "MTN", value: "MTN" },
  { label: "Airtel", value: "Airtel" },
  { label: "Glo", value: "Glo" },
  { label: "9mobile", value: "9mobile" },
];

export default function AirtimePage() {
  const [form, setForm] = useState({
    network_provider: "MTN" as NigerianNetwork,
    phone_number: "",
    amount: "",
    transaction_pin: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ reference: string; balance: number } | null>(null);

  const set = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  function updatePhoneNumber(value: string) {
    const normalized = normalizeNigerianPhoneNumber(value);
    const detected = detectNigerianNetwork(normalized);
    setForm((current) => ({
      ...current,
      phone_number: normalized,
      network_provider: detected ?? current.network_provider,
    }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await buyAirtime({ ...form, amount: Number(form.amount) });
      setResult(response.data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <AppShell title="Buy airtime" description="Top up any supported Nigerian mobile number from your wallet.">
        <BankingForm
          title="Airtime purchase"
          note="Enter the phone number first and STPay will select its original mobile network automatically."
          side={result ? <OperationResult {...result} message="Airtime purchase successful" /> : undefined}
        >
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <label className={`${bankingLabelClass} sm:col-span-2`}>
              Phone number
              <input
                className={bankingFieldClass}
                inputMode="tel"
                value={form.phone_number}
                onChange={(event) => updatePhoneNumber(event.target.value)}
                placeholder="08012345678 or +2348012345678"
                minLength={11}
                required
              />
            </label>

            <BankingDropdown
              label="Network"
              value={form.network_provider}
              onChange={(value) => set("network_provider", value)}
              options={networkOptions}
            />
            <label className={bankingLabelClass}>
              Amount
              <input className={bankingFieldClass} type="number" min="1" value={form.amount} onChange={(event) => set("amount", event.target.value)} placeholder="Enter amount" required />
            </label>
            <label className={`${bankingLabelClass} sm:col-span-2`}>
              Transaction PIN
              <input className={bankingFieldClass} type="password" maxLength={4} inputMode="numeric" value={form.transaction_pin} onChange={(event) => set("transaction_pin", event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Enter your 4-digit PIN" required />
            </label>

            {error ? <p className="text-[10px] text-rose-300 sm:col-span-2">{error}</p> : null}
            <SubmitButton loading={loading} label="Buy airtime" />
          </form>
        </BankingForm>
      </AppShell>
    </ProtectedRoute>
  );
}
