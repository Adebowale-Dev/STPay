import { BellDot } from "lucide-react";

import { Notification } from "@/types/notification";

export function NotificationCard({ notification }: { notification: Notification }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
          <BellDot className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-950">{notification.title}</p>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                notification.is_read
                  ? "bg-slate-100 text-slate-500"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {notification.is_read ? "Read" : "New"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-600">{notification.message}</p>
          <p className="mt-3 text-xs text-slate-500">
            {new Date(notification.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
