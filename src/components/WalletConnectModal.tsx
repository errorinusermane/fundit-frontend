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
} from "react-native";
import CommonButton from "./CommonButton";
import AlertMessage from "./AlertMessage";

import { colors, radius, shadows, spacing, typography } from "../styles";
import { connectWallet } from "../api/auth";

interface WalletConnectModalProps {
  email: string; // verifyMagicToken 이후 받은 이메일
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
      onSuccess?.(wallet); // 성공 시 콜백
    } catch (err: any) {
      setErrorMsg("지갑 연결에 실패했습니다. 올바른 주소인지 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.centeredView}
        >
          <Pressable style={styles.card} onPress={() => {}}>
            <Text style={styles.title}>
              {role === "user" ? "지갑 주소 연결 (개인)" : "지갑 주소 연결 (보험사)"}
            </Text>

            <Text style={styles.label}>지갑 주소</Text>
            <TextInput
              placeholder="0x..."
              style={styles.input}
              value={wallet}
              onChangeText={setWallet}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />

            <CommonButton
              title="지갑 연결"
              onPress={handleConnect}
              loading={loading}
              role={role}
              disabled={!wallet.startsWith("0x") || wallet.length !== 42}
            />

            {success && (
              <AlertMessage
                type="success"
                message="지갑이 성공적으로 연결되었습니다!"
              />
            )}
            {errorMsg !== "" && (
              <AlertMessage type="error" message={errorMsg} />
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
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    width: "100%",
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.soft,
  },
  title: {
    fontSize: typography.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  label: {
    fontSize: typography.body,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    fontSize: typography.body,
    backgroundColor: colors.background,
    color: colors.text,
  },
});

export default WalletConnectModal;
