import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { AuthMode, SignupPayload } from "../types";

type AuthPalette = {
  background: string;
  text: string;
  muted: string;
  line: string;
  icon: string;
};

export function AuthScreen({
  mode,
  busy,
  isDark,
  onModeChange,
  onBackToOnboarding,
  onLogin,
  onSignup,
}: {
  mode: AuthMode;
  busy: boolean;
  isDark: boolean;
  onModeChange: (mode: AuthMode) => void;
  onBackToOnboarding: () => void;
  onLogin: (identifier: string, password: string) => void;
  onSignup: (payload: SignupPayload) => void;
}) {
  const isLogin = mode === "login";
  const [identifier, setIdentifier] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [transactionPin, setTransactionPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const palette: AuthPalette = {
    background: isDark ? "#171721" : "#ffffff",
    text: isDark ? "#ffffff" : "#222230",
    muted: isDark ? "#9a9aa8" : "#a1a1ad",
    line: isDark ? "#282835" : "#efeff4",
    icon: isDark ? "#b6b6c2" : "#a1a1ad",
  };

  const canSubmit = isLogin
    ? identifier.trim().length > 0 && password.length > 0
    : fullName.trim().length > 1 &&
      phoneNumber.trim().length > 6 &&
      email.trim().length > 3 &&
      password.length >= 6 &&
      transactionPin.length === 4;

  function submit() {
    if (busy || !canSubmit) return;
    if (isLogin) {
      onLogin(identifier.trim(), password);
      return;
    }
    onSignup({
      full_name: fullName.trim(),
      phone_number: phoneNumber.trim(),
      email: email.trim(),
      password,
      transaction_pin: transactionPin,
    });
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: palette.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={palette.background} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
          <Pressable
            style={[styles.backButton, { backgroundColor: isDark ? "#20202d" : "#f4f4f6" }]}
            onPress={() => (isLogin ? onBackToOnboarding() : onModeChange("login"))}
          >
            <Ionicons name="chevron-back" size={22} color={palette.text} />
          </Pressable>

          <Text style={[styles.title, { color: palette.text }]}>{isLogin ? "Sign In" : "Sign Up"}</Text>

          <View style={styles.fields}>
            {isLogin ? (
              <AuthField
                label="Email Address"
                icon="mail-outline"
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email or phone"
                palette={palette}
              />
            ) : (
              <>
                <AuthField
                  label="Full Name"
                  icon="person-outline"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  palette={palette}
                />
                <AuthField
                  label="Phone Number"
                  icon="call-outline"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="08012345678"
                  palette={palette}
                />
                <AuthField
                  label="Email Address"
                  icon="mail-outline"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter your email"
                  palette={palette}
                />
              </>
            )}

            <AuthField
              label="Password"
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter your password"
              palette={palette}
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword((value) => !value)}
            />

            {!isLogin ? (
              <AuthField
                label="Transaction PIN"
                icon="keypad-outline"
                value={transactionPin}
                onChangeText={(value) => setTransactionPin(value.replace(/\D/g, "").slice(0, 4))}
                secureTextEntry={!showPin}
                keyboardType="number-pad"
                placeholder="4-digit PIN"
                palette={palette}
                rightIcon={showPin ? "eye-off-outline" : "eye-outline"}
                onRightIconPress={() => setShowPin((value) => !value)}
              />
            ) : null}
          </View>

          <Pressable
            style={[styles.submit, (!canSubmit || busy) && styles.disabled]}
            disabled={!canSubmit || busy}
            onPress={submit}
          >
            <Text style={styles.submitText}>
              {busy ? (isLogin ? "Signing In..." : "Creating Account...") : isLogin ? "Sign In" : "Sign Up"}
            </Text>
          </Pressable>

          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: palette.muted }]}>
              {isLogin ? "I'm a new user. " : "Already have an account. "}
            </Text>
            <Pressable onPress={() => onModeChange(isLogin ? "signup" : "login")}>
              <Text style={styles.switchLink}>{isLogin ? "Sign Up" : "Sign In"}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function AuthField({
  label,
  icon,
  palette,
  rightIcon,
  onRightIconPress,
  ...inputProps
}: ComponentProps<typeof TextInput> & {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  palette: AuthPalette;
  rightIcon?: ComponentProps<typeof Ionicons>["name"];
  onRightIconPress?: () => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: palette.muted }]}>{label}</Text>
      <View style={[styles.inputRow, { borderBottomColor: palette.line }]}>
        <Ionicons name={icon} size={18} color={palette.icon} />
        <TextInput placeholderTextColor={palette.muted} style={[styles.input, { color: palette.text }]} {...inputProps} />
        {rightIcon ? (
          <Pressable onPress={onRightIconPress} hitSlop={10}>
            <Ionicons name={rightIcon} size={18} color={palette.icon} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
  },
  backButton: {
    height: 42,
    width: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
  },
  title: {
    marginTop: 44,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  fields: {
    gap: 22,
    marginTop: 32,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  inputRow: {
    minHeight: 35,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 7,
    fontSize: 19,
    fontWeight: "600",
  },
  submit: {
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#20c979",
    marginTop: 36,
  },
  submitText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  switchText: {
    fontSize: 14,
    fontWeight: "600",
  },
  switchLink: {
    color: "#20c979",
    fontSize: 14,
    fontWeight: "900",
  },
  disabled: {
    opacity: 0.45,
  },
});
