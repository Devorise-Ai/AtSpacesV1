import axios from "axios";
import { getToken, removeToken } from "./token";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

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
            const hadToken = !!getToken();
            // Only redirect to home if the user had a stored token that expired.
            // During login/register calls there's no token yet — let the modal's catch
            // block handle the error inline instead of navigating away.
            if (hadToken && typeof window !== "undefined") {
                removeToken();
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
