// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
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
  const { token, setUser, setWalletConnected } = useUserStore();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const handleSelectRole = async (selected: UserRole) => {
    const tokenToUse = token || globalThis.authToken;

    if (tokenToUse) {
      globalThis.authToken = tokenToUse;
      try {
        const res = await axiosInstance.get("/auth/verify");
        const verifiedUser = res.data.user;
        setUser(verifiedUser, tokenToUse);
        if (verifiedUser.wallet) setWalletConnected(true);
        if (verifiedUser.role === selected) {
          navigation.navigate("ProposalList");
          return;
        }
      } catch (err) {
        console.error("❌ /auth/verify 실패:", err);
      }
    }
    setRole(selected);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} pointerEvents="box-none">
        {/* 로고 이미지 */}
        <Image
          source={require("../assets/Fundit.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Blockchain-based Insurance Platform</Text>
      </View>

      <View style={styles.actions}>
        <CommonButton
          title="Log in as individual"
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
      </View>

      <View style={styles.footer} pointerEvents="box-none">
        <Text style={styles.hello}>Happy to see you again!</Text>
        <Pressable onPress={() => {}} accessibilityRole="link">
          <Text style={styles.link}>Drop us a message</Text>
        </Pressable>
      </View>

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
    paddingHorizontal: spacing * 2,
    justifyContent: "center",
  },
  header: {
    marginTop: spacing * 13,
    alignItems: "center",
    marginBottom: spacing * 4,
    zIndex: 0, 
  },
  logo: {
    width: 150,
    height: 40,
    marginBottom: spacing * 2,
  },
  subtitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.toggle,
    color: colors.primary,
    textAlign: "center",
  },
  actions: {
    alignItems: "stretch",
    zIndex: 10,
  },
  button: {
    backgroundColor: colors.login,
    alignSelf: "stretch",
    marginHorizontal: 0,
  },
  footer: {
    marginTop: spacing * 16,
    alignItems: "center",
    zIndex: 0, 
  },
  hello: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,
    color: colors.textMuted,
    marginBottom: spacing,
  },
  link: {
    fontFamily: typography.family.base,
    fontSize: typography.size.toggle,
    color: colors.primary,
  },
});
