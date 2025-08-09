import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../navigation/AppNavigator";

import SearchBox from "../../components/SearchBox";
import CommonButton from "../../components/CommonButton";
import ProposalCard from "../../components/ProposalCard";
import { colors, spacing, typography } from "../../styles";

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
      <SearchBox value={search} onChange={setSearch} />

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

      {user?.role === "user" && (
        <CommonButton
          title="Create New Proposal"
          role="user"
          onPress={() => navigation.navigate("CreateProposal")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  scroll: {
    paddingBottom: spacing.xl * 2,
  },
  empty: {
    fontSize: typography.body,
    color: colors.muted,
    textAlign: "center",
    marginTop: spacing.lg,
  },
});
