import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ViewStyle,
  StyleSheet as RNStyleSheet,
} from "react-native";
import { colors, spacing, typography, radius } from "../styles";

export type AlertType = "success" | "error" | "info" | "warning";

interface AlertMessageProps {
  message: string;
  type?: AlertType;
  onClose?: () => void;
  duration?: number; // ms
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  type = "info",
  onClose,
  duration = 3000,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();

    if (duration && onClose) {
      const t = setTimeout(onClose, duration);
      return () => clearTimeout(t);
    }
  }, [duration, onClose, opacity]);

  const palette = paletteByType[type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: palette.bg,
          borderColor: colors.border,
          borderWidth: RNStyleSheet.hairlineWidth,
          opacity,
        } as any,
      ]}
    >
      <Text style={[styles.message, { color: palette.fg }]}>{message}</Text>
      {onClose && (
        <TouchableOpacity onPress={onClose} accessibilityRole="button">
          <Text style={[styles.close, { color: palette.fg }]}>×</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing * 1.2,   // 12
    paddingHorizontal: spacing * 1.6, // 16
    marginHorizontal: spacing * 1.6,  // 16
    borderRadius: radius,             // 16
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing * 2,           // 20
  },
  message: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,        // 17
    fontWeight: typography.weight.medium,  // 600
    flex: 1,
    paddingRight: spacing,                 // 10
  },
  close: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title,       // 20
    fontWeight: typography.weight.bold,    // 700
    lineHeight: typography.size.title + 2,
  },
});

// 서식 팔레트만 사용
const paletteByType: Record<
  AlertType,
  { bg: string; fg: string }
> = {
  success: {
    bg: colors.tags.active.bg,      // #132E2C
    fg: colors.tags.active.fg,      // #25D980
  },
  error: {
    bg: colors.tags.cancelled.bg,   // #30202E
    fg: colors.tags.cancelled.fg,   // #F39C96
  },
  info: {
    bg: colors.surface,             // #10151F
    fg: colors.primary,             // #14EAFF
  },
  warning: {
    bg: colors.tags.closed.bg,      // #2C2E44
    fg: colors.tags.closed.fg,      // #C4CCD7
  },
};

export default AlertMessage;
