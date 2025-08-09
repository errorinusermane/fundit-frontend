import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
} from "react-native";
import { FunditContract } from "../types/contract";
import { colors, spacing, typography, radius, shadows } from "../styles";

type Props = {
  contract: FunditContract;
  onToggleAuto?: (contractId: number) => void;
};

const ContractCard: React.FC<Props> = ({ contract, onToggleAuto }) => {
  const {
    id,
    monthlyPremium,
    contractPeriod,
    startDate,
    autoPayment,
    status,
  } = contract;

  const formattedPremium = `${monthlyPremium} FDT / 월`;
  const formattedStart = new Date(startDate * 1000).toISOString().split("T")[0].replace(/-/g, ".");
  const statusColor = status === "ACTIVE" ? colors.primary : colors.muted;

  return (
    <View style={[styles.card, shadows.soft]}>
      <View style={styles.header}>
        <Text style={styles.premium}>{formattedPremium}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>계약 기간</Text>
        <Text style={styles.value}>{contractPeriod}개월</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>시작일</Text>
        <Text style={styles.value}>{formattedStart}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>자동 결제</Text>
        <Switch
          value={autoPayment}
          onValueChange={() => onToggleAuto?.(id)}
          thumbColor={autoPayment ? colors.primary : colors.muted}
          trackColor={{ false: colors.border, true: `${colors.primary}88` }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  premium: {
    fontSize: typography.subtitle,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  statusBadge: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusText: {
    color: "#fff",
    fontSize: typography.small,
    fontWeight: typography.fontWeight.medium,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xs,
    alignItems: "center",
  },
  label: {
    color: colors.muted,
    fontSize: typography.small,
  },
  value: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: typography.fontWeight.medium,
  },
});

export default ContractCard;
