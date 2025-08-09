// app/components/LoginModal.tsx
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
import { requestMagicLink } from "../api/auth";
import { UserRole } from "../types/user";
import { colors, spacing, typography, radius, shadows } from "../styles";

interface LoginModalProps {
  role: UserRole;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ role, onClose }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendLink = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      await requestMagicLink({ email, role });
      setSent(true);
    } catch (err: any) {
      setErrorMsg("메일 전송에 실패했습니다. 다시 시도해주세요.");
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
              {role === "user" ? "개인 로그인" : "보험사 로그인"}
            </Text>
            <Text style={styles.label}>이메일 입력</Text>
            <TextInput
              placeholder="example@domain.com"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />

            <CommonButton
              title="Magic Link 전송"
              onPress={handleSendLink}
              role={role}
              loading={loading}
              disabled={!email.includes("@")}
            />

            {sent && (
              <AlertMessage
                type="success"
                message="이메일이 전송되었습니다. 받은 편지함을 확인해주세요."
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

export default LoginModal;
