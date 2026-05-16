import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { mockUser } from "@/lib/mock-data";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <AppShell
        title="Profile & Settings"
        description="Manage your personal details, password, transaction PIN, and notification preferences."
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="stpay-panel rounded-[1.9rem] p-6">
            <p className="text-lg font-semibold text-slate-950">Profile details</p>
            <dl className="mt-5 grid gap-4 text-sm text-slate-600">
              <div>
                <dt className="font-semibold text-slate-950">Full name</dt>
                <dd className="mt-1">{mockUser.full_name}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-950">Email</dt>
                <dd className="mt-1">{mockUser.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-950">Phone number</dt>
                <dd className="mt-1">{mockUser.phone_number}</dd>
              </div>
            </dl>
          </div>

          <div className="stpay-panel rounded-[1.9rem] p-6">
            <p className="text-lg font-semibold text-slate-950">Security actions</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              This section is ready for live password and transaction PIN update forms tied to the backend.
            </p>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
