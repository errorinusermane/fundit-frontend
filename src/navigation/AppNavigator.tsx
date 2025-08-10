import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ProposalListPage } from "../pages/ProposalListPage";
import { ProposalDetailPage } from "../pages/ProposalDetailPage";
import { BidDetailPage } from "../pages/BidDetailPage";
import { CreateProposalPage } from "../pages/user/CreateProposalPage";
import { SubmitBidPage } from "../pages/company/SubmitBidPage";
import { MyProposalsPage } from "../pages/user/MyProposalsPage";
import { MyBidsPage } from "../pages/company/MyBidsPage";
import { MyContractsPage } from "../pages/MyContractsPage";
import { RewardsPage } from "../pages/user/RewardsPage";
import { LoginPage } from "../pages/LoginPage";
import { MyPage } from "../pages/MyPage";

import { Bid } from "../types/bid";
import { useUserStore } from "../store/userStore";
import ScreenHeader from "../components/ScreenHeader";
import { colors } from "../styles";

export type StackParamList = {
  Login: undefined;
  ProposalList: undefined;
  ProposalDetail: { proposalId: number };
  BidDetail: { bid: Bid };
  CreateProposal: undefined;
  SubmitBid: { proposalId: number };
  MyProposals: undefined;
  MyBids: undefined;
  MyContracts: undefined;
  Rewards: undefined;
  MyPage: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

export default function AppNavigator() {
  const { user } = useUserStore();

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <ScreenHeader {...props} />,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
      }}
    >
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="ProposalList"
            component={ProposalListPage}
            options={{ title: "Proposal List" }}
          />
          <Stack.Screen
            name="ProposalDetail"
            component={ProposalDetailPage}
            options={{ title: "Proposal Detail" }}
          />
          <Stack.Screen
            name="BidDetail"
            component={BidDetailPage}
            options={{ title: "Bid Detail" }}
          />
          <Stack.Screen
            name="CreateProposal"
            component={CreateProposalPage}
            options={{ title: "Create Proposal" }}
          />
          <Stack.Screen
            name="SubmitBid"
            component={SubmitBidPage}
            options={{ title: "Submit Bid" }}
          />
          <Stack.Screen
            name="MyProposals"
            component={MyProposalsPage}
            options={{ title: "My Proposals" }}
          />
          <Stack.Screen
            name="MyBids"
            component={MyBidsPage}
            options={{ title: "My Bids" }}
          />
          <Stack.Screen
            name="MyContracts"
            component={MyContractsPage}
            options={{ title: "My Contracts" }}
          />
          <Stack.Screen
            name="Rewards"
            component={RewardsPage}
            options={{ title: "Rewards" }}
          />
          <Stack.Screen
            name="MyPage"
            component={MyPage}
            options={{ title: "My Page" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
