import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Input, PrimaryButton, ScreenCard } from "../components/FormControls";
import {
  fetchTransferBanks,
  getApiErrorMessage,
  resolveExternalAccount,
  resolveStpayAccount,
  transferToExternalBank,
  transferToStpay,
} from "../lib/api";
import { colors } from "../theme";
import type { ResolvedAccount, TransferBank } from "../types";

export function SendMoneyScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [banks, setBanks] = useState<TransferBank[]>([{ name: "STPay Digital Bank", code: "STPAY" }]);
  const [bankCode, setBankCode] = useState("STPAY");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [resolved, setResolved] = useState<ResolvedAccount | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchTransferBanks()
      .then((response) => setBanks([{ name: "STPay Digital Bank", code: "STPAY" }, ...response.data]))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setResolved(null);
    if (accountNumber.length !== 10) return;
    const timer = setTimeout(async () => {
      try {
        const response =
          bankCode === "STPAY"
            ? await resolveStpayAccount(accountNumber)
            : await resolveExternalAccount({ account_number: accountNumber, bank_code: bankCode });
        setResolved(response.data);
      } catch {
        setResolved(null);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [accountNumber, bankCode]);

  const selectedBank = useMemo(() => banks.find((bank) => bank.code === bankCode), [bankCode, banks]);

  async function submit() {
    if (!resolved) return;
    setBusy(true);
    try {
      const response =
        bankCode === "STPAY"
          ? await transferToStpay({
              receiver_account_number: accountNumber,
              amount: Number(amount),
              transaction_pin: pin,
              description: "Mobile transfer",
            })
          : await transferToExternalBank({
              account_number: accountNumber,
              bank_code: bankCode,
              amount: Number(amount),
              transaction_pin: pin,
              description: "Mobile transfer",
            });
      await onDone();
      Alert.alert("Transfer submitted", `Reference: ${response.data.reference}`);
      onBack();
    } catch (error) {
      Alert.alert("Transfer failed", getApiErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenCard title="Send money" onBack={onBack}>
      <Text style={styles.label}>Destination bank</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bankScroll}>
        {banks.map((bank) => (
          <Pressable
            key={`${bank.code}-${bank.name}`}
            style={[styles.bankChip, bank.code === bankCode && styles.bankChipActive]}
            onPress={() => {
              setBankCode(bank.code);
              setAccountNumber("");
            }}
          >
            <Text style={[styles.bankChipText, bank.code === bankCode && styles.bankChipTextActive]}>
              {bank.test_mode ? "Test Bank" : bank.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <Text style={styles.selectedBank}>Selected: {selectedBank?.name}</Text>
      <Input
        label="Receiver account number"
        value={accountNumber}
        onChangeText={(value) => setAccountNumber(value.replace(/\D/g, "").slice(0, 10))}
        keyboardType="numeric"
      />
      {resolved ? (
        <View style={styles.resolvedCard}>
          <Text style={styles.resolvedName}>{resolved.account_name}</Text>
          <Text style={styles.transactionMeta}>
            {resolved.bank_name} - {resolved.account_number}
          </Text>
        </View>
      ) : null}
      <Input label="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <Input
        label="Transaction PIN"
        value={pin}
        onChangeText={(value) => setPin(value.replace(/\D/g, "").slice(0, 4))}
        keyboardType="numeric"
        secureTextEntry
      />
      <PrimaryButton
        label={busy ? "Sending..." : "Send money"}
        disabled={busy || !resolved || !amount || pin.length !== 4}
        onPress={submit}
      />
    </ScreenCard>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: "700",
  },
  bankScroll: {
    marginTop: -6,
  },
  bankChip: {
    marginRight: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.mutedCard,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  bankChipActive: {
    borderColor: colors.green,
    backgroundColor: "rgba(32,201,121,0.12)",
  },
  bankChipText: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: "800",
  },
  bankChipTextActive: {
    color: colors.green,
  },
  selectedBank: {
    color: colors.faintText,
    fontSize: 10,
  },
  resolvedCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(32,201,121,0.22)",
    backgroundColor: "rgba(32,201,121,0.08)",
    padding: 14,
  },
  resolvedName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  transactionMeta: {
    marginTop: 4,
    color: colors.faintText,
    fontSize: 11,
  },
});
