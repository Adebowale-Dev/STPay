import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function BillsPage() {
  return (
    <ProtectedRoute>
      <AppShell
        title="Pay Bills"
        description="Handle electricity, cable, internet, school fees, and other utility flows in one place."
      >
        <div className="stpay-panel rounded-[1.9rem] p-6">
          <p className="text-lg font-semibold text-slate-950">Bills workspace</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The route is now live and ready for the full form, confirmation modal, and receipt states.
          </p>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
