import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { mockBeneficiaries } from "@/lib/mock-data";

export default function BeneficiariesPage() {
  return (
    <ProtectedRoute>
      <AppShell
        title="Beneficiaries"
        description="Keep frequent recipients close for faster transfers and easier confirmation."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {mockBeneficiaries.map((beneficiary) => (
            <div key={beneficiary.id} className="stpay-panel rounded-[1.7rem] p-5">
              <p className="text-lg font-semibold text-slate-950">{beneficiary.beneficiary_name}</p>
              <p className="mt-2 text-sm text-slate-600">{beneficiary.account_number}</p>
              <p className="mt-1 text-sm text-slate-500">{beneficiary.bank_name}</p>
            </div>
          ))}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
