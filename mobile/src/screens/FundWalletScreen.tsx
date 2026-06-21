import { useState } from "react";
import { Alert } from "react-native";

import { Input, PrimaryButton, ScreenCard } from "../components/FormControls";
import { fundWallet, getApiErrorMessage } from "../lib/api";

export function FundWalletScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await fundWallet({ amount: Number(amount), payment_method: "Mobile app simulation" });
      await onDone();
      Alert.alert("Wallet funded", "Your STPay wallet has been funded.");
      onBack();
    } catch (error) {
      Alert.alert("Funding failed", getApiErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenCard title="Fund wallet" onBack={onBack}>
      <Input label="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <PrimaryButton label={busy ? "Processing..." : "Fund wallet"} disabled={busy || !amount} onPress={submit} />
    </ScreenCard>
  );
}
