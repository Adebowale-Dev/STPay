"use client";
import { FormEvent, useState } from "react";
import { BankingDropdown, BankingForm, bankingFieldClass, bankingLabelClass, OperationResult, SubmitButton } from "@/components/users/BankingForm";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { AppShell } from "@/components/users/AppShell";
import { fundWallet, getApiErrorMessage } from "@/lib/api";

export default function FundWalletPage() {
  const [amount, setAmount] = useState(""); const [method, setMethod] = useState("card"); const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null); const [result, setResult] = useState<{ reference: string; balance: number } | null>(null);
  async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); setError(null); try { const response = await fundWallet({ amount: Number(amount), payment_method: method }); setResult(response.data); setAmount(""); } catch (err) { setError(getApiErrorMessage(err)); } finally { setLoading(false); } }
  return <ProtectedRoute><AppShell title="Fund wallet" description="Add money to your STPay wallet using a simulated payment channel."><BankingForm title="Wallet funding" note="Choose a payment method and enter the amount you want to add." side={result ? <OperationResult {...result} message="Wallet funded successfully" /> : undefined}><form onSubmit={submit} className="grid gap-4"><label className={bankingLabelClass}>Amount<input className={bankingFieldClass} type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" required /></label><BankingDropdown label="Payment method" value={method} onChange={setMethod} options={[{ label: "Card", value: "card" }, { label: "Bank transfer", value: "bank_transfer" }, { label: "USSD", value: "ussd" }]} />{error ? <p className="text-[10px] text-rose-300">{error}</p> : null}<SubmitButton loading={loading} label="Fund wallet" /></form></BankingForm></AppShell></ProtectedRoute>;
}
