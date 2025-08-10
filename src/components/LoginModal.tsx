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
  StyleSheet as RNStyleSheet,
} from "react-native";
import CommonButton from "./CommonButton";
import AlertMessage from "./AlertMessage";
import { requestMagicLink } from "../api/auth";
import { UserRole } from "../types/user";
import { colors, spacing, typography, radius } from "../styles";

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
    } catch {
      setErrorMsg("Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const title = role === "user" ? "Log in as individual" : "Log in as Insurer";

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
            <Text style={styles.caption}>We’ll email you a sign‑in link.</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="example@domain.com"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />

            <View style={{ marginTop: spacing * 1.2 }}>
              <CommonButton
                title="Send Magic Link"
                onPress={handleSendLink}
                role={role}
                loading={loading}
                disabled={!email.includes("@")}
                fullWidth
              />
            </View>

            {sent && (
              <AlertMessage
                type="success"
                message="Email sent. Please check your inbox."
              />
            )}
            {errorMsg !== "" && <AlertMessage type="error" message={errorMsg} />}
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
    fontSize: typography.size.title,       // 20
    fontWeight: typography.weight.bold,    // 700
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing,                 // 10
  },
  caption: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,        // 17
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing * 1.6,           // 16
  },
  label: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,
    color: colors.textMuted,
    marginBottom: spacing * 0.6,           // 6
  },
  input: {
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radius,
    paddingHorizontal: spacing * 1.6,      // 16
    paddingVertical: spacing * 1.2,        // 12
    marginBottom: spacing * 1.6,
    fontFamily: typography.family.base,
    fontSize: typography.size.body,        // 18
    backgroundColor: colors.background,
    color: colors.text,
  },
});

export default LoginModal;
