import React from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { RewardHistoryItem } from "../types/token";
import { colors, spacing, typography, radius } from "../styles";

interface RewardItemProps {
  reward: RewardHistoryItem;
}

const RewardItem: React.FC<RewardItemProps> = ({ reward }) => {
  const dateStr = new Date(reward.createdAt).toLocaleDateString();

  const handleTxPress = () => {
    const url = `https://bscscan.com/tx/${reward.txHash}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* 왼쪽 아바타 느낌의 원형 아이콘 */}
      <View style={styles.avatar}>
        <Text style={styles.avatarEmoji}>👤</Text>
      </View>

      {/* 가운데 텍스트 영역 */}
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          Plan Title
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.date}>{dateStr}</Text>
          <TouchableOpacity onPress={handleTxPress}>
            <Text style={styles.link} numberOfLines={1} ellipsizeMode="middle">
              {reward.txHash}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 오른쪽 금액 */}
      <Text style={styles.amount}>
        +{parseFloat(reward.amount).toFixed(2)} FDT
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.border,      // 카드 배경(이미지의 회색 톤에 맞춤)
    borderRadius: radius,
    paddingVertical: spacing * 1.2,
    paddingHorizontal: spacing * 1.5,
    marginBottom: spacing * 1.2,
    borderWidth: 1,
    borderColor: colors.divider,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    // 서식엔 없음 → 유사 톤의 반투명 회색 사용
    backgroundColor: "#C4CCD726", // textMuted의 투명한 버전 느낌
    marginRight: spacing * 1.2,
  },
  avatarEmoji: {
    fontSize: 20,
    color: colors.textMuted,
  },

  center: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body, // 18
    color: colors.text,
    marginBottom: spacing * 0.4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing, // RN 0.71+ 이면 적용, 아니면 marginRight로 대체
  },
  date: {
    fontFamily: typography.family.base,
    fontSize: typography.size.detail, // 13
    color: colors.textMuted,
    marginRight: spacing,
  },
  link: {
    fontFamily: typography.family.mono,
    fontSize: typography.size.detail,
    color: colors.primary,
    maxWidth: "55%",
  },

  amount: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body, // 18
    color: colors.primary,
    fontWeight: typography.weight.bold,
    marginLeft: spacing,
  },
});

export default RewardItem;
