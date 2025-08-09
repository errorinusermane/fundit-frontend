// import axios from "axios";
// import { API_BASE_URL_ANDROID } from "@env"; // ← .env에서 가져옴

// const baseURL = API_BASE_URL_ANDROID || "http://localhost:3001"; // fallback

// const axiosInstance = axios.create({
//   baseURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // JWT 붙이기 (globalThis.authToken 사용 예시)
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = globalThis?.authToken;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     console.error("❌ Axios Error:", err?.response || err?.message);
//     return Promise.reject(err);
//   }
// );





import axios from "axios";
import { API_BASE_URL_ANDROID } from "@env";

const USE_MOCK = true; // ✅ 퍼블리싱 모드

const baseURL = API_BASE_URL_ANDROID || "http://10.0.2.2:3001";

const axiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = globalThis?.authToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (USE_MOCK) {
      const url = err.config?.url || "";
      const method = (err.config?.method || "get").toLowerCase();

      // ----- Auth -----
      if (url.includes("/auth/login") && method === "post") {
        return { data: {} };
      }
      if (url.includes("/auth/verify") && method === "get") {
        return {
          data: {
            token: "mock-jwt-token",
            user: {
              id: 1,
              email: "user@example.com",
              role: "user",
              walletAddress: "0xUSER1234567890",
              createdAt: Date.now(),
            },
          },
        };
      }
      if (url.includes("/auth/wallet") && method === "patch") {
        return {
          data: {
            token: "mock-jwt-token",
            user: {
              id: 1,
              email: "user@example.com",
              role: "user",
              walletAddress: "0xUSER1234567890",
              createdAt: Date.now(),
            },
          },
        };
      }

      // ----- Proposals -----
      if (url === "/proposals" && method === "get") {
        return {
          data: [
            {
              id: 1,
              title: "Health Insurance Plan A",
              status: "ACTIVE",
              description: "Affordable health plan for small businesses.",
              mandatoryRequirements: ["Age under 60", "Non-smoker"],
              enrollmentConditions: ["Minimum 5 employees"],
              optionalFeatures: ["Dental coverage", "Vision coverage"],
              desiredStartDate: Math.floor(Date.now() / 1000),
              minPremium: 1e18,
              maxPremium: 2e18,
              remainingTime: 86400,
              bidCount: 3,
            },
            {
              id: 2,
              title: "Travel Insurance Plan",
              status: "CLOSED",
              description: "Short-term travel insurance for abroad trips.",
              mandatoryRequirements: [],
              enrollmentConditions: [],
              optionalFeatures: ["Lost baggage", "Flight delay"],
              desiredStartDate: Math.floor(Date.now() / 1000) + 86400 * 10,
              minPremium: 0.5e18,
              maxPremium: 1.5e18,
              remainingTime: 0,
              bidCount: 5,
            },
          ],
        };
      }
      if (url.includes("/proposals/active") && method === "get") {
        return {
          data: [
            {
              id: 1,
              title: "Health Insurance Plan A",
              status: "ACTIVE",
              description: "Affordable health plan for small businesses.",
              mandatoryRequirements: ["Age under 60", "Non-smoker"],
              enrollmentConditions: ["Minimum 5 employees"],
              optionalFeatures: ["Dental coverage", "Vision coverage"],
              desiredStartDate: Math.floor(Date.now() / 1000),
              minPremium: 1e18,
              maxPremium: 2e18,
              remainingTime: 86400,
              bidCount: 3,
            },
          ],
        };
      }
      if (url.startsWith("/proposals/") && method === "get") {
        return {
          data: {
            id: 1,
            title: "Health Insurance Plan A",
            description: "Affordable health plan for small businesses.",
            mandatoryRequirements: ["Age under 60", "Non-smoker"],
            enrollmentConditions: ["Minimum 5 employees"],
            optionalFeatures: ["Dental coverage", "Vision coverage"],
            desiredStartDate: Math.floor(Date.now() / 1000),
            minPremium: 1e18,
            maxPremium: 2e18,
            remainingTime: 3600,
            bidCount: 2,
            status: "ACTIVE",
          },
        };
      }

      // ----- Bids -----
      if (url.startsWith("/bids/") && method === "get") {
        return {
          data: [
            {
              bidId: 1,
              companyName: "InsureCorp",
              planTitle: "Premium Plan",
              planType: "Full coverage",
              outpatientCoveragePerVisit: 100000,
              inpatientCoverage: 5000000,
              nonCoveredCoverage: 1000000,
              monthlyPremium: 1.5e18,
              contractPeriod: 12,
              ageEligibility: 60,
              occupationEligibility: "All",
              votes: 10,
            },
            {
              bidId: 2,
              companyName: "MediLife",
              planTitle: "Standard Plan",
              planType: "Partial coverage",
              outpatientCoveragePerVisit: 50000,
              inpatientCoverage: 3000000,
              nonCoveredCoverage: 500000,
              monthlyPremium: 1.2e18,
              contractPeriod: 6,
              ageEligibility: 50,
              occupationEligibility: "Office workers",
              votes: 5,
            },
          ],
        };
      }

      // ----- Contracts -----
      if (url.startsWith("/contracts/") && method === "get") {
        return {
          data: {
            contractId: 1,
            proposalId: 1,
            companyName: "InsureCorp",
            startDate: Date.now(),
            autoPayment: true,
            monthlyPremium: 1.5e18,
            durationMonths: 12,
            status: "ACTIVE",
          },
        };
      }

      // ----- Token -----
      if (url.includes("/token/balance") && method === "get") {
        return { data: { balance: 5000 } };
      }
      if (url.includes("/token/reward-history") && method === "get") {
        return {
          data: [
            {
              date: "2025-08-01",
              amount: 100,
              reason: "Proposal participation",
            },
          ],
        };
      }
      if (url.includes("/token/claimed") && method === "get") {
        return { data: { claimed: 300 } };
      }

      // ----- Default -----
      return { data: {} };
    }

    console.error("❌ Axios Error:", err?.response || err?.message);
    return Promise.reject(err);
  }
);

export default axiosInstance;
