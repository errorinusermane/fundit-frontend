import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text, StyleSheet as RNStyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../navigation/AppNavigator";

import SearchBox from "../../components/SearchBox";
import CommonButton from "../../components/CommonButton";
import ProposalCard from "../../components/ProposalCard";
import { colors, spacing, typography, radius } from "../../styles";

import { getProposalsByUser } from "../../api/proposal";
import { Proposal } from "../../types/proposal";
import { useUserStore } from "../../store/userStore";

export function MyProposalsPage() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { user } = useUserStore();

  const [search, setSearch] = useState("");
  const [proposals, setProposals] = useState<(Proposal & { remainingTime: number })[]>([]);

  useEffect(() => {
    if (user?.id) fetchProposals();
  }, [user?.id]);

  const fetchProposals = async () => {
    try {
      const data = await getProposalsByUser(user!.id);
      setProposals(data);
    } catch (err) {
      console.error("❌ Failed to load proposals:", err);
    }
  };

  const filtered = proposals.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCardPress = (proposal: Proposal) => {
    navigation.navigate("ProposalDetail", { proposalId: proposal.id });
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          Share what kind of insurance you need, and get customized offers.
        </Text>

        {user?.role === "user" && (
          <CommonButton
            title="Create New Proposal"
            role="user"
            fullWidth
            onPress={() => navigation.navigate("CreateProposal")}
            style={styles.cta}
          />
        )}
      </View>

      {/* 구분선 */}
      <View style={styles.divider} />

      {/* 검색 */}
      <View style={styles.searchWrap}>
        <SearchBox value={search} onChange={setSearch} />
      </View>

      {/* 리스트 */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {filtered.length === 0 ? (
          <Text style={styles.empty}>No proposals found.</Text>
        ) : (
          filtered.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onPress={() => handleCardPress(proposal)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing * 2, // 20
    paddingTop: spacing,
    paddingBottom: spacing * 1.6,   // 16
  },
  subtitle: {
    fontFamily: typography.family.base,
    fontSize: typography.size.card,    // 17
    color: colors.textMuted,
    lineHeight: typography.size.card + 6,
    marginBottom: spacing * 1.6,       // 16
  },

  // 상단 CTA 버튼(이미지의 밝은 그라데이션 느낌은 CommonButton 내부 스타일 사용,
  // 여백/라운드만 페이지에서 조정)
  cta: {
    borderRadius: radius,
    alignSelf: "stretch",
  },

  divider: {
    height: RNStyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },

  searchWrap: {
    paddingHorizontal: spacing * 2, // 20
    paddingTop: spacing * 1.6,      // 16
    paddingBottom: spacing,         // 10
  },

  scroll: {
    paddingHorizontal: spacing * 2, // 20
    paddingBottom: spacing * 8,     // 80
    gap: spacing,                   // 카드 간격
  },

  empty: {
    fontFamily: typography.family.base,
    fontSize: typography.size.body, // 18
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing * 3,
  },
});
