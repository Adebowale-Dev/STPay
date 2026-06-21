import * as SecureStore from "expo-secure-store";

const tokenKey = "stpay_access_token";
const onboardingKey = "stpay_onboarding_seen";

export async function getAuthToken() {
  return SecureStore.getItemAsync(tokenKey);
}

export async function saveAuthToken(token: string) {
  await SecureStore.setItemAsync(tokenKey, token);
}

export async function clearAuthToken() {
  await SecureStore.deleteItemAsync(tokenKey);
}

export async function getOnboardingSeen() {
  return (await SecureStore.getItemAsync(onboardingKey)) === "true";
}

export async function saveOnboardingSeen() {
  await SecureStore.setItemAsync(onboardingKey, "true");
}
