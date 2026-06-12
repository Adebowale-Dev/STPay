"use client";

import { X } from "lucide-react";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

export function ConfirmTransferModal({
  open,
  onClose,
  onConfirm,
  payload,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  payload: {
    receiver: string;
    amount: number;
    description: string;
  } | null;
}) {
  if (!open || !payload) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-[0_32px_100px_rgba(15,23,42,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Confirm transfer
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
              {formatMoney(payload.amount)}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 p-2 text-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-5 text-sm text-slate-700">
          <p>
            <span className="font-semibold text-slate-950">Receiver:</span> {payload.receiver}
          </p>
          <p className="mt-3">
            <span className="font-semibold text-slate-950">Description:</span>{" "}
            {payload.description || "No description"}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-[linear-gradient(135deg,_#0f9f69,_#0c7a51)] px-5 py-3 text-sm font-semibold text-white"
          >
            Confirm transfer
          </button>
        </div>
      </div>
    </div>
  );
}
