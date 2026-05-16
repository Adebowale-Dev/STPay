import { Notification } from "@/types/notification";
import { Beneficiary, Transaction } from "@/types/transaction";
import { User, WalletBalance } from "@/types/user";

export const mockUser: User = {
  id: "mock-user-1",
  full_name: "Adebowale Stephen",
  email: "ade@example.com",
  phone_number: "08012345678",
  role: "user",
  is_active: true,
  is_frozen: false,
  is_email_verified: true,
  created_at: "2026-05-01T09:00:00.000Z",
  updated_at: "2026-05-16T09:00:00.000Z",
};

export const mockWallet: WalletBalance = {
  account_number: "7916532460",
  balance: 185000,
  currency: "NGN",
};

export const mockTransactions: Transaction[] = [
  {
    id: "txn-001",
    reference: "STP-20260516-938292",
    sender_id: "mock-user-1",
    receiver_id: "mock-user-2",
    amount: 5000,
    transaction_type: "transfer",
    direction: "debit",
    status: "successful",
    description: "Rent contribution",
    created_at: "2026-05-16T08:15:00.000Z",
  },
  {
    id: "txn-002",
    reference: "STP-20260515-320194",
    receiver_id: "mock-user-1",
    amount: 25000,
    transaction_type: "funding",
    direction: "credit",
    status: "successful",
    description: "Wallet funded via card",
    created_at: "2026-05-15T11:40:00.000Z",
  },
  {
    id: "txn-003",
    reference: "STP-20260514-991520",
    sender_id: "mock-user-1",
    amount: 1500,
    transaction_type: "airtime",
    direction: "debit",
    status: "successful",
    description: "MTN airtime top-up",
    created_at: "2026-05-14T13:25:00.000Z",
  },
  {
    id: "txn-004",
    reference: "STP-20260513-135776",
    sender_id: "mock-user-1",
    amount: 8200,
    transaction_type: "bill_payment",
    direction: "debit",
    status: "successful",
    description: "Electricity bill payment",
    created_at: "2026-05-13T17:10:00.000Z",
  },
  {
    id: "txn-005",
    reference: "STP-20260510-889121",
    receiver_id: "mock-user-1",
    amount: 12000,
    transaction_type: "transfer",
    direction: "credit",
    status: "successful",
    description: "Refund from Tunde",
    created_at: "2026-05-10T10:20:00.000Z",
  },
];

export const mockBeneficiaries: Beneficiary[] = [
  {
    id: "ben-001",
    user_id: "mock-user-1",
    beneficiary_name: "Tunde Ola",
    account_number: "0192873645",
    phone_number: "08033334444",
    bank_name: "STPay",
    created_at: "2026-05-10T10:00:00.000Z",
  },
  {
    id: "ben-002",
    user_id: "mock-user-1",
    beneficiary_name: "Blessing Nwachukwu",
    account_number: "2109876543",
    phone_number: "08122223333",
    bank_name: "STPay",
    created_at: "2026-05-11T14:40:00.000Z",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "note-001",
    user_id: "mock-user-1",
    title: "Wallet funded successfully",
    message: "Your wallet was credited with NGN 25,000.00. A confirmation email has been sent.",
    notification_type: "funding",
    is_read: false,
    created_at: "2026-05-15T11:42:00.000Z",
  },
  {
    id: "note-002",
    user_id: "mock-user-1",
    title: "Transfer successful",
    message: "NGN 5,000.00 was sent successfully to Tunde Ola.",
    notification_type: "transfer",
    is_read: true,
    created_at: "2026-05-16T08:16:00.000Z",
  },
  {
    id: "note-003",
    user_id: "mock-user-1",
    title: "Password changed",
    message: "Your password was updated successfully. If this was not you, contact support immediately.",
    notification_type: "security",
    is_read: false,
    created_at: "2026-05-12T16:05:00.000Z",
  },
];

export const spendingTrend = [
  { month: "Jan", sent: 30000, received: 50000, bills: 15000 },
  { month: "Feb", sent: 42000, received: 56000, bills: 18000 },
  { month: "Mar", sent: 38000, received: 61000, bills: 22000 },
  { month: "Apr", sent: 52000, received: 72000, bills: 20000 },
  { month: "May", sent: 47000, received: 69000, bills: 17000 },
  { month: "Jun", sent: 62000, received: 83000, bills: 26000 },
];

export const mockAdminUsers: Array<User & { wallet_balance: number }> = [
  {
    id: "admin-001",
    full_name: "STPay Admin",
    email: "admin@stpay.com",
    phone_number: "09000000000",
    role: "admin",
    is_active: true,
    is_frozen: false,
    is_email_verified: true,
    created_at: "2026-04-28T09:00:00.000Z",
    updated_at: "2026-05-16T08:00:00.000Z",
    wallet_balance: 0,
  },
  {
    ...mockUser,
    wallet_balance: mockWallet.balance,
  },
  {
    id: "mock-user-2",
    full_name: "Tunde Ola",
    email: "tunde@example.com",
    phone_number: "08055556666",
    role: "user",
    is_active: true,
    is_frozen: false,
    is_email_verified: true,
    created_at: "2026-05-05T13:10:00.000Z",
    updated_at: "2026-05-16T07:30:00.000Z",
    wallet_balance: 64200,
  },
  {
    id: "mock-user-3",
    full_name: "Blessing Nwachukwu",
    email: "blessing@example.com",
    phone_number: "08122223333",
    role: "user",
    is_active: true,
    is_frozen: true,
    is_email_verified: false,
    created_at: "2026-05-09T16:45:00.000Z",
    updated_at: "2026-05-16T06:30:00.000Z",
    wallet_balance: 10300,
  },
];

export const mockAdminStats = {
  total_users: mockAdminUsers.length,
  total_wallet_balance: mockAdminUsers.reduce((sum, user) => sum + user.wallet_balance, 0),
  total_successful_transactions: mockTransactions.filter(
    (transaction) => transaction.status === "successful",
  ).length,
  total_failed_transactions: mockTransactions.filter(
    (transaction) => transaction.status === "failed",
  ).length,
};

export const adminVolumeTrend = [
  { period: "Mon", transfers: 18, funding: 14, bills: 8 },
  { period: "Tue", transfers: 24, funding: 17, bills: 10 },
  { period: "Wed", transfers: 19, funding: 21, bills: 12 },
  { period: "Thu", transfers: 27, funding: 19, bills: 11 },
  { period: "Fri", transfers: 30, funding: 26, bills: 16 },
  { period: "Sat", transfers: 15, funding: 11, bills: 7 },
];
