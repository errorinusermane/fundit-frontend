import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Bid } from "../types/bid";
import { colors, spacing, typography, radius, shadows } from "../styles";
import CommonButton from "./CommonButton";

type Props = {
  bid: Bid;
  onPress?: () => void; 
  onPressVote?: () => void;
  showButton?: boolean;
  disabled?: boolean;
};

const BidCard: React.FC<Props> = ({ bid, onPressVote, showButton = false, disabled = false }) => {
  const {
    companyName,
    planTitle,
    monthlyPremium,
    contractPeriod,
    voteCount,
    minVotes,
  } = bid;

  const voteRatio = `${voteCount}/${minVotes}`;
  const premiumText = `${monthlyPremium} FDT / 월`;
  const durationText = `${contractPeriod}개월`;

  return (
    <View style={[styles.card, shadows.soft]}>
      <View style={styles.header}>
        <Text style={styles.title}>{companyName}</Text>
        <Text style={styles.subtitle}>{planTitle}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>보험료</Text>
        <Text style={styles.value}>{premiumText}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>계약 기간</Text>
        <Text style={styles.value}>{durationText}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>투표</Text>
        <Text style={styles.value}>{voteRatio}</Text>
      </View>

      {showButton && (
        <CommonButton
          title="투표하기"
          onPress={onPressVote || (() => {})}
          disabled={disabled}
        />
      )}
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
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.subtitle,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.muted,
    marginTop: 2,
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

export default BidCard;
