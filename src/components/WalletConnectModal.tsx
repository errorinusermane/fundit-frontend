import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet as RNStyleSheet,
} from "react-native";
import CommonButton from "./CommonButton";
import AlertMessage from "./AlertMessage";
import { colors, spacing, typography, radius } from "../styles";
import { connectWallet } from "../api/auth";

interface WalletConnectModalProps {
  email: string;
  role: "user" | "company";
  onClose: () => void;
  onSuccess?: (walletAddress: string) => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  email,
  role,
  onClose,
  onSuccess,
}) => {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleConnect = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await connectWallet({ email, wallet });
      globalThis.authToken = res.token;
      setSuccess(true);
      onSuccess?.(wallet);
    } catch {
      setErrorMsg("지갑 연결에 실패했습니다. 올바른 주소인지 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  const title =
    role === "user" ? "Connect wallet (individual)" : "Connect wallet (insurer)";

  return (
    <Modal transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.center}
        >
          {/* 안쪽 클릭은 닫히지 않게 */}
          <Pressable style={styles.card} onPress={() => {}}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.caption}>Link your wallet address to continue.</Text>

            <Text style={styles.label}>Wallet address</Text>
            <TextInput
              placeholder="0x..."
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              value={wallet}
              onChangeText={setWallet}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />

            <View style={{ marginTop: spacing * 1.2 }}>
              <CommonButton
                title="Connect wallet"
                onPress={handleConnect}
                loading={loading}
                role={role}
                disabled={!wallet.startsWith("0x") || wallet.length !== 42}
                fullWidth
              />
            </View>

            {success && (
              <View style={{ marginTop: spacing }}>
                <AlertMessage type="success" message="지갑이 성공적으로 연결되었습니다!" />
              </View>
            )}
            {errorMsg !== "" && (
              <View style={{ marginTop: spacing }}>
                <AlertMessage type="error" message={errorMsg} />
              </View>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing * 2, // 20
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius, // 16
    paddingVertical: spacing * 2,   // 20
    paddingHorizontal: spacing * 2, // 20
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  title: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title,      // 20
    fontWeight: typography.weight.bold,   // 700
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing,                // 10
  },
  caption: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,       // 17
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing * 1.6,          // 16
  },
  label: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,
    color: colors.textMuted,
    marginBottom: spacing * 0.6,          // 6
  },
  input: {
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius,
    paddingHorizontal: spacing * 1.6,     // 16
    paddingVertical: spacing * 1.2,       // 12
    marginBottom: spacing * 1.6,
    fontFamily: typography.family.base,
    fontSize: typography.size.body,       // 18
    backgroundColor: colors.background,
    color: colors.text,
  },
});

export default WalletConnectModal;
