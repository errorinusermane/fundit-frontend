import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../store/userStore";
import { getBidsByCompany } from "../../api/bid";
import { Bid } from "../../types/bid";
import PageHeader from "../../components/PageHeader";
import SearchBox from "../../components/SearchBox";
import CommonButton from "../../components/CommonButton";
import BidCard from "../../components/BidCard";
import AlertMessage from "../../components/AlertMessage";
import { StackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, spacing, typography } from "../../styles";

export function MyBidsPage() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { user } = useUserStore();

  const [bids, setBids] = useState<Bid[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user?.role === "company") {
      fetchBids();
    }
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
        <AlertMessage
          message="기업 전용 페이지입니다."
          type="warning"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PageHeader
        current="MyPage"
        onNavigate={(page) => navigation.navigate(page)}
      />

      <View style={styles.searchBox}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} placeholder="Plan 제목으로 검색" />
      </View>

      <FlatList
        data={filteredBids}
        keyExtractor={(item) => item.bidId.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <BidCard
            bid={item}
            onPress={() => navigation.navigate("BidDetail", { bid: item })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>제출한 입찰이 없습니다.</Text>
        }
      />

      <View style={styles.floatingButton}>
        <CommonButton
          title="Submit Bid"
          role="company"
          onPress={() => navigation.navigate("SubmitBid", { proposalId: 0 /* or 선택 방식 */ })}
        />
      </View>
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
  listContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  emptyText: {
    textAlign: "center",
    marginTop: spacing.lg,
    fontSize: typography.body,
    color: colors.muted,
  },
  floatingButton: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
  },
  alertContainer: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
});
