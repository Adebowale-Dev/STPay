"use client";

import { Download, Search, ShieldCheck, UserRoundCheck, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUserDrawer } from "@/components/admin/AdminUserDrawer";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { fetchAdminUser, fetchAdminUsers, freezeAdminUser, unfreezeAdminUser } from "@/lib/api";
import { downloadCsv } from "@/lib/export";
import { mockAdminUsers } from "@/lib/mock-data";
import { Transaction } from "@/types/transaction";
import { AdminUser } from "@/types/user";

const filters = ["all", "active", "frozen", "unverified", "admin"] as const;
const PAGE_SIZE = 8;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pendingStatusUser, setPendingStatusUser] = useState<AdminUser | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminUsers()
      .then((response) => setUsers(response.data))
      .catch((err) => setError(err instanceof Error ? `${err.message}. Showing local preview.` : "Unable to load customers."));
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch = !query || [user.full_name, user.email, user.phone_number, user.wallet_account_number, user.id]
        .some((value) => value?.toLowerCase().includes(query));
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && user.is_active && !user.is_frozen) ||
        (filter === "frozen" && user.is_frozen) ||
        (filter === "unverified" && !user.is_email_verified) ||
        (filter === "admin" && user.role === "admin");
      return matchesSearch && matchesFilter;
    });
  }, [filter, search, users]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const visibleUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function openUser(user: AdminUser) {
    setSelectedUser(user);
    setSelectedTransactions([]);
    setDetailLoading(true);
    try {
      const response = await fetchAdminUser(user.id);
      setSelectedUser(response.data.user);
      setSelectedTransactions(response.data.recent_transactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load customer details.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function applyStatusChange() {
    if (!pendingStatusUser) return;
    setActionLoadingId(pendingStatusUser.id);
    try {
      if (pendingStatusUser.is_frozen) await unfreezeAdminUser(pendingStatusUser.id);
      else await freezeAdminUser(pendingStatusUser.id);
      const updated = { ...pendingStatusUser, is_frozen: !pendingStatusUser.is_frozen };
      setUsers((current) => current.map((user) => user.id === updated.id ? updated : user));
      setSelectedUser((current) => current?.id === updated.id ? updated : current);
      setPendingStatusUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update customer access.");
    } finally {
      setActionLoadingId(null);
    }
  }

  function queueStatusChange(id: string) {
    const user = users.find((item) => item.id === id);
    if (user) setPendingStatusUser(user);
  }

  return (
    <ProtectedRoute requireAdmin>
      <AdminShell title="Customer operations" description="Review identities, balances, account status, and recent activity.">
        <div className="mx-auto max-w-[1500px] px-4 py-6 lg:px-7">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard icon={UsersRound} label="Total customers" value={users.length} />
            <SummaryCard icon={UserRoundCheck} label="Verified identities" value={users.filter((user) => user.is_email_verified).length} />
            <SummaryCard icon={ShieldCheck} label="Active accounts" value={users.filter((user) => user.is_active && !user.is_frozen).length} />
            <SummaryCard icon={ShieldCheck} label="Restricted accounts" value={users.filter((user) => user.is_frozen).length} alert />
          </div>

          {error ? <div className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/[0.06] px-4 py-3 text-xs text-amber-200">{error}</div> : null}

          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button key={item} type="button" onClick={() => { setFilter(item); setPage(1); }} className={`rounded-lg px-3 py-2 text-[10px] font-medium capitalize ${filter === item ? "bg-emerald-400 text-[#07100b]" : "border border-white/[0.08] bg-white/[0.025] text-white/45"}`}>
                  {item}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 lg:w-72">
                <Search className="h-3.5 w-3.5 text-white/25" />
                <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, email, phone, account..." className="h-10 min-w-0 flex-1 bg-transparent text-[10px] text-white outline-none placeholder:text-white/25" />
              </label>
              <button type="button" onClick={() => downloadCsv("stpay-customers.csv", filteredUsers.map((user) => ({ name: user.full_name, email: user.email, phone: user.phone_number, account_number: user.wallet_account_number, balance: user.wallet_balance, verified: user.is_email_verified, frozen: user.is_frozen, joined: user.created_at })))} className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 text-[10px] text-white/55 hover:bg-white/[0.05]">
                <Download className="h-3.5 w-3.5" /> Export
              </button>
            </div>
          </div>

          <div className="mt-4">
            <AdminUsersTable users={visibleUsers} actionLoadingId={actionLoadingId} onFreeze={queueStatusChange} onUnfreeze={queueStatusChange} onView={openUser} />
          </div>

          <Pagination page={page} pageCount={pageCount} count={filteredUsers.length} onPage={setPage} />
        </div>

        <AdminUserDrawer user={selectedUser} transactions={selectedTransactions} loading={detailLoading} onClose={() => setSelectedUser(null)} onStatusChange={setPendingStatusUser} />
        <AdminConfirmDialog
          open={Boolean(pendingStatusUser)}
          title={pendingStatusUser?.is_frozen ? "Restore customer access?" : "Freeze customer account?"}
          message={pendingStatusUser?.is_frozen ? `This will allow ${pendingStatusUser.full_name} to resume transactions.` : `This immediately blocks ${pendingStatusUser?.full_name} from making transactions and sends an account notification.`}
          confirmLabel={pendingStatusUser?.is_frozen ? "Restore access" : "Freeze account"}
          destructive={!pendingStatusUser?.is_frozen}
          loading={Boolean(actionLoadingId)}
          onCancel={() => setPendingStatusUser(null)}
          onConfirm={applyStatusChange}
        />
      </AdminShell>
    </ProtectedRoute>
  );
}

function SummaryCard({ icon: Icon, label, value, alert = false }: { icon: typeof UsersRound; label: string; value: number; alert?: boolean }) {
  return <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"><Icon className={`h-4 w-4 ${alert ? "text-rose-300" : "text-emerald-300"}`} /><p className="mt-5 text-[9px] uppercase tracking-[0.16em] text-white/30">{label}</p><p className="mt-2 text-2xl font-semibold text-white">{value.toLocaleString()}</p></div>;
}

function Pagination({ page, pageCount, count, onPage }: { page: number; pageCount: number; count: number; onPage: (page: number) => void }) {
  return <div className="mt-4 flex items-center justify-between text-[10px] text-white/30"><span>{count} customer records</span><div className="flex items-center gap-2"><button disabled={page === 1} onClick={() => onPage(page - 1)} className="rounded-lg border border-white/[0.07] px-3 py-2 disabled:opacity-30">Previous</button><span>Page {page} of {pageCount}</span><button disabled={page === pageCount} onClick={() => onPage(page + 1)} className="rounded-lg border border-white/[0.07] px-3 py-2 disabled:opacity-30">Next</button></div></div>;
}
