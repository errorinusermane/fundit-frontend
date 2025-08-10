import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, StyleSheet as RNStyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { getProposalById } from "../api/proposal";
import { getBidsByProposal } from "../api/bid";

import { Proposal } from "../types/proposal";
import { Bid } from "../types/bid";
import { useUserStore } from "../store/userStore";
import CommonButton from "../components/CommonButton";
import BidCard from "../components/BidCard";

import { colors, spacing, typography, radius } from "../styles";

export function ProposalDetailPage() {
  const route = useRoute<RouteProp<StackParamList, "ProposalDetail">>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { user } = useUserStore();

  const [proposal, setProposal] = useState<Proposal & { remainingTime: number } | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);

  const proposalId = route.params.proposalId;

  useEffect(() => {
    if (proposalId) loadProposal();
  }, [proposalId]);

  const loadProposal = async () => {
    try {
      const detail = await getProposalById(proposalId);
      const bidList = await getBidsByProposal(proposalId);
      setProposal(detail);
      setBids(bidList);
    } catch (err) {
      console.error("❌ Failed to load detail:", err);
    }
  };

  const handleSubmitBid = () => {
    navigation.navigate("SubmitBid", { proposalId });
  };

  const handleBidPress = (bid: Bid) => {
    navigation.navigate("BidDetail", { bid });
  };

  if (!proposal) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {/* 제목 영역 */}
      <View style={styles.titleWrap}>
        <Text style={styles.title}>{proposal.title}</Text>
        {/* 작성자/날짜 간단 메타(옵션) */}
        <Text style={styles.metaMuted}>
          {proposal.proposer || "User"} · {formatDate(proposal.createdAt || proposal.desiredStartDate)}
        </Text>
      </View>

      {/* 본문 설명 + 구분선 */}
      <Text style={styles.description}>{proposal.description}</Text>
      <View style={styles.divider} />

      {/* 섹션 카드들 */}
      <SectionCard title="Mandatory Requirements">
        {proposal.mandatoryRequirements.map((item, idx) => (
          <Bullet key={idx} text={item} />
        ))}
      </SectionCard>

      <SectionCard title="Enrollment Conditions">
        {proposal.enrollmentConditions.map((item, idx) => (
          <Bullet key={idx} text={item} />
        ))}
      </SectionCard>

      <SectionCard title="Optional Features">
        {proposal.optionalFeatures.map((item, idx) => (
          <Bullet key={idx} text={item} />
        ))}
      </SectionCard>

      {/* Desired Start Date 필드칩 */}
      <FieldCard label="Desired Start Date" value={formatDate(proposal.desiredStartDate)} />

      {/* Bids 섹션 헤더 */}
      <View style={styles.bidsHeader}>
        <Text style={styles.bidsTitle}>
          This proposal has {proposal.bidCount ?? bids.length} insurer bids.
        </Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.viewAll}>View All ›</Text>
        </TouchableOpacity>
      </View>

      {/* Bid 리스트 */}
      {bids.length === 0 ? (
        <Text style={styles.emptyText}>No bids submitted yet.</Text>
      ) : (
        bids.map((bid) => (
          <BidCard key={bid.bidId} bid={bid} onPress={() => handleBidPress(bid)} />
        ))
      )}

      {/* 회사만 활성 */}
      <View style={{ marginTop: spacing * 2 }}>
        <CommonButton
          title="Submit Bid"
          role="company"
          onPress={handleSubmitBid}
          disabled={user?.role !== "company"}
        />
      </View>
    </ScrollView>
  );
}

/** 점 목록 한 줄 */
function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

/** 카드 컨테이너 */
const SectionCard: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

/** 필드형 카드 (라벨 + 값) */
const FieldCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.fieldCard}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value}</Text>
  </View>
);

function formatDate(unixTime?: number): string {
  if (!unixTime) return "—";
  const date = new Date(unixTime * 1000);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
function formatPremium(wei: number): string {
  return `${wei / 1e18} BNB`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    paddingHorizontal: spacing * 2, // 20
    paddingTop: spacing * 2,
    paddingBottom: spacing * 6,
  },

  titleWrap: {
    marginBottom: spacing,
  },
  title: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title,       // 20
    fontWeight: typography.weight.bold,    // 700
    color: colors.text,
    marginBottom: spacing / 2,
  },
  metaMuted: {
    fontFamily: typography.family.base,
    fontSize: typography.size.detail,      // 13
    color: colors.textMuted,
  },

  description: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body,        // 18
    color: colors.text,
    lineHeight: typography.size.body + 6,
    marginBottom: spacing,
  },
  divider: {
    height: RNStyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginBottom: spacing * 1.6,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius,                  // 16
    paddingVertical: spacing * 1.4,        // 14
    paddingHorizontal: spacing * 1.6,      // 16
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginBottom: spacing * 1.2,
  },
  cardTitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title,       // 20
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing * 0.8,           // 8
  },
  bulletDot: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body,
    color: colors.textMuted,
    marginRight: spacing,
    lineHeight: typography.size.body + 2,
  },
  bulletText: {
    flex: 1,
    fontFamily: typography.family.base,
    fontSize: typography.size.card,        // 17
    color: colors.textMuted,
    lineHeight: typography.size.card + 6,
  },

  fieldCard: {
    backgroundColor: colors.surface,
    borderRadius: radius,
    paddingVertical: spacing * 1.2,
    paddingHorizontal: spacing * 1.6,
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginBottom: spacing * 1.6,
  },
  fieldLabel: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,        // 17
    color: colors.textMuted,
    marginBottom: spacing * 0.6,
  },
  fieldValue: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body,        // 18
    color: colors.text,
  },

  bidsHeader: {
    marginTop: spacing * 1.6,
    marginBottom: spacing,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bidsTitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,        // 17
    color: colors.text,
  },
  viewAll: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,        // 17
    color: colors.primary,
  },

  emptyText: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing * 2,
  },
});
