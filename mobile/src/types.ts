export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type User = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: "user" | "admin";
  is_active: boolean;
  is_frozen: boolean;
  is_email_verified: boolean;
};

export type WalletBalance = {
  account_number: string;
  balance: number;
  currency: string;
};

export type Transaction = {
  id: string;
  reference: string;
  amount: number;
  transaction_type: "funding" | "transfer" | "airtime" | "bill_payment";
  direction: "credit" | "debit";
  status: "successful" | "pending" | "failed";
  description?: string | null;
  created_at: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

export type RegisterResponse = {
  user: User;
  wallet_account_number: string;
};

export type TransferBank = {
  name: string;
  code: string;
  slug?: string | null;
  test_mode?: boolean;
};

export type ResolvedAccount = {
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  transfer_method: "internal" | "external";
};

export type TransferResult = {
  reference: string;
  amount: number;
  balance: number;
  status: "successful" | "pending" | "failed";
  description: string;
  created_at: string;
  sender_name: string;
  receiver_name: string;
  receiver_account_number: string;
  bank_name: string;
};

export type Screen = "dashboard" | "fund" | "send";

export type MainTab = "home" | "cards" | "statistics" | "settings";

export type AuthMode = "login" | "signup";

export type SignupPayload = {
  full_name: string;
  phone_number: string;
  email: string;
  password: string;
  transaction_pin: string;
};
