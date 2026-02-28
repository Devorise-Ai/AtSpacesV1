"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Home,
    Settings,
    ClipboardList,
    BarChart2,
    UserCircle,
    LogOut,
    Bell,
    Moon,
    Sun,
    LayoutGrid,
    ChevronRight,
    ChevronLeft,
    X
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Capacity", href: "/capacity", icon: Settings },
    { name: "Bookings", href: "/bookings", icon: ClipboardList },
    { name: "Reports", href: "/reports", icon: BarChart2 },
    { name: "Profile", href: "/profile", icon: UserCircle },
];

interface SidebarProps {
    isExpanded: boolean;
    onToggle: () => void;
    isMobileOpen?: boolean;
    setMobileOpen?: (open: boolean) => void;
}

export function Sidebar({ isExpanded, onToggle, isMobileOpen, setMobileOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        router.push("/vendor/login");
        if (setMobileOpen) setMobileOpen(false);
    };

    return (
        <>
            {/* ── Mobile Sidebar Drawer ── */}
            <div
                className={`fixed inset-0 z-[60] md:hidden transition-all duration-500 ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    onClick={() => setMobileOpen?.(false)}
                />

                {/* Drawer Panel */}
                <aside
                    className={`absolute left-0 top-0 bottom-0 w-[280px] bg-card border-r border-white/10 shadow-2xl flex flex-col py-8 px-6 transition-transform duration-500 ease-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    {/* Header with Close */}
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                                <LayoutGrid className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-outfit font-bold text-lg leading-none">AtSpaces</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Vendor Hub</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setMobileOpen?.(false)}
                            className="size-10 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-4 flex-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileOpen?.(false)}
                                    className={`flex items-center gap-4 px-4 h-12 rounded-xl transition-all font-outfit font-semibold ${isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                        }`}
                                >
                                    <item.icon className="size-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                        <Link
                            href="/notifications"
                            onClick={() => setMobileOpen?.(false)}
                            className={`flex items-center gap-4 px-4 h-12 rounded-xl transition-all font-outfit font-semibold ${pathname === "/notifications"
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                }`}
                        >
                            <div className="relative">
                                <Bell className="size-5" />
                                <span className="absolute -top-0.5 -right-0.5 flex size-1.5">
                                    <span className="animate-ping absolute inline-flex size-full rounded-full bg-primary opacity-60" />
                                    <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                                </span>
                            </div>
                            <span>Notifications</span>
                        </Link>
                    </nav>

                    {/* Bottom Actions */}
                    <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
                        <button
                            onClick={() => {
                                toggleTheme();
                                // Keep menu open for immediate visual feedback
                            }}
                            className="flex items-center gap-4 px-4 h-12 rounded-xl text-muted-foreground hover:bg-muted transition-all font-outfit font-semibold"
                        >
                            <div className="relative size-5 shrink-0 flex items-center justify-center">
                                <Sun className={`absolute size-5 transition-all duration-500 ${theme === "dark" ? "translate-y-0 opacity-100 rotate-0" : "translate-y-10 opacity-0 -rotate-90"}`} />
                                <Moon className={`absolute size-5 transition-all duration-500 ${theme === "light" ? "translate-y-0 opacity-100 rotate-0" : "translate-y-10 opacity-0 rotate-90"}`} />
                            </div>
                            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 px-4 h-12 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all font-outfit font-semibold"
                        >
                            <LogOut className="size-5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>
            </div>

            {/* ── Vertical Sidebar (Desktop & Tablet) ── */}
            <aside
                className={`fixed left-4 top-4 bottom-4 z-50 hidden md:flex flex-col py-6 glass-card border-white/10 shadow-2xl rounded-[1.8rem] transition-all duration-500 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${isExpanded ? "w-64 px-4" : "w-16 items-center"
                    }`}
            >
                {/* ... (existing sidebar content) ... */}
                {/* Logo Section / Toggle Trigger */}
                <button
                    onClick={onToggle}
                    className={`mb-8 group relative outline-none flex items-center transition-all duration-500 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${isExpanded ? "w-full px-2" : "justify-center"}`}
                >
                    <div className={`flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 ${isExpanded ? "scale-90" : "group-hover:scale-105"}`}>
                        <LayoutGrid className="size-5" />
                    </div>
                    {isExpanded && (
                        <div className="ml-3 flex flex-col items-start animate-in fade-in slide-in-from-left-2 duration-500">
                            <span className="font-outfit font-bold text-lg leading-none">AtSpaces</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Vendor Hub</span>
                        </div>
                    )}
                    {!isExpanded && (
                        <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-popover text-popover-foreground text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                            Expand
                        </div>
                    )}
                </button>

                {/* Navigation Section */}
                <nav className={`flex flex-1 flex-col gap-3 ${isExpanded ? "w-full" : ""}`}>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group relative flex items-center rounded-xl transition-all duration-200 outline-none ${isExpanded ? "w-full px-3 h-11" : "size-10 justify-center"
                                    } ${isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                    }`}
                            >
                                <item.icon className="size-5 shrink-0" />
                                {isExpanded ? (
                                    <span className="ml-3 font-outfit font-semibold text-sm animate-in fade-in slide-in-from-left-2 duration-500">
                                        {item.name}
                                    </span>
                                ) : (
                                    <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-medium shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions Section */}
                <div className={`flex flex-col gap-3 mt-auto ${isExpanded ? "w-full" : "items-center"}`}>
                    {/* Notifications */}
                    <Link
                        href="/notifications"
                        className={`group relative flex items-center rounded-xl transition-all duration-200 outline-none ${isExpanded ? "w-full px-3 h-11" : "size-10 justify-center"
                            } ${pathname === "/notifications"
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            }`}
                    >
                        <div className="relative shrink-0">
                            <Bell className="size-5" />
                            <span className="absolute -top-0.5 -right-0.5 flex size-1.5">
                                <span className="animate-ping absolute inline-flex size-full rounded-full bg-primary opacity-60" />
                                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                            </span>
                        </div>
                        {isExpanded ? (
                            <span className="ml-3 font-outfit font-semibold text-sm animate-in fade-in slide-in-from-left-2 duration-500">
                                Notifications
                            </span>
                        ) : (
                            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-medium shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                                Notifications
                            </div>
                        )}
                    </Link>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`group relative flex items-center rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 overflow-hidden outline-none ${isExpanded ? "w-full px-3 h-11" : "size-10 justify-center"
                            }`}
                    >
                        <div className="relative size-5 shrink-0 flex items-center justify-center">
                            <Sun className={`absolute size-5 transition-all duration-500 ${theme === "dark" ? "translate-y-0 opacity-100 rotate-0" : "translate-y-10 opacity-0 -rotate-90"}`} />
                            <Moon className={`absolute size-5 transition-all duration-500 ${theme === "light" ? "translate-y-0 opacity-100 rotate-0" : "translate-y-10 opacity-0 rotate-90"}`} />
                        </div>
                        {isExpanded ? (
                            <span className="ml-3 font-outfit font-semibold text-sm animate-in fade-in slide-in-from-left-2 duration-500">
                                {theme === "dark" ? "Light Mode" : "Dark Mode"}
                            </span>
                        ) : (
                            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-medium shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                                {theme === "dark" ? "Light Mode" : "Dark Mode"}
                            </div>
                        )}
                    </button>

                    <div className={`h-px bg-border/50 my-1 ${isExpanded ? "w-full" : "w-6"}`} />

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className={`group relative flex items-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 outline-none ${isExpanded ? "w-full px-3 h-11" : "size-10 justify-center"
                            }`}
                    >
                        <LogOut className="size-5 shrink-0" />
                        {isExpanded ? (
                            <span className="ml-3 font-outfit font-semibold text-sm animate-in fade-in slide-in-from-left-2 duration-500">
                                Sign Out
                            </span>
                        ) : (
                            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-medium shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                                Sign Out
                            </div>
                        )}
                    </button>
                </div>

                {/* Collapse Icon Toggle */}
                <div className={`absolute -right-3 top-1/2 -translate-y-1/2 size-6 rounded-full glass-card border-white/10 items-center justify-center text-muted-foreground group cursor-pointer hover:text-primary transition-all hidden md:flex ${isExpanded ? "rotate-180" : ""}`} onClick={onToggle}>
                    <ChevronRight className="size-3.5" />
                </div>
            </aside>

            {/* ── Mobile Bottom Navigation ── */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex md:hidden items-center gap-1 p-1.5 glass-card border-white/10 shadow-2xl rounded-2xl w-[90%] max-w-sm justify-around">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center rounded-xl transition-all duration-200 size-11 ${isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                }`}
                        >
                            <item.icon className="size-5" />
                        </Link>
                    );
                })}
                <Link
                    href="/notifications"
                    className={`relative flex flex-col items-center justify-center rounded-xl transition-all duration-200 size-11 ${pathname === "/notifications"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                        }`}
                >
                    <Bell className="size-5" />
                    <span className="absolute top-2.5 right-2.5 flex size-1.5">
                        <span className="animate-ping absolute inline-flex size-full rounded-full bg-primary opacity-60" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                    </span>
                </Link>
            </nav>
        </>
    );
}
