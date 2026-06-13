"use client";

import { Download, Printer, X } from "lucide-react";

import { formatMoney, startCase } from "@/lib/format";

export type ReceiptData = {
  reference: string;
  type: string;
  amount: number;
  sender: string;
  receiver: string;
  receiverAccount?: string;
  bank?: string;
  status: string;
  description: string;
  date: string;
};

export function ReceiptModal({
  open,
  onClose,
  receipt,
}: {
  open: boolean;
  onClose: () => void;
  receipt: ReceiptData | null;
}) {
  if (!open || !receipt) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/75 px-4 py-8 backdrop-blur-md">
      <section className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101411] shadow-[0_28px_100px_rgba(0,0,0,.55)]">
        <header className="flex items-start justify-between border-b border-white/[0.07] bg-[linear-gradient(135deg,#124b35,#101713)] p-5">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-emerald-200/55">STPay transfer receipt</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{formatMoney(receipt.amount)}</h3>
            <p className="mt-2 text-[9px] text-emerald-100/40">{receipt.reference}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg bg-white/[0.08] p-2 text-white/45 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="grid gap-x-5 gap-y-4 p-5 sm:grid-cols-2">
          <ReceiptRow label="Status" value={startCase(receipt.status)} accent />
          <ReceiptRow label="Transaction type" value={startCase(receipt.type)} />
          <ReceiptRow label="From" value={receipt.sender} />
          <ReceiptRow label="To" value={receipt.receiver} />
          {receipt.receiverAccount ? <ReceiptRow label="Account number" value={receipt.receiverAccount} /> : null}
          {receipt.bank ? <ReceiptRow label="Receiving bank" value={receipt.bank} /> : null}
          <ReceiptRow label="Date" value={receipt.date} />
          <ReceiptRow label="Description" value={receipt.description || "STPay transfer"} />
        </div>

        <footer className="flex flex-wrap gap-2 border-t border-white/[0.07] p-5">
          <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/[0.08] px-4 text-[10px] font-semibold text-white/55 hover:bg-white/[0.04]">
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
          <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-400 px-4 text-[10px] font-semibold text-[#07100b] hover:bg-emerald-300">
            <Download className="h-3.5 w-3.5" /> Save receipt
          </button>
        </footer>
      </section>
    </div>
  );
}

function ReceiptRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="min-w-0 border-b border-white/[0.05] pb-3">
      <p className="text-[8px] uppercase tracking-[0.18em] text-white/25">{label}</p>
      <p className={`mt-2 break-words text-[11px] font-medium ${accent ? "text-emerald-300" : "text-white/70"}`}>{value}</p>
    </div>
  );
}
