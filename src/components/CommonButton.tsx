// src/components/CommonButton.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors, spacing, typography, radius } from "../styles";

type ButtonRole = "user" | "company" | "default";

interface CommonButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  role?: ButtonRole;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  textStyle,
  role = "default",
}) => {
  // 이전 로직 유지: 역할별 색상 분기 함수는 남겨두되,
  // 디자인 토큰에 맞춰 실제 색은 토큰만 사용.
  const getBackgroundColor = () => {
    if (disabled) return colors.divider;             // 비활성: 라인 톤
    // 현재 팔레트에 secondary 없음 → 두 역할 모두 primary 계열 사용
    return colors.intents.primaryGradient[0];        // solid 폴백(그라데ient 첫 색)
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor(), borderColor: colors.border },
        fullWidth && { alignSelf: "stretch" },
        style,
        textStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.intents.primaryFg} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 60,
    borderRadius: radius,                  // 16
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing * 2,        // 20
    marginVertical: spacing,               // 10
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    color: colors.intents.primaryFg,       // #fff
    fontSize: typography.size.title,        // 18
    fontWeight: typography.weight.bold,    // 700
    fontFamily: typography.family.base,
  },
});

export default CommonButton;
