import React from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { RewardHistoryItem } from "../types/token";
import { colors, spacing, typography, radius, shadows } from "../styles";

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
      <View style={styles.row}>
        <Text style={styles.label}>Amount</Text>
        <Text style={styles.value}>{parseFloat(reward.amount).toFixed(4)} FDT</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{dateStr}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Transaction</Text>
        <TouchableOpacity onPress={handleTxPress}>
          <Text style={styles.link} numberOfLines={1} ellipsizeMode="middle">
            {reward.txHash}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.small,
    color: colors.muted,
  },
  value: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  link: {
    fontSize: typography.body,
    color: colors.primary,
    textDecorationLine: "underline",
    maxWidth: "60%",
  },
});

export default RewardItem;
