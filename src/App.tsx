// app/App.tsx
import React, { useEffect, useState } from "react";
import { Linking, SafeAreaView, StatusBar } from "react-native";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import AppNavigator, { StackParamList } from "./navigation/AppNavigator";
import { WalletProvider, useWallet } from "./contexts/WalletContext";
import { verifyMagicToken } from "./api/auth";
import { useUserStore } from "./store/userStore";
import WalletConnectModal from "./components/WalletConnectModal";

function InnerApp({
  navigationRef,
  checkingToken,
  setCheckingToken,
  showWalletModal,
  setShowWalletModal,
  userEmail,
  setUserEmail,
  userRole,
  setUserRole,
}: {
  navigationRef: ReturnType<typeof useNavigationContainerRef<StackParamList>>;
  checkingToken: boolean;
  setCheckingToken: React.Dispatch<React.SetStateAction<boolean>>;
  showWalletModal: boolean;
  setShowWalletModal: React.Dispatch<React.SetStateAction<boolean>>;
  userEmail: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  userRole: "user" | "company";
  setUserRole: React.Dispatch<React.SetStateAction<"user" | "company">>;
}) {
  const { connectWallet } = useWallet();
  const { setUser, setWalletConnected } = useUserStore();

  useEffect(() => {
    const checkToken = async () => {
      const url = await Linking.getInitialURL();
      const tokenParam = url ? new URL(url).searchParams.get("token") : null;

      if (!tokenParam) {
        setCheckingToken(false);
        return;
      }

      try {
        const { token, user } = await verifyMagicToken(tokenParam);
        globalThis.authToken = token;
        setUser(user, token);

        if (!user.id || user.id.trim() === "") {
          setUserEmail(user.email);
          setUserRole(user.role);
          setShowWalletModal(true);
        } else {
          setWalletConnected(true);
          connectWallet(user.id);
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

  if (checkingToken) return null;

  return (
    <>
      <AppNavigator />
      {showWalletModal && (
        <WalletConnectModal
          email={userEmail}
          role={userRole}
          onClose={() => setShowWalletModal(false)}
          onSuccess={(walletAddress) => {
            setWalletConnected(true);
            connectWallet(walletAddress);
            navigationRef.navigate("ProposalList");
          }}
        />
      )}
    </>
  );
}

export default function App() {
  const navigationRef = useNavigationContainerRef<StackParamList>();
  const [checkingToken, setCheckingToken] = useState(true);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<"user" | "company">("user");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <WalletProvider>
        <NavigationContainer ref={navigationRef}>
          <InnerApp
            navigationRef={navigationRef}
            checkingToken={checkingToken}
            setCheckingToken={setCheckingToken}
            showWalletModal={showWalletModal}
            setShowWalletModal={setShowWalletModal}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            userRole={userRole}
            setUserRole={setUserRole}
          />
        </NavigationContainer>
      </WalletProvider>
    </SafeAreaView>
  );
}
