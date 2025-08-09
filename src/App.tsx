// app/App.tsx
import React, { useEffect, useState } from "react";
import { Linking, SafeAreaView, StatusBar } from "react-native";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import AppNavigator, { StackParamList } from "./navigation/AppNavigator";
import { useWallet, WalletProvider } from "./contexts/WalletContext";
import { verifyMagicToken } from "./api/auth";
import { useUserStore } from "./store/userStore";
import WalletConnectModal from "./components/WalletConnectModal";

export default function App() {
  const navigationRef = useNavigationContainerRef<StackParamList>();
  const [checkingToken, setCheckingToken] = useState(true);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<"user" | "company">("user");

  const { connectWallet } = useWallet();
  const { setUser, setWalletConnected } = useUserStore();

  useEffect(() => {
    const checkToken = async () => {
      const url = await Linking.getInitialURL();
      const tokenParam = url ? new URL(url).searchParams.get("token") : null;

      if (!tokenParam) return setCheckingToken(false);

      try {
        const { token, user } = await verifyMagicToken(tokenParam);
        globalThis.authToken = token;
        setUser(user, token);

        // ✅ 지갑 연결 여부 판단
        if (!user.id || user.id.trim() === "") {
          setUserEmail(user.email);
          setUserRole(user.role);
          setShowWalletModal(true);
        } else {
          setWalletConnected(true);
          connectWallet(user.id); // WalletContext까지 반영
          navigationRef.navigate("ProposalList");
        }
      } catch (err) {
        console.error("❌ verifyMagicToken failed:", err);
      } finally {
        setCheckingToken(false);
      }
    };

    checkToken();
  }, []);

  console.log("checkingToken:", checkingToken);
  if (checkingToken) return null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <WalletProvider>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
        </NavigationContainer>

        {showWalletModal && (
          <WalletConnectModal
            email={userEmail}
            role={userRole}
            onClose={() => setShowWalletModal(false)}
            onSuccess={() => {
              setWalletConnected(true);
              connectWallet(userEmail); // context에 반영
              navigationRef.navigate("ProposalList");
            }}
          />
        )}
      </WalletProvider>
    </SafeAreaView>
  );
}
