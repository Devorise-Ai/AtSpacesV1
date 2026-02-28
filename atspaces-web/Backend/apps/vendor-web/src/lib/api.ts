import axios from "axios";
import { getToken, removeToken } from "./token";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ── Request Interceptor: Attach JWT token ──────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle 401 globally ──────────────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeToken();
            // Redirect to login if not already there
            if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
                window.location.href = "/vendor/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
