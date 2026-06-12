"use client";

import { User } from "@/types/user";

const TOKEN_KEY = "stpay_token";
const USER_KEY = "stpay_user";

function isBrowser() {
  return typeof window !== "undefined";
}

function decodeTokenPayload(token: string): { exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(window.atob(padded)) as { exp?: number };
  } catch {
    return null;
  }
}

export function isAuthTokenValid(token: string | null) {
  if (!isBrowser() || !token) {
    return false;
  }
  const payload = decodeTokenPayload(token);
  return Boolean(payload?.exp && payload.exp * 1000 > Date.now());
}

export function storeAuthSession(token: string, user: User) {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getAuthToken() {
  if (!isBrowser()) {
    return null;
  }
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (!isAuthTokenValid(token)) {
    clearAuthSession();
    return null;
  }
  return token;
}

export function getStoredUser(): User | null {
  if (!isBrowser()) {
    return null;
  }
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return isAuthTokenValid(getAuthToken());
}

export function isAdminUser() {
  return getStoredUser()?.role === "admin";
}
