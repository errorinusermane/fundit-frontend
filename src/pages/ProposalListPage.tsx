import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, TouchableOpacity, StyleSheet as RNStyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { StackParamList } from "../navigation/AppNavigator";
import PageHeader from "../components/PageHeader";
import SearchBox from "../components/SearchBox";
import ProposalCard from "../components/ProposalCard";
import CommonButton from "../components/CommonButton";

import { getAllProposals } from "../api/proposal";
import { Proposal, ProposalStatus } from "../types/proposal";
import { useUserStore } from "../store/userStore";
import { colors, radius, spacing, typography } from "../styles";

const FILTERS: (ProposalStatus | "ALL")[] = ["ALL", "ACTIVE", "CLOSED", "CANCELLED"];

export function ProposalListPage() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { user } = useUserStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<ProposalStatus | "ALL">("ALL");
  const [proposals, setProposals] = useState<(Proposal & { remainingTime: number })[]>([]);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await getAllProposals();
      setProposals(res);
    } catch (err) {
      console.error("❌ Failed to fetch proposals:", err);
    }
  };

  const filteredProposals = proposals.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = selectedFilter === "ALL" || p.status === selectedFilter;
    return matchSearch && matchFilter;
  });

  return (
    <View style={styles.container}>
      <PageHeader current="Explore" onNavigate={(page) => navigation.navigate(page)} />

      <View style={styles.searchBox}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((filter) => {
          const active = selectedFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[
                styles.filterButton,
                active && {
                  borderColor: colors.primary,
                },
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterText,
                  active && { color: colors.primary },
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredProposals}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ProposalCard
            proposal={item}
            onPress={() =>
              navigation.navigate("ProposalDetail", { proposalId: item.id })
            }
          />
        )}
      />

      {user?.role === "user" && (
        <View style={styles.fabWrap}>
          <CommonButton
            title="+"
            fullWidth={false}
            onPress={() => navigation.navigate("CreateProposal")}
            // 버튼 자체 퍼블리싱은 CommonButton 내부 토큰 사용
            style={styles.fab}
            textStyle={{ fontSize: 42, fontWeight: typography.weight.medium }}
          />
        </View>
      )}
    </View>
  );
}

const CHIP_H = 36;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBox: {
    paddingHorizontal: spacing * 2, // 20
    paddingTop: spacing * 2,        // 20
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing,                   // 10
    paddingHorizontal: spacing * 2, // 20
    paddingVertical: spacing * 1.6,       // 10
  },
  filterButton: {
    height: CHIP_H,
    paddingHorizontal: spacing * 1.6,   // 16
    borderRadius: CHIP_H / 2,           // pill
    backgroundColor: colors.surface,
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  filterText: {
    fontFamily: typography.family.base,
    fontSize: typography.size.toggle,    // 16
    fontWeight: typography.weight.medium,
    color: colors.textMuted,
  },
  listContainer: {
    paddingHorizontal: spacing * 2, // 20
    paddingBottom: spacing * 10,    // 100 (FAB 공간)
    gap: spacing,                   // 카드 간격
  },

  // Floating action button
  fabWrap: {
    position: "absolute",
    right: spacing * 2,  // 20
    bottom: spacing * 2, // 20
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: radius,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
  },
});
