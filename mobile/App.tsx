import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View, useColorScheme } from "react-native";

import {
  fetchCurrentUser,
  fetchTransactions,
  fetchWalletBalance,
  getApiErrorMessage,
  loginUser,
  registerUser,
} from "./src/lib/api";
import { clearAuthToken, getAuthToken, getOnboardingSeen, saveAuthToken, saveOnboardingSeen } from "./src/lib/auth";
import { AuthScreen } from "./src/screens/AuthScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { FundWalletScreen } from "./src/screens/FundWalletScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { SendMoneyScreen } from "./src/screens/SendMoneyScreen";
import { SplashScreen } from "./src/screens/SplashScreen";
import { colors } from "./src/theme";
import type { AuthMode, MainTab, Screen, SignupPayload, Transaction, User, WalletBalance } from "./src/types";

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme !== "light";
  const [loadingSession, setLoadingSession] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [tokenReady, setTokenReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [activeTab, setActiveTab] = useState<MainTab>("home");

  async function loadSession() {
    setLoadingSession(true);
    try {
      const seen = await getOnboardingSeen();
      setOnboardingSeen(seen);
      const token = await getAuthToken();
      if (!token) return;
      setTokenReady(true);
      const [profile, balance, history] = await Promise.all([
        fetchCurrentUser(),
        fetchWalletBalance(),
        fetchTransactions(),
      ]);
      setUser(profile.data);
      setWallet(balance.data);
      setTransactions(history.data.slice(0, 5));
    } catch {
      await clearAuthToken();
      setTokenReady(false);
    } finally {
      setLoadingSession(false);
    }
  }

  useEffect(() => {
    loadSession();
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  async function handleLogin(identifier: string, password: string) {
    setBusy(true);
    try {
      const response = await loginUser({ identifier, password });
      await saveAuthToken(response.data.access_token);
      setTokenReady(true);
      await loadSession();
    } catch (error) {
      Alert.alert("Login failed", getApiErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleSignup(payload: SignupPayload) {
    setBusy(true);
    try {
      await registerUser(payload);
      Alert.alert("Account created", "A verification code has been sent to your email address.");
      setAuthMode("login");
    } catch (error) {
      Alert.alert("Registration failed", getApiErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await clearAuthToken();
    setTokenReady(false);
    setUser(null);
    setWallet(null);
    setTransactions([]);
    setScreen("dashboard");
    setActiveTab("home");
  }

  async function refreshDashboard() {
    const [balance, history] = await Promise.all([fetchWalletBalance(), fetchTransactions()]);
    setWallet(balance.data);
    setTransactions(history.data.slice(0, 5));
  }

  if (loadingSession || showSplash) {
    return <SplashScreen isDark={isDark} />;
  }

  if (!onboardingSeen) {
    return (
      <OnboardingScreen
        isDark={isDark}
        onFinish={async () => {
          await saveOnboardingSeen();
          setOnboardingSeen(true);
        }}
      />
    );
  }

  if (!tokenReady || !user) {
    return (
      <AuthScreen
        mode={authMode}
        busy={busy}
        isDark={isDark}
        onModeChange={setAuthMode}
        onBackToOnboarding={() => setOnboardingSeen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    );
  }

  return (
    <SafeAreaView style={styles.app}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>STPay</Text>
            <Text style={styles.headerTitle}>Hi, {user.full_name.split(" ")[0]}</Text>
          </View>
          <Pressable style={styles.iconButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.main}>
          {screen === "dashboard" && activeTab === "home" ? (
            <DashboardScreen
              wallet={wallet}
              transactions={transactions}
              onNavigate={setScreen}
              onRefresh={refreshDashboard}
            />
          ) : null}
          {screen === "dashboard" && activeTab === "cards" ? (
            <TabPlaceholder
              icon="card-outline"
              title="My Cards"
              text="Virtual and physical card controls will live here."
            />
          ) : null}
          {screen === "dashboard" && activeTab === "statistics" ? (
            <TabPlaceholder
              icon="pie-chart-outline"
              title="Statistics"
              text="Your wallet insights, spending charts, and transfer trends will show here."
            />
          ) : null}
          {screen === "dashboard" && activeTab === "settings" ? (
            <TabPlaceholder
              icon="settings-outline"
              title="Settings"
              text="Profile, security, PIN, and account preference controls will live here."
            />
          ) : null}
          {screen === "fund" ? <FundWalletScreen onBack={() => setScreen("dashboard")} onDone={refreshDashboard} /> : null}
          {screen === "send" ? <SendMoneyScreen onBack={() => setScreen("dashboard")} onDone={refreshDashboard} /> : null}
        </View>

        {screen === "dashboard" ? <BottomTabBar activeTab={activeTab} onChange={setActiveTab} /> : null}
      </View>
    </SafeAreaView>
  );
}

const tabs: Array<{ key: MainTab; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { key: "home", label: "Home", icon: "home-outline" },
  { key: "cards", label: "My Cards", icon: "card-outline" },
  { key: "statistics", label: "Statistics", icon: "pie-chart-outline" },
  { key: "settings", label: "Settings", icon: "settings-outline" },
];

function BottomTabBar({ activeTab, onChange }: { activeTab: MainTab; onChange: (tab: MainTab) => void }) {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const active = tab.key === activeTab;
        return (
          <Pressable key={tab.key} style={styles.tabItem} onPress={() => onChange(tab.key)}>
            <Ionicons
              name={active ? (tab.icon.replace("-outline", "") as keyof typeof Ionicons.glyphMap) : tab.icon}
              size={24}
              color={active ? colors.green : colors.faintText}
            />
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function TabPlaceholder({
  icon,
  title,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.placeholderWrap}>
      <View style={styles.placeholderCard}>
        <View style={styles.placeholderIcon}>
          <Ionicons name={icon} size={30} color={colors.green} />
        </View>
        <Text style={styles.placeholderTitle}>{title}</Text>
        <Text style={styles.placeholderText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
  shell: {
    flex: 1,
  },
  main: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  brand: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  headerTitle: {
    marginTop: 4,
    color: colors.text,
    fontSize: 21,
    fontWeight: "800",
  },
  iconButton: {
    height: 42,
    width: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.card,
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 8,
    paddingTop: 11,
    paddingBottom: 13,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tabLabel: {
    color: colors.faintText,
    fontSize: 12,
    fontWeight: "700",
  },
  tabLabelActive: {
    color: colors.green,
  },
  placeholderWrap: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  placeholderCard: {
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 28,
  },
  placeholderIcon: {
    height: 64,
    width: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "rgba(32,201,121,0.12)",
  },
  placeholderTitle: {
    marginTop: 18,
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  placeholderText: {
    marginTop: 10,
    color: colors.mutedText,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
  },
});
