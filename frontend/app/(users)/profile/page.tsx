"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  BadgeCheck,
  Fingerprint,
  LockKeyhole,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { bankingFieldClass, bankingLabelClass } from "@/components/users/BankingForm";
import { AppShell } from "@/components/users/AppShell";
import {
  changePassword,
  changeTransactionPin,
  fetchCurrentUser,
  getApiErrorMessage,
  updateProfile,
  upgradeAccount,
} from "@/lib/api";
import { mockUser } from "@/lib/mock-data";
import { User } from "@/types/user";

const tierDetails = {
  1: { balance: "NGN 50,000", transfer: "NGN 100,000", next: "Add your NIN to unlock Tier 2 limits." },
  2: { balance: "NGN 1,000,000", transfer: "NGN 500,000", next: "Add your BVN to unlock unlimited limits." },
  3: { balance: "Unlimited", transfer: "Unlimited", next: "Your account has full transaction access." },
};

export default function ProfilePage() {
  const [user, setUser] = useState<User>(mockUser);
  const [profile, setProfile] = useState({ full_name: mockUser.full_name, phone_number: mockUser.phone_number });
  const [identity, setIdentity] = useState({ nin: "", bvn: "" });
  const [password, setPassword] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [pin, setPin] = useState({ current_pin: "", new_pin: "", confirm_pin: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [updatingPin, setUpdatingPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinMessage, setPinMessage] = useState<string | null>(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser()
      .then((response) => {
        setUser(response.data);
        setProfile({ full_name: response.data.full_name, phone_number: response.data.phone_number });
      })
      .catch((requestError) => setError(getApiErrorMessage(requestError)));
  }, []);

  async function run(action: () => Promise<unknown>, success: string) {
    setError(null);
    setMessage(null);
    try {
      await action();
      setMessage(success);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    await run(async () => {
      const response = await updateProfile(profile);
      setUser(response.data);
    }, "Profile updated successfully.");
  }

  async function submitUpgrade(event: FormEvent) {
    event.preventDefault();
    const requiredIdentity = user.account_tier === 1 ? identity.nin : identity.bvn;
    const identityLabel = user.account_tier === 1 ? "NIN" : "BVN";
    if (requiredIdentity.length !== 11) {
      setMessage(null);
      setError(`${identityLabel} must be exactly 11 digits before upgrading your account.`);
      return;
    }

    setUpgrading(true);
    await run(async () => {
      const response = await upgradeAccount({
        ...(identity.nin ? { nin: identity.nin } : {}),
        ...(identity.bvn ? { bvn: identity.bvn } : {}),
      });
      setUser(response.data);
      setIdentity({ nin: "", bvn: "" });
    }, "Account tier upgraded successfully.");
    setUpgrading(false);
  }

  async function submitPinChange(event: FormEvent) {
    event.preventDefault();
    setPinError(null);
    setPinMessage(null);

    if (Object.values(pin).some((value) => value.length !== 4)) {
      setPinError("Enter all three 4-digit transaction PIN values.");
      return;
    }
    if (pin.new_pin !== pin.confirm_pin) {
      setPinError("New PIN and confirmation PIN do not match.");
      return;
    }
    if (pin.current_pin === pin.new_pin) {
      setPinError("Your new transaction PIN must be different from your current PIN.");
      return;
    }

    setUpdatingPin(true);
    try {
      const response = await changeTransactionPin(pin);
      setPinMessage(response.message);
      setPin({ current_pin: "", new_pin: "", confirm_pin: "" });
    } catch (requestError) {
      setPinError(getApiErrorMessage(requestError, "Unable to change transaction PIN."));
    } finally {
      setUpdatingPin(false);
    }
  }

  async function submitPasswordChange(event: FormEvent) {
    event.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (!password.current_password) {
      setPasswordError("Enter your current password.");
      return;
    }
    if (password.new_password.length < 8 || password.confirm_password.length < 8) {
      setPasswordError("Your new password and confirmation must contain at least 8 characters.");
      return;
    }
    if (password.new_password !== password.confirm_password) {
      setPasswordError("New password and confirmation password do not match.");
      return;
    }
    if (password.current_password === password.new_password) {
      setPasswordError("Your new password must be different from your current password.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const response = await changePassword(password);
      setPasswordMessage(response.message);
      setPassword({ current_password: "", new_password: "", confirm_password: "" });
    } catch (requestError) {
      setPasswordError(getApiErrorMessage(requestError, "Unable to change password."));
    } finally {
      setUpdatingPassword(false);
    }
  }

  const details = tierDetails[user.account_tier];

  return (
    <ProtectedRoute>
      <AppShell title="Profile & security" description="Manage your identity, account limits, and security settings.">
        {message ? <Notice tone="success">{message}</Notice> : null}
        {error ? <Notice tone="error">{error}</Notice> : null}

        <section className="mb-5 rounded-2xl border border-emerald-300/15 bg-emerald-400/[0.05] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-300/70">Account level</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Tier {user.account_tier}</h2>
              <p className="mt-2 text-[10px] text-white/35">{details.next}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Limit label="Maximum balance" value={details.balance} />
              <Limit label="Transfer limit" value={details.transfer} />
            </div>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-2">
          <FormCard icon={UserRound} title="Personal details">
            <form onSubmit={saveProfile} className="grid gap-4">
              <Field label="Full name" value={profile.full_name} onChange={(value) => setProfile((current) => ({ ...current, full_name: value }))} />
              <Field label="Email" value={user.email} disabled />
              <Field label="Phone number" value={profile.phone_number} onChange={(value) => setProfile((current) => ({ ...current, phone_number: value }))} />
              <Action label="Save profile" icon={Save} />
            </form>
          </FormCard>

          <FormCard icon={Fingerprint} title="Identity & bank upgrade">
            <form onSubmit={submitUpgrade} className="grid gap-4">
              <IdentityStatus label="NIN" verified={user.nin_verified} last4={user.nin_last4} />
              {!user.nin_verified ? (
                <Field label="National Identification Number (NIN)" value={identity.nin} inputMode="numeric" maxLength={11} onChange={(value) => setIdentity((current) => ({ ...current, nin: value.replace(/\D/g, "").slice(0, 11) }))} />
              ) : null}
              <IdentityStatus label="BVN" verified={user.bvn_verified} last4={user.bvn_last4} />
              {user.nin_verified && !user.bvn_verified ? (
                <Field label="Bank Verification Number (BVN)" value={identity.bvn} inputMode="numeric" maxLength={11} onChange={(value) => setIdentity((current) => ({ ...current, bvn: value.replace(/\D/g, "").slice(0, 11) }))} />
              ) : null}
              {user.account_tier < 3 ? <Action label={upgrading ? "Verifying securely..." : `Upgrade to Tier ${user.account_tier + 1}`} icon={BadgeCheck} disabled={upgrading} /> : null}
              <p className="text-[9px] leading-5 text-white/25">Your full NIN and BVN are never returned by the API. STPay stores protected hashes and only displays the final four digits.</p>
            </form>
          </FormCard>

          <FormCard icon={LockKeyhole} title="Change password">
            <form onSubmit={submitPasswordChange} className="grid gap-4">
              {(["current_password", "new_password", "confirm_password"] as const).map((key) => (
                <Field key={key} label={key.replaceAll("_", " ")} type="password" value={password[key]} onChange={(value) => setPassword((current) => ({ ...current, [key]: value }))} />
              ))}
              {passwordError ? <Notice tone="error">{passwordError}</Notice> : null}
              {passwordMessage ? <Notice tone="success">{passwordMessage}</Notice> : null}
              <Action label={updatingPassword ? "Updating securely..." : "Update password"} icon={ShieldCheck} disabled={updatingPassword} />
            </form>
          </FormCard>

          <FormCard icon={ShieldCheck} title="Change transaction PIN">
            <form onSubmit={submitPinChange} className="grid gap-4">
              {(["current_pin", "new_pin", "confirm_pin"] as const).map((key) => (
                <Field key={key} label={key.replaceAll("_", " ")} type="password" inputMode="numeric" maxLength={4} value={pin[key]} onChange={(value) => setPin((current) => ({ ...current, [key]: value.replace(/\D/g, "").slice(0, 4) }))} />
              ))}
              {pinError ? <Notice tone="error">{pinError}</Notice> : null}
              {pinMessage ? <Notice tone="success">{pinMessage}</Notice> : null}
              <Action label={updatingPin ? "Updating securely..." : "Update PIN"} icon={ShieldCheck} disabled={updatingPin} />
            </form>
          </FormCard>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}

function FormCard({ icon: Icon, title, children }: { icon: typeof UserRound; title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"><Icon className="h-4 w-4 text-emerald-300" /><p className="mt-4 text-xs font-semibold">{title}</p><div className="mt-5">{children}</div></section>;
}

function Field({ label, value, onChange, disabled, type = "text", inputMode, maxLength }: { label: string; value: string; onChange?: (value: string) => void; disabled?: boolean; type?: string; inputMode?: "numeric"; maxLength?: number }) {
  return <label className={bankingLabelClass}>{label}<input disabled={disabled} type={type} inputMode={inputMode} maxLength={maxLength} className={`${bankingFieldClass} ${disabled ? "opacity-45" : ""}`} value={value} onChange={(event) => onChange?.(event.target.value)} /></label>;
}

function Action({ label, icon: Icon, disabled }: { label: string; icon: typeof Save; disabled?: boolean }) {
  return <button disabled={disabled} type="submit" className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-400 text-[10px] font-semibold text-[#07100b] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"><Icon className="h-3.5 w-3.5" />{label}</button>;
}

function Limit({ label, value }: { label: string; value: string }) {
  return <div className="min-w-32 rounded-xl border border-white/[0.06] bg-black/10 px-4 py-3"><p className="text-[8px] text-white/30">{label}</p><p className="mt-1 text-[10px] font-semibold text-emerald-300">{value}</p></div>;
}

function IdentityStatus({ label, verified, last4 }: { label: string; verified: boolean; last4?: string | null }) {
  return <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/10 px-4 py-3"><span className="text-[10px] font-medium text-white/60">{label}</span><span className={`text-[9px] ${verified ? "text-emerald-300" : "text-amber-300"}`}>{verified ? `Verified **** ${last4}` : "Not provided"}</span></div>;
}

function Notice({ tone, children }: { tone: "success" | "error"; children: React.ReactNode }) {
  return <p className={`mb-4 rounded-xl border px-4 py-3 text-[10px] ${tone === "success" ? "border-emerald-300/15 bg-emerald-400/[0.06] text-emerald-300" : "border-rose-300/15 bg-rose-400/[0.06] text-rose-300"}`}>{children}</p>;
}
