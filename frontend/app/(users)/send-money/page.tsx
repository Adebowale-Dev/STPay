"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookmarkPlus,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  LoaderCircle,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { AppShell } from "@/components/users/AppShell";
import { bankingFieldClass, bankingLabelClass } from "@/components/users/BankingForm";
import { ReceiptData, ReceiptModal } from "@/components/users/ReceiptModal";
import {
  addBeneficiary,
  getApiErrorMessage,
  ResolvedAccount,
  resolveTransferAccount,
  transferMoney,
  TransferResult,
} from "@/lib/api";
import { formatDateTime, formatMoney } from "@/lib/format";

type FormState = {
  receiver_account_number: string;
  amount: string;
  description: string;
  transaction_pin: string;
};

type TransferState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "successful"; data: TransferResult }
  | { status: "failed"; message: string };

const emptyForm: FormState = {
  receiver_account_number: "",
  amount: "",
  description: "",
  transaction_pin: "",
};

export default function SendMoneyPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [account, setAccount] = useState<ResolvedAccount | null>(null);
  const [resolving, setResolving] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [beneficiaryState, setBeneficiaryState] = useState<"idle" | "saving" | "saved">("idle");
  const [beneficiaryMessage, setBeneficiaryMessage] = useState<string | null>(null);
  const [transfer, setTransfer] = useState<TransferState>({ status: "idle" });
  const [receiptOpen, setReceiptOpen] = useState(false);

  useEffect(() => {
    const accountNumber = form.receiver_account_number;
    if (accountNumber.length !== 10) return;

    let active = true;
    const timer = window.setTimeout(async () => {
      setResolving(true);
      try {
        const response = await resolveTransferAccount(accountNumber);
        if (active) setAccount(response.data);
      } catch (error) {
        if (active) setLookupError(getApiErrorMessage(error, "Unable to resolve this account."));
      } finally {
        if (active) setResolving(false);
      }
    }, 450);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [form.receiver_account_number]);

  const set = (key: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  function setAccountNumber(value: string) {
    setAccount(null);
    setLookupError(null);
    setResolving(false);
    setBeneficiaryState("idle");
    setBeneficiaryMessage(null);
    set("receiver_account_number", value.replace(/\D/g, "").slice(0, 10));
  }

  const canContinue = Boolean(account && Number(form.amount) > 0 && form.transaction_pin.length === 4);

  function requestConfirmation(event: FormEvent) {
    event.preventDefault();
    if (canContinue) setConfirming(true);
  }

  async function sendTransfer() {
    setConfirming(false);
    setTransfer({ status: "pending" });
    setBeneficiaryMessage(null);

    try {
      const response = await transferMoney({ ...form, amount: Number(form.amount) });
      setTransfer({ status: "successful", data: response.data });

    } catch (error) {
      setTransfer({
        status: "failed",
        message: getApiErrorMessage(error, "The transfer could not be completed."),
      });
    }
  }

  async function saveReceiverAsBeneficiary() {
    if (!account || beneficiaryState !== "idle") return;

    setBeneficiaryState("saving");
    setBeneficiaryMessage(null);
    try {
      await addBeneficiary({
        beneficiary_name: account.account_name,
        account_number: account.account_number,
        phone_number: null,
        bank_name: account.bank_name,
      });
      setBeneficiaryState("saved");
      setBeneficiaryMessage(`${account.account_name} is now in your beneficiaries.`);
    } catch (error) {
      const message = getApiErrorMessage(error, "The beneficiary could not be saved.");
      if (message.toLowerCase().includes("already saved")) {
        setBeneficiaryState("saved");
      } else {
        setBeneficiaryState("idle");
      }
      setBeneficiaryMessage(message);
    }
  }

  function reset() {
    setForm(emptyForm);
    setAccount(null);
    setBeneficiaryState("idle");
    setBeneficiaryMessage(null);
    setTransfer({ status: "idle" });
  }

  const receipt: ReceiptData | null =
    transfer.status === "successful"
      ? {
          reference: transfer.data.reference,
          type: "transfer",
          amount: transfer.data.amount,
          sender: transfer.data.sender_name,
          receiver: transfer.data.receiver_name,
          receiverAccount: transfer.data.receiver_account_number,
          bank: transfer.data.bank_name,
          status: transfer.data.status,
          description: transfer.data.description,
          date: formatDateTime(transfer.data.created_at),
        }
      : null;

  return (
    <ProtectedRoute>
      <AppShell title="Send money" description="Resolve an STPay account and complete a secure wallet transfer.">
        {transfer.status === "idle" ? (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
            <form onSubmit={requestConfirmation} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">Transfer details</p>
                  <p className="mt-2 text-[10px] leading-5 text-white/30">The receiving account is verified before you can continue.</p>
                </div>
                <span className="rounded-lg bg-emerald-400/10 p-2 text-emerald-300"><ShieldCheck className="h-4 w-4" /></span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className={`${bankingLabelClass} sm:col-span-2`}>
                  Receiver account number
                  <div className="relative">
                    <input className={`${bankingFieldClass} pr-11`} inputMode="numeric" value={form.receiver_account_number} onChange={(event) => setAccountNumber(event.target.value)} placeholder="Enter 10-digit account number" required />
                    <span className="absolute inset-y-0 right-3 grid place-items-center text-white/25">
                      {resolving ? <LoaderCircle className="h-4 w-4 animate-spin text-emerald-300" /> : account ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Building2 className="h-4 w-4" />}
                    </span>
                  </div>
                  {lookupError ? <span className="text-[9px] text-rose-300">{lookupError}</span> : null}
                </label>

                {account ? (
                  <div className="grid gap-3 sm:col-span-2">
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-300/15 bg-emerald-400/[0.06] p-4">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300"><UserRound className="h-4 w-4" /></span>
                      <div><p className="text-[11px] font-semibold text-white">{account.account_name}</p><p className="mt-1 text-[9px] text-white/35">{account.bank_name} · {account.account_number}</p></div>
                      <span className="ml-auto rounded-full bg-emerald-400/10 px-2.5 py-1 text-[8px] font-semibold text-emerald-300">Verified</span>
                    </div>

                    <button
                      type="button"
                      onClick={saveReceiverAsBeneficiary}
                      disabled={beneficiaryState !== "idle"}
                      className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${beneficiaryState === "saved" ? "border-emerald-300/20 bg-emerald-400/[0.06]" : "border-white/[0.07] bg-white/[0.015] hover:bg-white/[0.03]"} disabled:cursor-default`}
                    >
                      <span className={`grid h-8 w-8 place-items-center rounded-lg ${beneficiaryState === "saved" ? "bg-emerald-400 text-[#07100b]" : "bg-white/[0.05] text-white/35"}`}>
                        {beneficiaryState === "saving" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : beneficiaryState === "saved" ? <Check className="h-3.5 w-3.5" /> : <BookmarkPlus className="h-3.5 w-3.5" />}
                      </span>
                      <span>
                        <span className="block text-[10px] font-semibold text-white/70">{beneficiaryState === "saving" ? "Saving beneficiary..." : beneficiaryState === "saved" ? "Saved as beneficiary" : "Save as beneficiary"}</span>
                        <span className="mt-1 block text-[8px] text-white/30">{beneficiaryState === "saved" ? "This receiver is now available on your Beneficiaries page." : "Add this verified receiver to your beneficiaries now."}</span>
                      </span>
                    </button>
                    {beneficiaryMessage ? <p className={`px-1 text-[8px] ${beneficiaryState === "saved" ? "text-emerald-300/75" : "text-rose-300"}`}>{beneficiaryMessage}</p> : null}
                  </div>
                ) : null}

                <label className={bankingLabelClass}>Amount<input className={bankingFieldClass} type="number" min="1" step="0.01" value={form.amount} onChange={(event) => set("amount", event.target.value)} placeholder="₦0.00" required /></label>
                <label className={bankingLabelClass}>Transaction PIN<input className={bankingFieldClass} type="password" inputMode="numeric" maxLength={4} value={form.transaction_pin} onChange={(event) => set("transaction_pin", event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Enter your 4-digit PIN" autoComplete="off" required /></label>
                <label className={`${bankingLabelClass} sm:col-span-2`}>Description<input className={bankingFieldClass} value={form.description} onChange={(event) => set("description", event.target.value)} placeholder="What is this transfer for?" /></label>
              </div>

              <button type="submit" disabled={!canContinue} className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 text-[11px] font-semibold text-[#07100b] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-35">Review transfer <ArrowRight className="h-3.5 w-3.5" /></button>
            </form>

            <aside className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <ReceiptText className="h-4 w-4 text-emerald-300" /><p className="mt-5 text-xs font-semibold text-white">Before you send</p>
              <div className="mt-4 space-y-4">{["Confirm the account name after lookup.", "Check the amount before entering your PIN.", "A receipt is available immediately after transfer."].map((item, index) => <div key={item} className="flex gap-3"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/[0.05] text-[8px] text-white/35">{index + 1}</span><p className="text-[9px] leading-5 text-white/35">{item}</p></div>)}</div>
            </aside>
          </div>
        ) : (
          <TransferStatus state={transfer} beneficiaryMessage={beneficiaryMessage} onRetry={() => setTransfer({ status: "idle" })} onNew={reset} onReceipt={() => setReceiptOpen(true)} />
        )}
      </AppShell>

      {confirming && account ? <Confirmation account={account} amount={Number(form.amount)} description={form.description} beneficiarySaved={beneficiaryState === "saved"} onCancel={() => setConfirming(false)} onConfirm={sendTransfer} /> : null}
      <ReceiptModal open={receiptOpen} onClose={() => setReceiptOpen(false)} receipt={receipt} />
    </ProtectedRoute>
  );
}

function Confirmation({ account, amount, description, beneficiarySaved, onCancel, onConfirm }: { account: ResolvedAccount; amount: number; description: string; beneficiarySaved: boolean; onCancel: () => void; onConfirm: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 backdrop-blur-md"><section className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#101411] p-5 shadow-2xl"><p className="text-[9px] uppercase tracking-[0.2em] text-emerald-300">Confirm transfer</p><h2 className="mt-3 text-2xl font-semibold">{formatMoney(amount)}</h2><div className="mt-5 space-y-3 rounded-xl bg-white/[0.025] p-4"><Line label="Recipient" value={account.account_name} /><Line label="Bank" value={account.bank_name} /><Line label="Account" value={account.account_number} /><Line label="Description" value={description || "STPay transfer"} />{beneficiarySaved ? <Line label="Beneficiary" value="Already saved" /> : null}</div><div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={onCancel} className="h-10 rounded-lg border border-white/[0.08] text-[10px] text-white/45">Go back</button><button type="button" onClick={onConfirm} className="h-10 rounded-lg bg-emerald-400 text-[10px] font-semibold text-[#07100b]">Confirm & send</button></div></section></div>;
}

function TransferStatus({ state, beneficiaryMessage, onRetry, onNew, onReceipt }: { state: Exclude<TransferState, { status: "idle" }>; beneficiaryMessage: string | null; onRetry: () => void; onNew: () => void; onReceipt: () => void }) {
  const pending = state.status === "pending";
  const successful = state.status === "successful";
  return <section className="mx-auto max-w-xl rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-center sm:p-10"><span className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${pending ? "bg-amber-300/10 text-amber-300" : successful ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300"}`}>{pending ? <Clock3 className="h-7 w-7 animate-pulse" /> : successful ? <Check className="h-7 w-7" /> : <XCircle className="h-7 w-7" />}</span><p className="mt-6 text-lg font-semibold">{pending ? "Transfer pending" : successful ? "Transfer successful" : "Transfer failed"}</p><p className="mx-auto mt-2 max-w-sm text-[10px] leading-5 text-white/35">{pending ? "Your transfer is being securely processed. Please keep this page open." : successful ? `${formatMoney(state.data.amount)} was sent to ${state.data.receiver_name}.` : state.message}</p>{successful ? <div className="mx-auto mt-6 max-w-sm rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left"><Line label="Reference" value={state.data.reference} /><div className="mt-3"><Line label="New available balance" value={formatMoney(state.data.balance)} /></div>{beneficiaryMessage ? <p className="mt-3 border-t border-white/[0.06] pt-3 text-[9px] text-emerald-300/75">{beneficiaryMessage}</p> : null}</div> : null}<div className="mt-7 flex flex-wrap justify-center gap-2">{state.status === "failed" ? <button type="button" onClick={onRetry} className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-400 px-4 text-[10px] font-semibold text-[#07100b]"><RefreshCw className="h-3.5 w-3.5" /> Try again</button> : null}{successful ? <><button type="button" onClick={onReceipt} className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-400 px-4 text-[10px] font-semibold text-[#07100b]"><FileText className="h-3.5 w-3.5" /> View receipt</button><button type="button" onClick={onNew} className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/[0.08] px-4 text-[10px] text-white/55"><ArrowLeft className="h-3.5 w-3.5" /> New transfer</button></> : null}</div></section>;
}

function Line({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-5"><span className="text-[9px] text-white/25">{label}</span><span className="text-right text-[10px] font-medium text-white/65">{value}</span></div>;
}
