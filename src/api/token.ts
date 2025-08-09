import axiosInstance from "../api/axios";
import {
  TokenBalance,
  RewardHistoryItem,
  ClaimedReward,
} from "../types/token";

/**
 * FDT 토큰 잔액 조회
 * @param address 사용자 지갑 주소
 */
export async function getTokenBalance(address: string): Promise<TokenBalance> {
  const res = await axiosInstance.get(`/token/balance/${address}`);
  return res.data;
}

/**
 * 수령 히스토리 조회 (DB 기준)
 * @param address 사용자 지갑 주소
 */
export async function getRewardHistory(address: string): Promise<RewardHistoryItem[]> {
  const res = await axiosInstance.get(`/token/reward-history/${address}`);
  return res.data;
}

/**
 * 누적 수령량 조회 (on-chain 기준)
 * @param address 사용자 지갑 주소
 */
export async function getClaimedReward(address: string): Promise<ClaimedReward> {
  const res = await axiosInstance.get(`/token/claimed/${address}`);
  return res.data;
}

interface ClaimRewardInput {
  user: string;
  amount: bigint;
}

/**
 * 리워드 토큰 수령 요청 (관리자만 사용)
 * @param input 수령 대상 주소 + 수령량
 */
export async function claimReward(input: ClaimRewardInput): Promise<string> {
  const res = await axiosInstance.post("/token/claim", {
    user: input.user,
    amount: input.amount.toString(),
  });
  return res.data.txHash;
}
