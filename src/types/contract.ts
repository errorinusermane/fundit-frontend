export type ContractStatus = "ACTIVE" | "TERMINATED";

export interface FunditContract {
  id: number;
  proposalId: number;
  bidId: number;
  user: string; // address
  company: string; // address
  monthlyPremium: number; // wei 단위
  contractPeriod: number; // 월 단위
  startDate: number; // timestamp
  autoPayment: boolean;
  status: ContractStatus;
}
