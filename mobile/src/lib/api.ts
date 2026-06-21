import axios from "axios";

import { clearAuthToken, getAuthToken } from "./auth";
import {
  ApiEnvelope,
  LoginResponse,
  RegisterResponse,
  ResolvedAccount,
  Transaction,
  TransferBank,
  TransferResult,
  User,
  WalletBalance,
} from "../types";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearAuthToken();
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (typeof error.response?.data?.message === "string") return error.response.data.message;
  }
  return error instanceof Error ? error.message : fallback;
}

export async function loginUser(payload: { identifier: string; password: string }) {
  const response = await api.post<ApiEnvelope<LoginResponse>>("/auth/login", payload);
  return response.data;
}

export async function registerUser(payload: {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  transaction_pin: string;
}) {
  const response = await api.post<ApiEnvelope<RegisterResponse>>("/auth/register", payload);
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await api.get<ApiEnvelope<User>>("/users/me");
  return response.data;
}

export async function fetchWalletBalance() {
  const response = await api.get<ApiEnvelope<WalletBalance>>("/wallet/balance");
  return response.data;
}

export async function fetchTransactions() {
  const response = await api.get<ApiEnvelope<Transaction[]>>("/transactions");
  return response.data;
}

export async function fundWallet(payload: { amount: number; payment_method: string }) {
  const response = await api.post<ApiEnvelope<{ reference: string; amount: number; balance: number }>>(
    "/wallet/fund",
    payload,
  );
  return response.data;
}

export async function fetchTransferBanks() {
  const response = await api.get<ApiEnvelope<TransferBank[]>>("/wallet/banks");
  return response.data;
}

export async function resolveStpayAccount(accountNumber: string) {
  const response = await api.get<ApiEnvelope<ResolvedAccount>>(`/wallet/resolve-account/${accountNumber}`);
  return response.data;
}

export async function resolveExternalAccount(payload: { account_number: string; bank_code: string }) {
  const response = await api.post<ApiEnvelope<ResolvedAccount>>("/wallet/resolve-external-account", payload);
  return response.data;
}

export async function transferToStpay(payload: {
  receiver_account_number: string;
  amount: number;
  description?: string;
  transaction_pin: string;
}) {
  const response = await api.post<ApiEnvelope<TransferResult>>("/wallet/transfer", payload);
  return response.data;
}

export async function transferToExternalBank(payload: {
  account_number: string;
  bank_code: string;
  amount: number;
  description?: string;
  transaction_pin: string;
}) {
  const response = await api.post<ApiEnvelope<TransferResult>>("/wallet/external-transfer", payload);
  return response.data;
}
