"use client";

import { Download, Printer, X } from "lucide-react";

type ReceiptData = {
  reference: string;
  type: string;
  amount: number;
  sender: string;
  receiver: string;
  status: string;
  description: string;
  date: string;
};

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

export function ReceiptModal({
  open,
  onClose,
  receipt,
}: {
  open: boolean;
  onClose: () => void;
  receipt: ReceiptData | null;
}) {
  if (!open || !receipt) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-[0_32px_100px_rgba(15,23,42,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">STPay Receipt</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">{formatMoney(receipt.amount)}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 rounded-[1.5rem] bg-slate-50 p-5 text-sm text-slate-700 sm:grid-cols-2">
          <ReceiptRow label="Reference" value={receipt.reference} />
          <ReceiptRow label="Type" value={receipt.type} />
          <ReceiptRow label="Sender" value={receipt.sender} />
          <ReceiptRow label="Receiver" value={receipt.receiver} />
          <ReceiptRow label="Status" value={receipt.status} />
          <ReceiptRow label="Date" value={receipt.date} />
          <ReceiptRow label="Description" value={receipt.description} full />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            <Printer className="h-4 w-4" />
            Print receipt
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" />
            Download / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function ReceiptRow({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 break-words font-medium text-slate-900">{value}</p>
    </div>
  );
}
