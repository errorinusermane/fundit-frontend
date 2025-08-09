import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../styles";

interface PageHeaderProps {
  current: "Explore" | "MyPage";
  onNavigate: (page: "ProposalList" | "MyPage") => void;
}

export default function PageHeader({ current, onNavigate }: PageHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onNavigate("ProposalList")}>
        <Text style={[styles.text, current === "Explore" && styles.activeText]}>
          Explore
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate("MyPage")}>
        <Text style={[styles.text, current === "MyPage" && styles.activeText]}>
          MyPage
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  text: {
    fontSize: typography.subtitle,
    fontWeight: typography.fontWeight.medium,
    color: colors.muted,
  },
  activeText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});
