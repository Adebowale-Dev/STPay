"use client";

import { AlertTriangle, X } from "lucide-react";

export function AdminConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  loading,
  destructive = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  loading?: boolean;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.09] bg-[#111512] p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className={`rounded-xl p-2.5 ${destructive ? "bg-rose-400/10 text-rose-300" : "bg-emerald-400/10 text-emerald-300"}`}>
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            <p className="mt-2 text-xs leading-5 text-white/45">{message}</p>
          </div>
          <button type="button" onClick={onCancel} className="text-white/30 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-white/[0.08] px-4 py-2 text-[11px] text-white/55">
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-[11px] font-semibold disabled:opacity-50 ${
              destructive ? "bg-rose-400 text-[#190708]" : "bg-emerald-400 text-[#07100b]"
            }`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
