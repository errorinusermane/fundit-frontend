import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../navigation/AppNavigator";
import { useUserStore } from "../store/userStore";
import { colors, spacing, typography, radius } from "../styles";
import AlertMessage from "../components/AlertMessage";

export function MyPage() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { user } = useUserStore();
  if (!user) return null;

  const isUser = user.role === "user";
  const isCompany = user.role === "company";

  const shortAddr = user.wallet
    ? `${user.wallet.slice(0, 6)}...${user.wallet.slice(-4)}`
    : undefined;

  // 이니셜 (닉네임/이메일 앞글자) — 아이콘 대체
  const initial =
    (user.id?.[0] || user.email?.[0] || "U").toUpperCase();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Page</Text>

      {/* Profile (아이콘만) */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          {/* 이모지로 바꾸고 싶으면 아래 줄을 주석 해제하고 initial 라인 제거 */}
          {/* <Text style={styles.avatarEmoji}>👤</Text> */}
          <Text style={styles.avatarInitial}>{initial}</Text>
        </View>
        <Text style={styles.username}>
          {user.id || user.email?.split("@")[0] || "User"}
        </Text>
        {shortAddr && <Text style={styles.addr}>{shortAddr}</Text>}
      </View>

      <Text style={styles.sectionTitle}>Wallet</Text>

      {shortAddr ? (
        <View style={styles.walletCard}>
          <Text style={styles.walletName}>MetaMask</Text>
          <Text style={styles.walletAddr}>{shortAddr}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.addWalletBtn} onPress={() => {}}>
        <Text style={styles.addWalletText}>+ Add Wallet</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { marginTop: spacing * 3 }]}>
        My Dashboard
      </Text>

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
          <AlertMessage message="⚠️ Company accounts cannot receive rewards." type="warning" />
          <MenuItem label="General" onPress={() => {}} disabled />
        </>
      )}
    </View>
  );
}

function MenuItem({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.row, disabled && { opacity: 0.6 }]}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowChevron}>›</Text>
    </TouchableOpacity>
  );
}

const AVATAR_SIZE = 96;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing * 2,
    paddingTop: spacing * 4,
  },
  header: {
    fontFamily: typography.family.base,
    fontSize: typography.size.nav,
    fontWeight: typography.weight.bold,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing * 3,
  },
  profile: {
    alignItems: "center",
    marginBottom: spacing * 3,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.border, // 아이콘 자리 배경
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing * 1.5,
  },
  avatarInitial: {
    fontFamily: typography.family.base,
    fontSize: typography.size.nav,     // 큼직하게
    fontWeight: typography.weight.bold,
    color: colors.textMuted,
  },
  // avatarEmoji: {
  //   fontSize: 42,
  // },
  username: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing / 2,
  },
  addr: {
    fontFamily: typography.family.mono,
    fontSize: typography.size.card,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing * 1.2,
  },
  walletCard: {
    backgroundColor: colors.surface,
    borderRadius: radius,
    paddingVertical: spacing * 1.6,
    paddingHorizontal: spacing * 1.8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginBottom: spacing * 1.6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  walletName: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body,
    color: colors.text,
  },
  walletAddr: {
    fontFamily: typography.family.mono,
    fontSize: typography.size.card,
    color: colors.textMuted,
  },
  addWalletBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing * 1.6,
    marginBottom: spacing * 2,
  },
  addWalletText: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.intents.primaryFg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing * 1.8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  rowLabel: {
    flex: 1,
    fontFamily: typography.family.base,
    fontSize: typography.size.body,
    color: colors.text,
  },
  rowChevron: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body,
    color: colors.textMuted,
  },
});

export default MyPage;
