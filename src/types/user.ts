export type UserRole = "user" | "company";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  wallet?: string;
  createdAt: string;
  lastLoginAt?: string;
}
