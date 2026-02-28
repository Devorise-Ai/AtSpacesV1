"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { isAuthenticated, getCurrentUser, logout as logoutFn } from "@/lib/auth";
import type { StoredUser } from "@/lib/token";

interface AuthContextValue {
    user: StoredUser | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    logout: () => void;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    isLoggedIn: false,
    isLoading: true,
    logout: () => { },
    refreshUser: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<StoredUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(() => {
        const storedUser = getCurrentUser();
        setUser(storedUser);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const logout = useCallback(() => {
        logoutFn();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: isAuthenticated(),
                isLoading,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
