import api from "./api";
import { setToken, setUser, removeToken, getToken, getUser } from "./token";
import type { StoredUser } from "./token";

// ── Types ──────────────────────────────────────────────────────────

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    role: "vendor";
}

export interface LoginResponse {
    access_token: string;
    user: StoredUser;
}

// ── Auth Functions ─────────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);
    setToken(data.access_token);
    setUser(data.user);
    return data;
}

export async function register(payload: RegisterPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/register", payload);
    setToken(data.access_token);
    setUser(data.user);
    return data;
}

export function logout(): void {
    removeToken();
    window.location.href = "/vendor/login";
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

export function getCurrentUser(): StoredUser | null {
    return getUser();
}
