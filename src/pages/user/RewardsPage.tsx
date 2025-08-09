import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { useUserStore } from "../../store/userStore";
import { getRewardHistory, getClaimedReward, claimReward } from "../../api/token";
import { RewardHistoryItem, ClaimedReward } from "../../types/token";
import RewardItem from "../../components/RewardItem";
import CommonButton from "../../components/CommonButton";
import { colors, spacing, typography } from "../../styles";
import AlertMessage from "../../components/AlertMessage";

export function RewardsPage() {
  const { user } = useUserStore();
  const [rewards, setRewards] = useState<RewardHistoryItem[]>([]);
  const [claimed, setClaimed] = useState<ClaimedReward | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== "user") return;
    if (user?.id) {
      fetchRewards();
    }
  }, [user?.id]);

  const fetchRewards = async () => {
    try {
      const [history, claimedData] = await Promise.all([
        getRewardHistory(user!.id),
        getClaimedReward(user!.id),
      ]);
      setRewards(history);
      setClaimed(claimedData);
    } catch (err) {
      console.error("❌ Failed to fetch rewards:", err);
    }
  };

  const handleClaim = async () => {
    try {
      setLoading(true);
      const amount = rewards.reduce((acc, r) => acc + parseFloat(r.amount), 0);
      const txHash = await claimReward({ user: user!.id, amount: BigInt(amount * 1e18) });
      Alert.alert("✅ 리워드 수령 완료", `TX: ${txHash}`);
      fetchRewards();
    } catch (err) {
      console.error("❌ Claim failed:", err);
      Alert.alert("수령 실패", "나중에 다시 시도해주세요");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "user") {
    return (
      <View style={styles.container}>
        <AlertMessage message="⚠️ 개인 사용자만 리워드를 수령할 수 있습니다." type="warning" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.header}>Claimable Rewards</Text>

      {claimed && (
        <Text style={styles.claimedText}>
          Claimed Total: {parseFloat(claimed.claimedAmount).toFixed(4)} FDT
        </Text>
      )}

      {rewards.length === 0 ? (
        <Text style={styles.emptyText}>아직 수령 가능한 리워드가 없습니다.</Text>
      ) : (
        rewards.map((item, idx) => <RewardItem key={idx} reward={item} />)
      )}

      <CommonButton
        title="Claim Reward"
        role="user"
        onPress={handleClaim}
        disabled={loading || rewards.length === 0}
        loading={loading}
      />
    </ScrollView>
  );
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
  header: {
    fontSize: typography.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  claimedText: {
    fontSize: typography.body,
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.body,
    color: colors.muted,
    textAlign: "center",
    marginVertical: spacing.lg,
  },
});
