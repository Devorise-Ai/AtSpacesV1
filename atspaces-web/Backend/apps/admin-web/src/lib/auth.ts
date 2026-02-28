import api from "./api";
import { setToken, setUser, removeToken, getToken, getUser } from "./token";
import type { StoredUser } from "./token";

// ── Types ──────────────────────────────────────────────────────────

export interface LoginPayload {
    email: string;
    password: string;
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

export function logout(): void {
    removeToken();
    window.location.href = "/admin/login";
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

export function getCurrentUser(): StoredUser | null {
    return getUser();
}
