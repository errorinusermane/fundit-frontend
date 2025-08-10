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
      <View style={styles.tabs}>
        <TouchableOpacity
          accessibilityRole="tab"
          onPress={() => onNavigate("ProposalList")}
          style={styles.tabBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text
            style={[
              styles.tabText,
              current === "Explore" && styles.tabTextActive,
            ]}
          >
            Explore
          </Text>
          {current === "Explore" && <View style={styles.activeBar} />}
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="tab"
          onPress={() => onNavigate("MyPage")}
          style={styles.tabBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text
            style={[
              styles.tabText,
              current === "MyPage" && styles.tabTextActive,
            ]}
          >
            My Page
          </Text>
          {current === "MyPage" && <View style={styles.activeBar} />}
        </TouchableOpacity>
      </View>

      {/* 하단 구분선 */}
      <View style={styles.divider} />
    </View>
  );
}

const u = spacing; // 10

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
  },
  tabs: {
    flexDirection: "row",
    gap: u * 2,
    paddingHorizontal: u * 2.4,
    paddingTop: u * 1.6,
    paddingBottom: u * 1.2,
    alignItems: "flex-end",
  },
  tabBtn: {
    paddingVertical: u * 0.8,
  },
  tabText: {
    fontFamily: typography.family.base,
    fontSize: typography.size.nav, // 25
    fontWeight: typography.weight.medium,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: typography.weight.bold,
  },
  activeBar: {
    height: 2,
    marginTop: u * 0.6,
    backgroundColor: colors.primary,
    borderRadius: 2,
    // 텍스트 폭 느낌만 살리는 고정 길이 (이미지와 유사)
    width: 60,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: u * 2.4, // 이미지처럼 좌측에서만 시작하는 느낌
  },
});
