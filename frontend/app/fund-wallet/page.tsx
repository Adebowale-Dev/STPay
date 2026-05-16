import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function FundWalletPage() {
  return (
    <ProtectedRoute>
      <AppShell
        title="Fund Wallet"
        description="Simulate wallet funding using card, bank transfer, or USSD and get a transaction receipt after success."
      >
        <PlaceholderForm
          title="Wallet funding"
          fields={["Amount", "Payment method"]}
          note="The full interactive funding flow can now be implemented against POST /wallet/fund."
        />
      </AppShell>
    </ProtectedRoute>
  );
}

function PlaceholderForm({
  title,
  fields,
  note,
}: {
  title: string;
  fields: string[];
  note: string;
}) {
  return (
    <div className="stpay-panel rounded-[1.9rem] p-6">
      <p className="text-lg font-semibold text-slate-950">{title}</p>
      <div className="mt-5 grid gap-4">
        {fields.map((field) => (
          <div key={field} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            {field}
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm text-slate-600">{note}</p>
    </div>
  );
}
