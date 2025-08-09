export type ProposalStatus = 'ACTIVE' | 'CLOSED' | 'CANCELLED';

export interface Proposal {
  id: number;
  proposer: string; // address
  title: string;
  description: string;

  // Conditions
  mandatoryRequirements: string[];
  enrollmentConditions: string[];
  optionalFeatures: string[];

  // Schedule
  desiredStartDate: number; // timestamp (seconds)

  // Premium
  minPremium: number; // 단위: wei
  maxPremium: number; // 단위: wei

  // System
  createdAt: number; // timestamp
  status: ProposalStatus;
  bidCount: number;
}
