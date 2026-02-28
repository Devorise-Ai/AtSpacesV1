"use client";

import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function Topbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/60 backdrop-blur-md px-6 transition-colors duration-300">
            {/* Left: breadcrumb / page title area (populated by children via context if needed) */}
            <div className="flex-1" />

            {/* Right: actions */}
            <div className="flex items-center gap-2">
                {/* Theme toggle — identical mechanic to customer web */}
                <button
                    onClick={toggleTheme}
                    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    className="relative flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                >
                    {/* Sun fades in for dark mode (click → switch to light) */}
                    <Sun
                        className={`absolute size-4 transition-all duration-300 ${theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`}
                    />
                    {/* Moon fades in for light mode (click → switch to dark) */}
                    <Moon
                        className={`absolute size-4 transition-all duration-300 ${theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"}`}
                    />
                </button>

                {/* Notifications */}
                <button className="relative flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
                    <Bell className="size-4" />
                    <span className="absolute top-1.5 right-1.5 flex size-2">
                        <span className="animate-ping absolute inline-flex size-full rounded-full bg-primary opacity-60" />
                        <span className="relative inline-flex size-2 rounded-full bg-primary" />
                    </span>
                </button>

                {/* User avatar */}
                <div className="flex items-center gap-2.5 pl-2 ml-1 border-l border-border">
                    <div className="flex flex-col items-end leading-none">
                        <span className="text-sm font-semibold text-foreground">Vendor Demo</span>
                        <span className="text-xs text-muted-foreground mt-0.5">Amman Branch</span>
                    </div>
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                        V
                    </div>
                </div>
            </div>
        </header>
    );
}
