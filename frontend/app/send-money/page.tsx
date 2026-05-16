import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function SendMoneyPage() {
  return (
    <ProtectedRoute>
      <AppShell
        title="Send Money"
        description="Transfer to another STPay user with confirmation, PIN verification, and a receipt after success."
      >
        <Placeholder title="Transfer form coming next" />
      </AppShell>
    </ProtectedRoute>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="stpay-panel rounded-[1.9rem] p-6">
      <p className="text-lg font-semibold text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        This route now exists, so frontend navigation stops returning 404 while we complete the full money transfer UI.
      </p>
    </div>
  );
}
