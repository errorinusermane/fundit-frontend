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
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: "row",
  },
  tabBtn: {
    flex: 1, // 화면의 절반 차지
    alignItems: "center", // 가운데 정렬
    paddingVertical: u * 1.6,
  },
  tabText: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title,
    fontWeight: typography.weight.medium,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: typography.weight.bold,
  },
  activeBar: {
    height: 2,
    marginTop: u * 1.6,
    backgroundColor: colors.primary,
    borderRadius: 2,
    width: "70%", // 절반 폭 안에서 중앙에 보이도록
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
});

