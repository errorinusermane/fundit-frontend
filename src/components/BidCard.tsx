import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StyleSheet as RNStyleSheet } from "react-native";
import { Bid } from "../types/bid";
import { colors, spacing, typography, radius } from "../styles";
import CommonButton from "./CommonButton";

type Props = {
  bid: Bid;
  onPress?: () => void;
  onPressVote?: () => void;
  showButton?: boolean;
  disabled?: boolean;
};

const BidCard: React.FC<Props> = ({
  bid,
  onPress,
  onPressVote,
  showButton = false,
  disabled = false,
}) => {
  const {
    companyName,
    planTitle,
    monthlyPremium,
    contractPeriod,
    voteCount,
    minVotes,
  } = bid as any;

  const voteRatio = `${voteCount}/${minVotes}`;
  const premiumText = `${monthlyPremium} FDT / month`;
  const durationText = `Contract Term: ${contractPeriod} months`;

  // 선택적 상태 뱃지(없으면 표시 안 함)
  const status: string | undefined = (bid as any).status;
  const statusStyle =
    status?.toLowerCase() === "funding"
      ? { color: colors.tags.active.fg }
      : status?.toLowerCase() === "pending"
      ? { color: colors.tags.closed.fg }
      : { color: colors.textMuted };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!onPress}
      style={styles.card}
    >
      {/* 헤더: 회사명 + 상태 */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {companyName}
        </Text>
        {status ? (
          <Text style={[styles.status, statusStyle]} numberOfLines={1}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        ) : null}
      </View>

      {/* 본문 메타 */}
      {planTitle ? <Text style={styles.plan}>{planTitle}</Text> : null}
      <Text style={styles.meta}>{premiumText}</Text>
      <Text style={styles.meta}>{durationText}</Text>

      {/* 하단 메타 라인 */}
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>👤 {voteRatio}</Text>
        {/* 필요 시 D-day를 넘겨받으면 표시 (로직 변경 없이 안전 처리) */}
        {(bid as any).dDay ? (
          <Text style={styles.footerRight}>D-{(bid as any).dDay}</Text>
        ) : null}
      </View>

      {showButton && (
        <View style={{ marginTop: spacing * 1.4 }}>
          <CommonButton
            title="Vote"
            onPress={onPressVote || (() => {})}
            disabled={disabled}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius, // 16
    paddingVertical: spacing * 1.6, // 16
    paddingHorizontal: spacing * 1.8, // 18
    marginVertical: spacing, // 10
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing, // 10
  },
  title: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title, // 20
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginRight: spacing,
    flexShrink: 1,
  },
  status: {
    fontFamily: typography.family.base,
    fontSize: typography.size.toggle, // 16
    fontWeight: typography.weight.medium,
  },
  plan: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card, // 17
    color: colors.textMuted,
    marginBottom: spacing / 2, // 5
  },
  meta: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card, // 17
    color: colors.textMuted,
  },
  footer: {
    marginTop: spacing * 1.6, // 16
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLeft: {
    fontFamily: typography.family.base,
    fontSize: typography.size.detail, // 13
    color: colors.textMuted,
  },
  footerRight: {
    fontFamily: typography.family.base,
    fontSize: typography.size.detail, // 13
    color: colors.textMuted,
  },
});

export default BidCard;
