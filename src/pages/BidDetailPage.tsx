import React from "react";
import { View, Text, StyleSheet, ScrollView, StyleSheet as RNStyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { StackParamList } from "../navigation/AppNavigator";
import { useUserStore } from "../store/userStore";
import CommonButton from "../components/CommonButton";
import { Bid } from "../types/bid";
import { voteBid } from "../api/bid";
import { colors, spacing, typography, radius } from "../styles";

export function BidDetailPage() {
  const route = useRoute<RouteProp<StackParamList, "BidDetail">>();
  const { user } = useUserStore();
  const bid: Bid = route.params.bid;

  const handleVote = async () => {
    try {
      await voteBid(bid.bidId, user!.id);
      // TODO: toast/alert
    } catch (err) {
      console.error("❌ vote failed:", err);
    }
  };

  // 유틸: 짧은 주소 등 필요 시
  const planName = `${bid.planTitle}${bid.planType ? ` (${bid.planType})` : ""}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Verification banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerLabel}>Insurer Verification</Text>
        <View style={styles.pill}>
          <Text style={styles.pillIcon}>✓</Text>
          <Text style={styles.pillText}>Verified</Text>
        </View>
      </View>

      {/* Origin text */}
      <Text style={styles.origin}>
        This bid originates from the proposal titled "{(bid as any).proposalTitle || "—"}"
      </Text>

      {/* Cards */}
      <Card>
        <Text style={styles.cardTitle}>Company name</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Plan Summary</Text>
        <Text style={styles.cardItem}>Plan Title</Text>
        <Text style={styles.cardMeta}>{planName}</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Coverage Details</Text>
        <Text style={styles.cardItem}>Outpatient Treatment (per visit)</Text>
        <Text style={styles.cardMeta}>{`${bid.outpatientCoveragePerVisit} FDT`}</Text>

        <Text style={[styles.cardItem, { marginTop: spacing }]}>Inpatient Coverage</Text>
        <Text style={styles.cardMeta}>{`${bid.inpatientCoverage} FDT`}</Text>

        <Text style={[styles.cardItem, { marginTop: spacing }]}>Non-covered Medical Coverage</Text>
        <Text style={styles.cardMeta}>{`${bid.nonCoveredCoverage} FDT`}</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Premium</Text>

        <Text style={styles.cardItem}>Monthly Premium</Text>
        <Text style={styles.cardMeta}>{`${bid.monthlyPremium} FDT`}</Text>

        <Text style={[styles.cardItem, { marginTop: spacing }]}>Contract Period</Text>
        <Text style={styles.cardMeta}>{`${bid.contractPeriod} months`}</Text>

        <Text style={[styles.cardItem, { marginTop: spacing }]}>Age Eligibility</Text>
        <Text style={styles.cardMeta}>{bid.ageEligibility}</Text>

        <Text style={[styles.cardItem, { marginTop: spacing }]}>Occupation Eligibility</Text>
        <Text style={styles.cardMeta}>{bid.occupationEligibility}</Text>
      </Card>

      {/* 유저만 투표 버튼 (이미지엔 없지만 로직 유지) */}
      {user?.role === "user" && (
        <View style={{ marginTop: spacing * 3 }}>
          <CommonButton title="Vote" onPress={handleVote} role="user" />
        </View>
      )}
    </ScrollView>
  );
}

/** 카드 컨테이너 (토큰만 사용) */
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.card}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing * 2, // 20
    paddingTop: spacing * 3,        // 30
    paddingBottom: spacing * 4,     // 40
  },

  // Verification banner
  banner: {
    backgroundColor: colors.surface,
    borderRadius: radius,
    paddingVertical: spacing * 1.6,
    paddingHorizontal: spacing * 1.8,
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing * 2,
  },
  bannerLabel: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body, // 18
    color: colors.text,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface, // 어두운 톤 유지
    borderRadius: 999,
    paddingVertical: spacing * 0.6,  // 6
    paddingHorizontal: spacing * 1.2,// 12
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    gap: spacing * 0.6,
  },
  pillIcon: {
    fontFamily: typography.family.base,
    fontSize: typography.size.toggle, // 16
    color: colors.primary,
  },
  pillText: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,   // 17
    color: colors.textMuted,
  },

  origin: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,  // 17
    color: colors.textMuted,
    marginBottom: spacing * 2,
    lineHeight: typography.size.card + 6,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius,
    paddingVertical: spacing * 1.6,
    paddingHorizontal: spacing * 1.8,
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginBottom: spacing * 1.6,
  },
  cardTitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title,     // 20
    fontWeight: typography.weight.bold,  // 700
    color: colors.text,
    marginBottom: spacing,
  },
  cardItem: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body,      // 18
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  cardMeta: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,      // 17
    color: colors.textMuted,
    marginTop: spacing * 0.4,            // 4
  },
});
