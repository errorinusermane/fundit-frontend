import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, typography, radius } from "../styles";
import { ProposalStatus, Proposal } from "../types/proposal";

type Props = {
  proposal: Proposal & { remainingTime: number };
  onPress: () => void;
};

const statusStyle = {
  ACTIVE: { bg: colors.tags.active.bg, fg: colors.tags.active.fg },
  CLOSED: { bg: colors.tags.closed.bg, fg: colors.tags.closed.fg },
  CANCELLED: { bg: colors.tags.cancelled.bg, fg: colors.tags.cancelled.fg },
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

  const formattedPremium = `Min / Max 보험료: ${minPremium} - ${maxPremium} ETH`;
  const remainingText =
    remainingTime <= 0 ? "시작됨" : `${remainingTime} days left`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusStyle[status].bg },
          ]}
        >
          <Text
            style={[styles.statusText, { color: statusStyle[status].fg }]}
          >
            {status}
          </Text>
        </View>
      </View>

      <Text style={styles.meta}>{formattedPremium}</Text>
      <Text style={styles.meta}>Bid {bidCount}</Text>
      <Text style={styles.time}>{remainingText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius,
    padding: spacing,
    marginBottom: spacing,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing / 2,
  },
  title: {
    fontSize: typography.size.title,
    fontFamily: typography.family.base,
    fontWeight: typography.weight.bold,
    color: colors.text,
    flexShrink: 1,
  },
  statusBadge: {
    borderRadius: radius,
    paddingHorizontal: spacing / 1.5,
    paddingVertical: spacing / 3,
  },
  statusText: {
    fontSize: typography.size.detail,
    fontFamily: typography.family.base,
    fontWeight: typography.weight.medium,
  },
  meta: {
    fontSize: typography.size.card,
    color: colors.textMuted,
    marginTop: spacing / 3,
  },
  time: {
    fontSize: typography.size.card,
    color: colors.textMuted,
    marginTop: spacing / 2,
  },
});

export default ProposalCard;
