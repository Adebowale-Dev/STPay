import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { formatDate, formatMoney } from "../lib/format";
import { colors } from "../theme";
import type { Screen, Transaction, WalletBalance } from "../types";

export function DashboardScreen({
  wallet,
  transactions,
  onNavigate,
  onRefresh,
}: {
  wallet: WalletBalance | null;
  transactions: Transaction[];
  onNavigate: (screen: Screen) => void;
  onRefresh: () => void;
}) {
  const totalCredit = transactions
    .filter((transaction) => transaction.direction === "credit")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const totalDebit = transactions
    .filter((transaction) => transaction.direction === "debit")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const successfulCount = transactions.filter((transaction) => transaction.status === "successful").length;
  const activityScore = transactions.length ? Math.round((successfulCount / transactions.length) * 100) : 100;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.balanceCard}>
        <View style={styles.balanceGlow} />
        <View style={styles.balanceTop}>
          <View>
            <Text style={styles.balanceLabel}>Available balance</Text>
            <Text style={styles.balance}>{formatMoney(wallet?.balance ?? 0)}</Text>
          </View>
          <Pressable style={styles.refreshButton} onPress={onRefresh}>
            <Ionicons name="refresh-outline" size={18} color="#07100b" />
          </Pressable>
        </View>
        <View style={styles.walletNumber}>
          <Text style={styles.walletNumberLabel}>Primary wallet</Text>
          <Text style={styles.account}>{wallet?.account_number ?? "Loading..."}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Action title="Fund" subtitle="Top up" icon="add" onPress={() => onNavigate("fund")} />
        <Action title="Send" subtitle="Transfer" icon="paper-plane" onPress={() => onNavigate("send")} />
        <Action title="Airtime" subtitle="Coming soon" icon="phone-portrait-outline" onPress={onRefresh} muted />
        <Action title="Bills" subtitle="Coming soon" icon="receipt-outline" onPress={onRefresh} muted />
      </View>

      <View style={styles.summaryGrid}>
        <MetricCard
          title="Money in"
          value={formatMoney(totalCredit)}
          icon="arrow-down"
          tone="green"
        />
        <MetricCard
          title="Money out"
          value={formatMoney(totalDebit)}
          icon="arrow-up"
          tone="warning"
        />
      </View>

      <View style={styles.insightCard}>
        <View style={styles.insightTop}>
          <View>
            <Text style={styles.insightTitle}>Account health</Text>
            <Text style={styles.insightCopy}>Your recent activity is secure and easy to track.</Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{activityScore}%</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${activityScore}%` }]} />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          <Text style={styles.sectionHint}>Latest wallet movement</Text>
        </View>
        <Pressable style={styles.miniLink} onPress={onRefresh}>
          <Text style={styles.miniLinkText}>Refresh</Text>
        </Pressable>
      </View>

      {transactions.length === 0 ? (
        <EmptyState text="No transactions yet." />
      ) : (
        transactions.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))
      )}
    </ScrollView>
  );
}

function Action({
  title,
  subtitle,
  icon,
  muted,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  muted?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.action, muted && styles.actionMuted]} onPress={onPress}>
      <View style={[styles.actionIcon, muted && styles.actionIconMuted]}>
        <Ionicons name={icon} size={19} color={muted ? colors.faintText : colors.green} />
      </View>
      <Text style={styles.actionText}>{title}</Text>
      <Text style={styles.actionSubtext}>{subtitle}</Text>
    </Pressable>
  );
}

function MetricCard({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone: "green" | "warning";
}) {
  const activeColor = tone === "green" ? colors.green : colors.warning;

  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: `${activeColor}22` }]}>
        <Ionicons name={icon} size={17} color={activeColor} />
      </View>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isCredit = transaction.direction === "credit";
  const icon = getTransactionIcon(transaction);

  return (
    <View style={styles.transaction}>
      <View style={styles.transactionLeft}>
        <View style={[styles.transactionIcon, isCredit && styles.transactionIconCredit]}>
          <Ionicons name={icon} size={18} color={isCredit ? colors.green : colors.warning} />
        </View>
        <View style={styles.transactionCopy}>
          <Text style={styles.transactionTitle} numberOfLines={1}>
            {transaction.description ?? transaction.transaction_type.replace("_", " ")}
          </Text>
          <Text style={styles.transactionMeta}>{formatDate(transaction.created_at)}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={isCredit ? styles.credit : styles.debit}>
          {isCredit ? "+" : "-"}
          {formatMoney(transaction.amount)}
        </Text>
        <Text style={[styles.statusPill, transaction.status !== "successful" && styles.statusPending]}>
          {transaction.status}
        </Text>
      </View>
    </View>
  );
}

function getTransactionIcon(transaction: Transaction): keyof typeof Ionicons.glyphMap {
  if (transaction.transaction_type === "funding") return "wallet-outline";
  if (transaction.transaction_type === "airtime") return "phone-portrait-outline";
  if (transaction.transaction_type === "bill_payment") return "receipt-outline";
  return transaction.direction === "credit" ? "arrow-down" : "arrow-up";
}

function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name="file-tray-outline" size={22} color={colors.green} />
      </View>
      <Text style={styles.transactionMeta}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 42,
  },
  balanceCard: {
    overflow: "hidden",
    borderRadius: 34,
    backgroundColor: colors.green,
    padding: 22,
    minHeight: 190,
  },
  balanceGlow: {
    position: "absolute",
    right: -38,
    top: -42,
    height: 142,
    width: 142,
    borderRadius: 71,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  balanceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  balanceLabel: {
    color: "rgba(7,16,11,0.64)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  refreshButton: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.68)",
  },
  label: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: "700",
  },
  balance: {
    marginTop: 10,
    color: colors.background,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1,
  },
  walletNumber: {
    marginTop: "auto",
    borderRadius: 22,
    backgroundColor: "rgba(7,16,11,0.16)",
    padding: 15,
  },
  walletNumberLabel: {
    color: "rgba(7,16,11,0.52)",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  account: {
    marginTop: 8,
    color: colors.background,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 3,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  action: {
    width: "47.8%",
    gap: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 16,
  },
  actionMuted: {
    opacity: 0.82,
  },
  actionIcon: {
    height: 42,
    width: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "rgba(32,201,121,0.14)",
  },
  actionIconMuted: {
    backgroundColor: colors.mutedCard,
  },
  actionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  actionSubtext: {
    marginTop: -3,
    color: colors.faintText,
    fontSize: 11,
    fontWeight: "700",
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  metricCard: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 16,
  },
  metricIcon: {
    height: 34,
    width: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  metricTitle: {
    marginTop: 16,
    color: colors.faintText,
    fontSize: 11,
    fontWeight: "800",
  },
  metricValue: {
    marginTop: 6,
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  insightCard: {
    marginTop: 16,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.mutedCard,
    padding: 18,
  },
  insightTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  insightTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  insightCopy: {
    marginTop: 5,
    maxWidth: 210,
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
  },
  scoreBadge: {
    height: 52,
    width: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(32,201,121,0.14)",
  },
  scoreText: {
    color: colors.green,
    fontSize: 14,
    fontWeight: "900",
  },
  progressTrack: {
    overflow: "hidden",
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginTop: 18,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.green,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  sectionHint: {
    marginTop: 4,
    color: colors.faintText,
    fontSize: 11,
    fontWeight: "700",
  },
  miniLink: {
    borderRadius: 999,
    backgroundColor: colors.mutedCard,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  miniLinkText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "900",
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: 10,
    padding: 14,
  },
  transactionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  transactionIcon: {
    height: 42,
    width: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "rgba(251,191,36,0.12)",
  },
  transactionIconCredit: {
    backgroundColor: "rgba(32,201,121,0.12)",
  },
  transactionCopy: {
    flex: 1,
  },
  transactionTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  transactionMeta: {
    marginTop: 4,
    color: colors.faintText,
    fontSize: 11,
    fontWeight: "700",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  credit: {
    color: colors.green,
    fontSize: 14,
    fontWeight: "900",
  },
  debit: {
    color: colors.warning,
    fontSize: 14,
    fontWeight: "900",
  },
  statusPill: {
    overflow: "hidden",
    marginTop: 7,
    borderRadius: 999,
    backgroundColor: "rgba(32,201,121,0.12)",
    color: colors.green,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 9,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  statusPending: {
    backgroundColor: "rgba(251,191,36,0.12)",
    color: colors.warning,
  },
  empty: {
    alignItems: "center",
    gap: 10,
    borderRadius: 22,
    backgroundColor: colors.card,
    padding: 22,
  },
  emptyIcon: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "rgba(32,201,121,0.12)",
  },
});
