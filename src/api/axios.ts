import axios from "axios";
import { API_BASE_URL_ANDROID } from "@env"; // ← .env에서 가져옴

const baseURL = API_BASE_URL_ANDROID || "http://192.168.0.102:8080"; // fallback

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT 붙이기 (globalThis.authToken 사용 예시)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = globalThis?.authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("❌ Axios Error:", err?.response || err?.message);
    return Promise.reject(err);
  }
);

export default axiosInstance;
