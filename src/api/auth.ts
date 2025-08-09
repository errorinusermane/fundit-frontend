import axiosInstance from "../api/axios";
import { User, UserRole } from "../types/user";

interface LoginRequest {
  email: string;
  role: UserRole;
}

interface VerifyResponse {
  token: string;
  user: User;
}

interface WalletConnectRequest {
  email: string;
  wallet: string;
}

/**
 * Magic Link 요청
 * @param email 사용자 이메일
 * @param role 'user' | 'company'
 */
export async function requestMagicLink({ email, role }: LoginRequest): Promise<void> {
  await axiosInstance.post("/auth/login", { email, role });
}

/**
 * 토큰 검증 및 최종 로그인
 * @param token Magic Link에 포함된 토큰
 */
export async function verifyMagicToken(token: string): Promise<VerifyResponse> {
  const res = await axiosInstance.get("/auth/verify", {
    params: { token },
  });
  return res.data;
}

/**
 * 지갑 연결 후 JWT 재발급
 * @param email 유저 이메일
 * @param wallet 연결할 지갑 주소
 */
export async function connectWallet({ email, wallet }: WalletConnectRequest): Promise<VerifyResponse> {
  const res = await axiosInstance.patch("/auth/wallet", { email, wallet });
  return res.data;
}
