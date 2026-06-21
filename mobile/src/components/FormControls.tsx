import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "../theme";

export function ScreenCard({ title, onBack, children }: { title: string; onBack: () => void; children: ReactNode }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={18} color={colors.text} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
      </View>
    </ScrollView>
  );
}

export function Input(props: ComponentProps<typeof TextInput> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.faintText} style={styles.input} {...inputProps} />
    </View>
  );
}

export function PrimaryButton({
  label,
  disabled,
  onPress,
}: {
  label: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.primaryButton, disabled && styles.disabled]} disabled={disabled} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 42,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  backText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  formCard: {
    gap: 16,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: "700",
  },
  input: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.mutedCard,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 14,
  },
  primaryButton: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.green,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "900",
  },
  disabled: {
    opacity: 0.45,
  },
});
