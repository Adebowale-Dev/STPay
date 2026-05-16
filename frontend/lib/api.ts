import axios from "axios";

import { getAuthToken } from "@/lib/auth";
import { Notification } from "@/types/notification";
import { Beneficiary, Transaction } from "@/types/transaction";
import { User, WalletBalance } from "@/types/user";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type RegisterPayload = {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  transaction_pin: string;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  new_password: string;
  confirm_password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

export async function registerUser(payload: RegisterPayload) {
  const response = await api.post<ApiEnvelope<{ user: User; wallet_account_number: string }>>(
    "/auth/register",
    payload,
  );
  return response.data;
}

export async function loginUser(payload: LoginPayload) {
  const response = await api.post<ApiEnvelope<LoginResponse>>("/auth/login", payload);
  return response.data;
}

export async function verifyEmail(payload: VerifyEmailPayload) {
  const response = await api.post<ApiEnvelope<null>>("/auth/verify-email", payload);
  return response.data;
}

export async function resendVerificationCode(email: string) {
  const response = await api.post<ApiEnvelope<null>>("/auth/resend-verification-code", { email });
  return response.data;
}

export async function forgotPassword(email: string) {
  const response = await api.post<ApiEnvelope<null>>("/auth/forgot-password", { email });
  return response.data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await api.post<ApiEnvelope<null>>("/auth/reset-password", payload);
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await api.get<ApiEnvelope<User>>("/users/me");
  return response.data;
}

export async function updateProfile(payload: Partial<Pick<User, "full_name" | "phone_number">>) {
  const response = await api.patch<ApiEnvelope<User>>("/users/me", payload);
  return response.data;
}

export async function fetchWalletBalance() {
  const response = await api.get<ApiEnvelope<WalletBalance>>("/wallet/balance");
  return response.data;
}

export async function fundWallet(payload: { amount: number; payment_method: string }) {
  const response = await api.post<
    ApiEnvelope<{ reference: string; amount: number; balance: number }>
  >("/wallet/fund", payload);
  return response.data;
}

export async function transferMoney(payload: {
  receiver_account_number: string;
  amount: number;
  description?: string;
  transaction_pin: string;
}) {
  const response = await api.post<
    ApiEnvelope<{ reference: string; amount: number; balance: number }>
  >("/wallet/transfer", payload);
  return response.data;
}

export async function buyAirtime(payload: {
  network_provider: string;
  phone_number: string;
  amount: number;
  transaction_pin: string;
}) {
  const response = await api.post<
    ApiEnvelope<{ reference: string; amount: number; balance: number }>
  >("/airtime/buy", payload);
  return response.data;
}

export async function payBill(payload: {
  category: string;
  provider: string;
  customer_number: string;
  amount: number;
  transaction_pin: string;
}) {
  const response = await api.post<
    ApiEnvelope<{ reference: string; amount: number; balance: number }>
  >("/bills/pay", payload);
  return response.data;
}

export async function fetchTransactions() {
  const response = await api.get<ApiEnvelope<Transaction[]>>("/transactions");
  return response.data;
}

export async function fetchTransaction(reference: string) {
  const response = await api.get<ApiEnvelope<Transaction[]>>(`/transactions/${reference}`);
  return response.data;
}

export async function fetchBeneficiaries() {
  const response = await api.get<ApiEnvelope<Beneficiary[]>>("/beneficiaries");
  return response.data;
}

export async function addBeneficiary(payload: Omit<Beneficiary, "id" | "user_id" | "created_at">) {
  const response = await api.post<ApiEnvelope<Beneficiary>>("/beneficiaries", payload);
  return response.data;
}

export async function deleteBeneficiary(id: string) {
  const response = await api.delete<ApiEnvelope<null>>(`/beneficiaries/${id}`);
  return response.data;
}

export async function fetchNotifications() {
  const response = await api.get<ApiEnvelope<Notification[]>>("/notifications");
  return response.data;
}

export async function markNotificationRead(id: string) {
  const response = await api.patch<ApiEnvelope<Notification>>(`/notifications/${id}/read`);
  return response.data;
}

export async function fetchAdminUsers() {
  const response = await api.get<ApiEnvelope<User[]>>("/admin/users");
  return response.data;
}

export async function fetchAdminTransactions() {
  const response = await api.get<ApiEnvelope<Transaction[]>>("/admin/transactions");
  return response.data;
}

export async function fetchAdminStats() {
  const response = await api.get<
    ApiEnvelope<{
      total_users: number;
      total_wallet_balance: number;
      total_successful_transactions: number;
      total_failed_transactions: number;
    }>
  >("/admin/stats");
  return response.data;
}

export async function freezeAdminUser(id: string) {
  const response = await api.patch<ApiEnvelope<null>>(`/admin/users/${id}/freeze`);
  return response.data;
}

export async function unfreezeAdminUser(id: string) {
  const response = await api.patch<ApiEnvelope<null>>(`/admin/users/${id}/unfreeze`);
  return response.data;
}

export { api };
