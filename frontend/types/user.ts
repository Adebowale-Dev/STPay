export type UserRole = "user" | "admin";

export type User = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: UserRole;
  is_active: boolean;
  is_frozen: boolean;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type WalletBalance = {
  account_number: string;
  balance: number;
  currency: string;
};

export type AuthUser = User & {
  token?: string;
};

export type AdminUser = User & {
  wallet_account_number?: string | null;
  wallet_balance?: number;
  wallet_currency?: string;
  transaction_count?: number;
  last_transaction_at?: string | null;
};
