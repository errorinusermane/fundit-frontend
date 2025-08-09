import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
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

import { colors, spacing, typography } from "../styles";

export function ProposalDetailPage() {
  const route = useRoute<RouteProp<StackParamList, "ProposalDetail">>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { user } = useUserStore();

  const [proposal, setProposal] = useState<Proposal & { remainingTime: number } | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);

  const proposalId = route.params.proposalId;

  useEffect(() => {
    if (proposalId) {
      loadProposal();
    }
  }, [proposalId]);

  const loadProposal = async () => {
    try {
      const detail = await getProposalById(proposalId);
      const bids = await getBidsByProposal(proposalId);
      setProposal(detail);
      setBids(bids);
    } catch (err) {
      console.error("❌ Failed to load detail:", err);
    }
  };

  const handleSubmitBid = () => {
    navigation.navigate("SubmitBid", { proposalId });
  };

  const handleBidPress = (bid: Bid) => {
    navigation.navigate("BidDetail", { bid }); // ✅ bid 객체 전체 넘김
  };

  if (!proposal) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.title}>{proposal.title}</Text>
      <Text style={styles.description}>{proposal.description}</Text>

      <Section title="Mandatory Requirements" items={proposal.mandatoryRequirements} />
      <Section title="Enrollment Conditions" items={proposal.enrollmentConditions} />
      <Section title="Optional Features" items={proposal.optionalFeatures} />

      <View style={styles.metaBox}>
        <Text style={styles.metaText}>Start Date: {formatDate(proposal.desiredStartDate)}</Text>
        <Text style={styles.metaText}>
          Premium Range: {formatPremium(proposal.minPremium)} ~ {formatPremium(proposal.maxPremium)}
        </Text>
        <Text style={styles.metaText}>Remaining Time: {proposal.remainingTime} sec</Text>
        <Text style={styles.metaText}>Bid Count: {proposal.bidCount}</Text>
      </View>

      <Text style={styles.sectionTitle}>Bids</Text>
      {bids.length === 0 ? (
        <Text style={styles.emptyText}>No bids submitted yet.</Text>
      ) : (
        bids.map((bid) => (
          <BidCard key={bid.bidId} bid={bid} onPress={() => handleBidPress(bid)} />
        ))
      )}

      <CommonButton
        title="Submit Bid"
        role="company"
        onPress={handleSubmitBid}
        disabled={user?.role !== "company"}
      />
    </ScrollView>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, idx) => (
        <Text key={idx} style={styles.bulletItem}>• {item}</Text>
      ))}
    </View>
  );
}

function formatDate(unixTime: number): string {
  const date = new Date(unixTime * 1000);
  return date.toLocaleDateString();
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
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  title: {
    fontSize: typography.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.body,
    color: colors.text,
    marginBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.subtitle,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  bulletItem: {
    fontSize: typography.body,
    color: colors.text,
    marginLeft: spacing.sm,
    marginBottom: spacing.xs,
  },
  metaBox: {
    marginVertical: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaText: {
    fontSize: typography.small,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: typography.body,
    color: colors.muted,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});
