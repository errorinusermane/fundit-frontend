import axiosInstance from "../api/axios";
import { Bid } from "../types/bid";

interface SubmitBidInput {
  proposalId: number;
  companyName: string;
  planTitle: string;
  planType: string;
  outpatientCoveragePerVisit: number;
  inpatientCoverage: number;
  nonCoveredCoverage: number;
  monthlyPremium: number;
  contractPeriod: number;
  ageEligibility: number;
  occupationEligibility: string;
}

interface SubmitBidRequest extends SubmitBidInput {
  wallet: string;
}

/**
 * 입찰 제출 (기업)
 * @param bidData 입찰 정보 + wallet 주소
 */
export async function submitBid(bidData: SubmitBidRequest): Promise<number> {
  const res = await axiosInstance.post("/bids", bidData);
  return res.data.bidId;
}

/**
 * 특정 제안에 달린 입찰 목록 조회
 * @param proposalId 제안 ID
 */
export async function getBidsByProposal(proposalId: number): Promise<Bid[]> {
  const res = await axiosInstance.get(`/bids/${proposalId}`);
  return res.data;
}

/**
 * 내가 제출한 입찰 목록 조회 (기업)
 * @param companyAddress 지갑 주소
 */
export async function getBidsByCompany(companyAddress: string): Promise<Bid[]> {
  const res = await axiosInstance.get(`/bids/company/${companyAddress}`);
  return res.data;
}

/**
 * 특정 입찰에 투표 (개인)
 * @param bidId 입찰 ID
 * @param wallet 개인 지갑 주소
 */
export async function voteBid(bidId: number, wallet: string): Promise<void> {
  await axiosInstance.post(`/bids/${bidId}/vote`, { wallet });
}
