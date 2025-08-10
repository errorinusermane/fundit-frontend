import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { useUserStore } from "../../store/userStore";
import { getRewardHistory, getClaimedReward, claimReward } from "../../api/token";
import { RewardHistoryItem, ClaimedReward } from "../../types/token";
import RewardItem from "../../components/RewardItem";
import CommonButton from "../../components/CommonButton";
import { colors, spacing, typography, radius } from "../../styles";
import AlertMessage from "../../components/AlertMessage";

export function RewardsPage() {
  const { user } = useUserStore();
  const [rewards, setRewards] = useState<RewardHistoryItem[]>([]);
  const [claimed, setClaimed] = useState<ClaimedReward | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== "user") return;
    if (user?.id) fetchRewards();
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

  // 화면 표시용 합계(로직 변경 아님: 이미 버튼에서 계산하던 값)
  const claimable = useMemo(
    () => rewards.reduce((acc, r) => acc + parseFloat(r.amount), 0),
    [rewards]
  );

  if (user?.role !== "user") {
    return (
      <View style={styles.container}>
        <AlertMessage message="⚠️ 개인 사용자만 리워드를 수령할 수 있습니다." type="warning" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {/* 헤더 */}
      <Text style={styles.heroTitle}>000 Total Reward!</Text>
      <Text style={styles.heroSubtitle}>View your total reward balance!</Text>

      {/* 지갑 카드 (단색으로 그라데이션 근사: intents.primaryGradient의 짙은 쪽 사용) */}
      <View style={styles.walletCard}>
        <View>
          <Text style={styles.walletTitle}>BNB Wallet</Text>
          {!!user?.wallet && (
            <Text style={styles.walletAddr} numberOfLines={1} ellipsizeMode="middle">
              {user.wallet}
            </Text>
          )}
          <Text style={styles.walletBalance}>
            ${claimable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
        </View>

        <Pressable style={styles.sendBtn} onPress={() => {}}>
          <Text style={styles.sendBtnText}>Send →</Text>
        </Pressable>
      </View>

      {/* 섹션 타이틀 */}
      <Text style={styles.sectionTitle}>Reward history</Text>

      {/* 리스트 */}
      {rewards.length === 0 ? (
        <Text style={styles.emptyText}>아직 수령 가능한 리워드가 없습니다.</Text>
      ) : (
        rewards.map((item, idx) => <RewardItem key={idx} reward={item} />)
      )}

      {/* 수령 버튼 */}
      <CommonButton
        title="Claim Reward"
        role="user"
        onPress={handleClaim}
        disabled={loading || rewards.length === 0}
        loading={loading}
        style={{ marginTop: spacing * 2 }}
      />

      {/* 누적 수령 정보 */}
      {claimed && (
        <Text style={styles.claimedText}>
          Claimed Total: {parseFloat(claimed.claimedAmount).toFixed(4)} FDT
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    padding: spacing * 2,
    paddingBottom: spacing * 8,
  },

  // 헤더
  heroTitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.nav, // 25
    color: colors.text,
    marginBottom: spacing * 0.5,
  },
  heroSubtitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card, // 17
    color: colors.textMuted,
    marginBottom: spacing * 2,
  },

  // 지갑 카드
  walletCard: {
    backgroundColor: "#0F6CC9", // intents.primaryGradient의 짙은 색으로 근사
    borderRadius: radius,
    padding: spacing * 2,
    marginBottom: spacing * 3,
  },
  walletTitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title, // 20
    color: colors.text,
    marginBottom: spacing * 0.4,
  },
  walletAddr: {
    fontFamily: typography.family.mono,
    fontSize: typography.size.detail, // 13
    color: colors.textMuted,
    marginBottom: spacing * 1.2,
  },
  walletBalance: {
    fontFamily: typography.family.base,
    fontSize: 28, // 서식엔 없지만 헤더 대비 강조용 근사값
    color: colors.text,
    marginBottom: spacing * 1.5,
  },
  sendBtn: {
    alignSelf: "flex-start",
    backgroundColor: colors.text, // 카드 안에서 밝게
    borderRadius: radius,
    paddingVertical: spacing * 0.8,
    paddingHorizontal: spacing * 1.4,
  },
  sendBtnText: {
    fontFamily: typography.family.base,
    fontSize: typography.size.toggle, // 16
    color: "#0F6CC9",
  },

  // 섹션 타이틀
  sectionTitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title, // 20
    color: colors.text,
    marginBottom: spacing * 1.2,
  },

  // 기타
  claimedText: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body, // 18
    color: colors.text,
    marginTop: spacing * 2,
  },
  emptyText: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body,
    color: colors.textMuted,
    textAlign: "center",
    marginVertical: spacing * 3,
  },
});
