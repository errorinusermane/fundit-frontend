// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CommonButton from "../components/CommonButton";
import LoginModal from "../components/LoginModal";
import { colors, spacing, typography } from "../styles";
import { UserRole } from "../types/user";
import { useUserStore } from "../store/userStore";
import { useNavigation } from "@react-navigation/native";
import { StackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axiosInstance from "../api/axios";

export function LoginPage() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const { user, token, setUser, setWalletConnected } = useUserStore();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const handleSelectRole = async (selected: UserRole) => {
    const tokenToUse = token || globalThis.authToken;

    console.log("🔍 token in store:", token);
    console.log("🔍 token in globalThis:", globalThis.authToken);
    console.log("🔍 tokenToUse:", tokenToUse);

    if (tokenToUse) {
      // ✅ 인터셉터에서 쓸 수 있도록 전역 토큰 설정
      globalThis.authToken = tokenToUse;

      try {
        const res = await axiosInstance.get("/auth/verify");
        console.log("✅ /auth/verify 응답:", res.data);
        console.log("✅ 서버에서 받은 token:", res.data.token);

        const verifiedUser = res.data.user;
        setUser(verifiedUser, tokenToUse);

        if (verifiedUser.wallet) {
          setWalletConnected(true);
        }

        if (verifiedUser.role === selected) {
          navigation.navigate("ProposalList");
          return;
        }
      } catch (err) {
        console.error("❌ /auth/verify 실패:", err);
      }
    } else {
      console.log("⚠️ 토큰 없음, 모달로 진행");
    }

    // 토큰이 없거나 role이 다르면 → 모달
    setRole(selected);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fundit에 오신 것을 환영합니다</Text>
      <Text style={styles.subtitle}>역할을 선택해 로그인하세요</Text>

      <CommonButton
        title="Log in as Individual"
        onPress={() => handleSelectRole("user")}
        role="user"
        style={styles.button}
      />

      <CommonButton
        title="Log in as Insurer"
        onPress={() => handleSelectRole("company")}
        role="company"
        style={styles.button}
      />

      {isModalVisible && role && (
        <LoginModal role={role} onClose={() => setModalVisible(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.muted,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  button: {
    marginTop: spacing.md,
    alignSelf: "stretch",
  },
});
