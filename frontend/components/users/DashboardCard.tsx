import { ReactNode } from "react";

type DashboardCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  helper?: string;
  accent?: string;
};

export function DashboardCard({
  label,
  value,
  icon,
  helper,
  accent = "from-emerald-500/15 to-sky-500/10",
}: DashboardCardProps) {
  return (
    <div className={`stpay-panel rounded-[1.75rem] bg-gradient-to-br ${accent} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {label}
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
          {helper ? <p className="mt-2 text-sm text-slate-600">{helper}</p> : null}
        </div>
        <div className="rounded-2xl bg-white/90 p-3 text-emerald-700 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
          {icon}
        </div>
      </div>
    </div>
  );
}
