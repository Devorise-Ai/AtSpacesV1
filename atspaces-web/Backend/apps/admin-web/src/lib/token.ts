const TOKEN_KEY = "atspaces_admin_token";
const USER_KEY = "atspaces_admin_user";

// ── Token helpers ──────────────────────────────────────────────────

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// ── User helpers ───────────────────────────────────────────────────

export interface StoredUser {
    id: number;
    email: string;
    fullName: string;
    role: string;
}

export function getUser(): StoredUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as StoredUser;
    } catch {
        return null;
    }
}

export function setUser(user: StoredUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}
