import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { StackParamList } from "../navigation/AppNavigator";
import { useUserStore } from "../store/userStore";
import CommonButton from "../components/CommonButton";
import { Bid } from "../types/bid";
import { voteBid } from "../api/bid";
import { colors, spacing, typography } from "../styles";

export function BidDetailPage() {
  const route = useRoute<RouteProp<StackParamList, "BidDetail">>();
  const { user } = useUserStore();

  const bid: Bid = route.params.bid;

  const handleVote = async () => {
    try {
      await voteBid(bid.bidId, user!.id);
      // TODO: 알림 메시지 띄우기 등 후처리
    } catch (err) {
      console.error("❌ vote failed:", err);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.companyName}>{bid.companyName}</Text>
      <Text style={styles.planTitle}>{bid.planTitle} ({bid.planType})</Text>

      <Section label="외래 보장금액(1회)" value={`${bid.outpatientCoveragePerVisit} FDT`} />
      <Section label="입원 보장금액" value={`${bid.inpatientCoverage} FDT`} />
      <Section label="비보장금액" value={`${bid.nonCoveredCoverage} FDT`} />
      <Section label="월 보험료" value={`${bid.monthlyPremium} FDT`} />
      <Section label="계약 기간" value={`${bid.contractPeriod}개월`} />
      <Section label="가입 가능 연령" value={`${bid.ageEligibility}세 이상`} />
      <Section label="직업 제한" value={bid.occupationEligibility} />
      <Section label="투표 수" value={`${bid.voteCount} / ${bid.minVotes}`} />

      {user?.role === "user" && (
        <CommonButton
          title="투표하기"
          onPress={handleVote}
          role="user"
        />
      )}
    </ScrollView>
  );
}

function Section({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  companyName: {
    fontSize: typography.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  planTitle: {
    fontSize: typography.subtitle,
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: typography.body,
    color: colors.muted,
  },
  value: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
});
