"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyTheme(theme: Theme) {
    const html = document.documentElement;
    // Tailwind dark class
    if (theme === "dark") {
        html.classList.add("dark");
        html.classList.remove("light");
    } else {
        html.classList.remove("dark");
        html.classList.add("light");
    }
    // Customer web data-theme attribute (same mechanics)
    html.setAttribute("data-theme", theme);
    localStorage.setItem("atspaces-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");

    // On mount: read from localStorage, default to dark
    useEffect(() => {
        const saved = localStorage.getItem("atspaces-theme") as Theme | null;
        const initial = saved || "dark";
        setTheme(initial);
        applyTheme(initial);
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => {
            const next = prev === "dark" ? "light" : "dark";
            applyTheme(next);
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}
