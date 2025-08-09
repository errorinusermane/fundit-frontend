import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../navigation/AppNavigator";
import { useUserStore } from "../store/userStore";
import { colors, spacing, typography, radius, shadows } from "../styles";
import AlertMessage from "../components/AlertMessage";

export function MyPage() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { user } = useUserStore();

  if (!user) return null;

  const isUser = user.role === "user";
  const isCompany = user.role === "company";

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Page</Text>

      <View style={styles.profileBox}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Wallet</Text>
        <Text style={styles.value}>{user.id}</Text>
      </View>

      <Text style={styles.dashboard}>My Dashboard</Text>

      {isUser && (
        <>
          <MenuItem label="Proposals" onPress={() => navigation.navigate("MyProposals")} />
          <MenuItem label="Contracts" onPress={() => navigation.navigate("MyContracts")} />
          <MenuItem label="Rewards" onPress={() => navigation.navigate("Rewards")} />
          <MenuItem label="General" onPress={() => {}} disabled />
        </>
      )}

      {isCompany && (
        <>
          <MenuItem label="Bids" onPress={() => navigation.navigate("MyBids")} />
          <MenuItem label="Contracts" onPress={() => navigation.navigate("MyContracts")} />
          <MenuItem label="Rewards" onPress={() => {}} disabled />
          <AlertMessage
            message="⚠️ 기업 계정은 리워드를 수령할 수 없습니다."
            type="warning"
          />
          <MenuItem label="General" onPress={() => {}} disabled />
        </>
      )}
    </View>
  );
}

function MenuItem({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  header: {
    fontSize: typography.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  profileBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  label: {
    fontSize: typography.small,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  dashboard: {
    fontSize: typography.subtitle,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  menuItem: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    ...shadows.soft,
  },
  menuLabel: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  disabled: {
    backgroundColor: colors.border,
  },
});
