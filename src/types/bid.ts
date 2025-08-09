export type BidStatus = "ACTIVE" | "SELECTED" | "REJECTED";

export interface Bid {
  bidId: number;
  proposalId: number;
  company: string; // 지갑 주소
  companyName: string;
  planTitle: string;
  planType: string;
  outpatientCoveragePerVisit: number;
  inpatientCoverage: number;
  nonCoveredCoverage: number;
  monthlyPremium: number;
  contractPeriod: number; // in months
  ageEligibility: number;
  occupationEligibility: string;
  voteCount: number;
  minVotes: number;
  status: BidStatus;
  createdAt: number; // UNIX timestamp
}
