// app/App.tsx
import React, { useEffect, useState } from "react";
import { Linking, SafeAreaView, StatusBar } from "react-native";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import AppNavigator, { StackParamList } from "./navigation/AppNavigator";
import { WalletProvider } from "./contexts/WalletContext";

function InnerApp({
  checkingToken,
  setCheckingToken,
}: {
  checkingToken: boolean;
  setCheckingToken: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useEffect(() => {
    const initAuth = async () => {
      const url = await Linking.getInitialURL();
      const tokenParam = url ? new URL(url).searchParams.get("token") : null;

      if (tokenParam) {
        globalThis.authToken = tokenParam; // ✅ 토큰만 저장
      }

      setCheckingToken(false); // 바로 화면 진입
    };

    initAuth();
  }, []);

  if (checkingToken) return null;

  return <AppNavigator />;
}

export default function App() {
  const [checkingToken, setCheckingToken] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <WalletProvider>
        <NavigationContainer>
          <InnerApp
            checkingToken={checkingToken}
            setCheckingToken={setCheckingToken}
          />
        </NavigationContainer>
      </WalletProvider>
    </SafeAreaView>
  );
}
