import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
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
import { colors, spacing, typography } from "../styles";

const FILTERS: (ProposalStatus | "ALL")[] = ["ALL", "ACTIVE", "CLOSED", "CANCELLED"];

export function ProposalListPage() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { user } = useUserStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<ProposalStatus | "ALL">("ALL");
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
      <PageHeader
        current="Explore"
        onNavigate={(page) => navigation.navigate(page)}
      />

      <View style={styles.searchBox}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredProposals}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ProposalCard
            proposal={item}
            onPress={() =>
              navigation.navigate("ProposalDetail", {
                proposalId: item.id,
              })
            }
          />
        )}
      />

      {user?.role === "user" && (
        <View style={styles.floatingButton}>
          <CommonButton
            title="Create Proposal"
            role="user"
            onPress={() => navigation.navigate("CreateProposal")}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBox: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: spacing.sm,
  },
  filterButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: typography.small,
    color: colors.muted,
    fontWeight: typography.fontWeight.medium,
  },
  filterTextActive: {
    color: colors.surface,
  },
  listContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  floatingButton: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
  },
});
