import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ViewStyle,
} from "react-native";
import { colors, spacing, typography, radius } from "../styles";

export type AlertType = "success" | "error" | "info" | "warning";

interface AlertMessageProps {
  message: string;
  type?: AlertType;
  onClose?: () => void;
  duration?: number; // ms 단위
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  type = "info",
  onClose,
  duration = 3000,
}) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Animated.View style={[styles.container, stylesByType[type], { opacity }]}>
      <Text style={styles.message}>{message}</Text>
      {onClose && (
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>×</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const baseStyle: ViewStyle = {
  padding: spacing.md,
  marginHorizontal: spacing.md,
  borderRadius: radius.md,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,
  marginTop: spacing.lg,
};

const styles = StyleSheet.create({
  container: {
    ...baseStyle,
  },
  message: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: typography.fontWeight.medium,
    flex: 1,
    paddingRight: spacing.sm,
  },
  close: {
    color: colors.surface,
    fontSize: typography.subtitle,
    fontWeight: "bold",
  },
});

const stylesByType: Record<AlertType, ViewStyle> = {
  success: { backgroundColor: colors.success },
  error: { backgroundColor: colors.danger },
  info: { backgroundColor: colors.primary },
  warning: { backgroundColor: "#f59e0b" },
};

export default AlertMessage;
