import axiosInstance from "../api/axios";
import { Proposal } from "../types/proposal";

interface CreateProposalInput {
  title: string;
  description: string;
  mandatoryRequirements: string[];
  enrollmentConditions: string[];
  optionalFeatures: string[];
  desiredStartDate: number; // UNIX timestamp (초 단위)
  minPremium: number;
  maxPremium: number;
  walletAddress: string;
}

/**
 * 제안 생성
 */
export async function createProposal(input: CreateProposalInput): Promise<string> {
  const res = await axiosInstance.post("/proposals", input);
  return res.data.txHash;
}

/**
 * 전체 제안 조회
 */
export async function getAllProposals(): Promise<(Proposal & { remainingTime: number })[]> {
  const res = await axiosInstance.get("/proposals");
  return res.data;
}

/**
 * ACTIVE 상태의 제안만 조회
 */
export async function getActiveProposals(): Promise<(Proposal & { remainingTime: number })[]> {
  const res = await axiosInstance.get("/proposals/active");
  return res.data;
}

/**
 * 단건 제안 상세 조회
 */
export async function getProposalById(id: number): Promise<Proposal & { remainingTime: number }> {
  const res = await axiosInstance.get(`/proposals/${id}`);
  return res.data;
}

/**
 * 내가 생성한 제안 목록 조회
 */
export async function getProposalsByUser(address: string): Promise<(Proposal & { remainingTime: number })[]> {
  const res = await axiosInstance.get(`/proposals/user/${address}`);
  return res.data;
}

/**
 * 제안 마감
 */
export async function closeProposal(id: number, walletAddress: string): Promise<string> {
  const res = await axiosInstance.post(`/proposals/${id}/close`, { walletAddress });
  return res.data.txHash;
}
