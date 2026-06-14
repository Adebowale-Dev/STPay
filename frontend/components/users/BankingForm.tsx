import { CheckCircle2, ChevronDown, Wallet } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatMoney } from "@/lib/format";

export const bankingFieldClass = "h-11 w-full rounded-lg border border-white/[0.08] bg-[#101512] px-3 text-xs text-white caret-emerald-300 outline-none transition [color-scheme:dark] placeholder:text-white/20 focus:border-emerald-400/45 focus:bg-[#131a16] disabled:cursor-not-allowed disabled:opacity-50";
export const bankingLabelClass = "grid gap-2 text-[10px] font-medium text-white/45";

export type BankingDropdownOption = {
  label: string;
  value: string;
  logo?: string;
};

export function BankingDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: BankingDropdownOption[];
  onChange: (value: string) => void;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <div className={bankingLabelClass}>
      <span>{label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`${bankingFieldClass} flex items-center justify-between text-left`}
          >
            <span className="flex min-w-0 items-center gap-2">
              {selected?.logo ? <DropdownOptionLogo src={selected.logo} label={selected.label} /> : null}
              <span className="truncate">{selected?.label ?? "Select an option"}</span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/30" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="border border-white/[0.08] bg-[#101512] p-1.5 text-white shadow-[0_18px_50px_rgba(0,0,0,.45)]"
        >
          <DropdownMenuLabel className="px-2 py-1.5 text-[8px] uppercase tracking-[0.18em] text-white/25">
            {label}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
            {options.map((option, index) => (
              <DropdownMenuRadioItem
                key={`${option.value}-${option.label}-${index}`}
                value={option.value}
                className="cursor-pointer px-2.5 py-2 text-[10px] text-white/55 focus:bg-emerald-400/10 focus:text-emerald-200 data-[state=checked]:text-emerald-300"
              >
                <span className="flex min-w-0 items-center gap-2">
                  {option.logo ? <DropdownOptionLogo src={option.logo} label={option.label} /> : null}
                  <span className="truncate">{option.label}</span>
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function DropdownOptionLogo({ src, label }: { src: string; label: string }) {
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-md bg-white p-1">
      <Image
        unoptimized
        src={src}
        alt={`${label} logo`}
        width={24}
        height={24}
        className="h-full w-full object-contain"
      />
    </span>
  );
}

export function BankingForm({ title, note, children, side }: { title: string; note: string; children: ReactNode; side?: ReactNode }) {
  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"><section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6"><p className="text-sm font-semibold text-white">{title}</p><p className="mt-2 max-w-xl text-[10px] leading-5 text-white/30">{note}</p><div className="mt-6">{children}</div></section><aside className="space-y-4">{side ?? <SecurityNote />}</aside></div>;
}

export function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return <button type="submit" disabled={loading} className="mt-2 h-11 rounded-lg bg-emerald-400 px-5 text-[11px] font-semibold text-[#07100b] transition hover:bg-emerald-300 disabled:opacity-50">{loading ? "Processing securely..." : label}</button>;
}

export function OperationResult({ reference, balance, message }: { reference: string; balance: number; message: string }) {
  return <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/[0.06] p-5"><CheckCircle2 className="h-5 w-5 text-emerald-300" /><p className="mt-4 text-xs font-semibold text-white">{message}</p><p className="mt-2 break-all text-[9px] text-white/35">Reference: {reference}</p><div className="mt-5 border-t border-white/[0.07] pt-4"><p className="text-[9px] text-white/30">Updated balance</p><p className="mt-1 text-lg font-semibold text-emerald-300">{formatMoney(balance)}</p></div></div>;
}

export function SecurityNote() {
  return <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"><Wallet className="h-4 w-4 text-emerald-300" /><p className="mt-5 text-xs font-semibold text-white">Secure wallet operation</p><p className="mt-2 text-[10px] leading-5 text-white/30">Every completed operation is recorded in your transaction history and may trigger an email alert.</p></div>;
}
