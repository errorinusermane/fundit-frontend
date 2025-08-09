import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, typography, radius, shadows } from "../styles";
import { ProposalStatus, Proposal } from "../types/proposal";

type Props = {
  proposal: Proposal & { remainingTime: number };
  onPress: () => void;
};

const statusColor = {
  ACTIVE: colors.primary,
  CLOSED: colors.muted,
  CANCELLED: colors.danger,
};

const ProposalCard: React.FC<Props> = ({ proposal, onPress }) => {
  const {
    title,
    status,
    minPremium,
    maxPremium,
    bidCount,
    remainingTime,
  } = proposal;

  const formattedPremium = `${minPremium} ~ ${maxPremium} FDT`;
  const remainingText = remainingTime <= 0 ? "시작됨" : `${remainingTime}일 남음`;

  return (
    <TouchableOpacity style={[styles.card, shadows.soft]} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor[status] }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>보험료</Text>
        <Text style={styles.value}>{formattedPremium}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>입찰</Text>
        <Text style={styles.value}>{bidCount}건</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>시작까지</Text>
        <Text style={styles.value}>{remainingText}</Text>
      </View>
    </TouchableOpacity>
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
  title: {
    fontSize: typography.subtitle,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    flexShrink: 1,
  },
  statusBadge: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusText: {
    fontSize: typography.small,
    color: "#fff",
    fontWeight: typography.fontWeight.medium,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xs,
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

export default ProposalCard;
