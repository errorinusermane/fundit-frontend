import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StyleSheet as RNStyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../store/userStore";
import { getBidsByCompany } from "../../api/bid";
import { Bid } from "../../types/bid";
import SearchBox from "../../components/SearchBox";
import CommonButton from "../../components/CommonButton";
import BidCard from "../../components/BidCard";
import AlertMessage from "../../components/AlertMessage";
import { StackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, spacing, typography, radius } from "../../styles";

export function MyBidsPage() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { user } = useUserStore();

  const [bids, setBids] = useState<Bid[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user?.role === "company") fetchBids();
  }, [user]);

  const fetchBids = async () => {
    try {
      const data = await getBidsByCompany(user!.id);
      setBids(data);
    } catch (err) {
      console.error("❌ Failed to fetch my bids:", err);
    }
  };

  const filteredBids = bids.filter((bid) =>
    bid.planTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (user?.role !== "company") {
    return (
      <View style={styles.alertContainer}>
        <AlertMessage message="기업 전용 페이지입니다." type="warning" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bids</Text>
      </View>

      {/* 검증 배지 */}
      <View style={styles.verifyRow}>
        <Text style={styles.verifyLabel}>Insurer Verification</Text>
        <View style={styles.verifyPill}>
          <Text style={styles.verifyPillText}>Verified</Text>
        </View>
      </View>

      {/* 상단 CTA 버튼 */}
      <CommonButton
        title="Submit Bid"
        role="company"
        onPress={() => navigation.navigate("SubmitBid", { proposalId: 0 /* 선택 방식은 추후 */ })}
        fullWidth
        style={styles.cta}
      />

      {/* 섹션 타이틀 + 칩(퍼블리싱용, 로직 연결 없음) */}
      <Text style={styles.sectionTitle}>Bid Status</Text>
      <View style={styles.chipRow}>
        <TouchableOpacity style={[styles.chip, styles.chipActive]}>
          <Text style={[styles.chipText, styles.chipTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chip}>
          <Text style={styles.chipText}>ACTIVE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chip}>
          <Text style={styles.chipText}>REJECTED</Text>
        </TouchableOpacity>
      </View>

      {/* 검색 */}
      <View style={styles.searchWrap}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} placeholder="Plan 제목으로 검색" />
      </View>

      {/* 리스트 */}
      <FlatList
        data={filteredBids}
        keyExtractor={(item) => item.bidId.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <BidCard bid={item} onPress={() => navigation.navigate("BidDetail", { bid: item })} />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>제출한 입찰이 없습니다.</Text>}
      />
    </View>
  );
}

const CHIP_H = 36;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: spacing * 2,
    paddingTop: spacing * 2,
    paddingBottom: spacing * 1.2,
  },
  title: {
    fontFamily: typography.family.base,
    fontSize: typography.size.nav, // 25
    color: colors.text,
  },

  // 검증 배지
  verifyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius,
    paddingHorizontal: spacing * 1.6,
    paddingVertical: spacing * 1.2,
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginHorizontal: spacing * 2,
  },
  verifyLabel: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card, // 17
    color: colors.text,
  },
  verifyPill: {
    paddingHorizontal: spacing * 1.2,
    paddingVertical: spacing * 0.6,
    borderRadius: 999,
    backgroundColor: colors.border,
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  verifyPillText: {
    fontFamily: typography.family.base,
    fontSize: typography.size.toggle, // 16
    color: colors.primary,
  },

  // CTA 버튼 (이미지의 밝은 강조 버튼 느낌)
  cta: {
    marginTop: spacing * 1.2,
    marginHorizontal: spacing * 2,
    borderRadius: radius,
  },

  sectionTitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.title, // 20
    color: colors.text,
    marginTop: spacing * 2,
    marginHorizontal: spacing * 2,
    marginBottom: spacing,
  },

  chipRow: {
    flexDirection: "row",
    gap: spacing,
    paddingHorizontal: spacing * 2,
  },
  chip: {
    height: CHIP_H,
    paddingHorizontal: spacing * 1.6,
    borderRadius: CHIP_H / 2,
    backgroundColor: colors.surface,
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: "#5C637080", // 서식엔 없음 → 비슷한 눌림 톤(반투명 회색)
  },
  chipText: {
    fontFamily: typography.family.base,
    fontSize: typography.size.toggle, // 16
    fontWeight: typography.weight.medium,
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.text,
  },

  searchWrap: {
    paddingHorizontal: spacing * 2,
    paddingTop: spacing * 1.6,
  },

  listContainer: {
    paddingHorizontal: spacing * 2,
    paddingBottom: spacing * 8,
    gap: spacing,
  },

  emptyText: {
    textAlign: "center",
    marginTop: spacing * 3,
    fontFamily: typography.family.base,
    fontSize: typography.size.body, // 18
    color: colors.textMuted,
  },

  alertContainer: {
    flex: 1,
    justifyContent: "center",
    padding: spacing * 2,
    backgroundColor: colors.background,
  },
});
