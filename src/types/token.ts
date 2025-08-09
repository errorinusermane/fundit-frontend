export interface TokenBalance {
  address: string;
  balance: string;
}

export interface RewardHistoryItem {
  address: string;
  amount: string;
  txHash: string;
  createdAt: Date;
}

export interface ClaimedReward {
  address: string;
  claimedAmount: string; // 누적 수령량
}
