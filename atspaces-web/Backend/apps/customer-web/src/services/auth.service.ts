import api from "../lib/api";
import { setToken, setUser, removeToken, getToken } from "../lib/token";
import type { StoredUser } from "../lib/token";

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

export interface AuthResponse {
    access_token: string;
    user: StoredUser;
}

export const authService = {
    /** Login with email + password. Stores token and user in localStorage. */
    login: async (dto: LoginDto): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/login", dto);
        const { access_token, user } = response.data;
        setToken(access_token);
        setUser(user);
        return response.data;
    },

    /** Register a new CUSTOMER account, then auto-login. */
    register: async (dto: RegisterDto): Promise<AuthResponse> => {
        await api.post("/auth/register", {
            ...dto,
            role: "customer", // always customer — backend enforces this too
        });
        // Auto-login after registration
        return authService.login({ email: dto.email, password: dto.password });
    },

    /** Fetch the current authenticated user's profile from the API. */
    getProfile: async (): Promise<StoredUser> => {
        const response = await api.get<StoredUser>("/auth/profile");
        return response.data;
    },

    /** Clear token and user from localStorage. */
    logout: (): void => {
        removeToken();
    },

    /** Check if a user is currently logged in. */
    isLoggedIn: (): boolean => {
        return !!getToken();
    },
};
