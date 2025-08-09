import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../styles";

interface SearchBoxProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export default function SearchBox({
  value,
  onChange,
  placeholder = "Search by title...",
}: SearchBoxProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    fontSize: typography.body,
    color: colors.text,
  },
});
