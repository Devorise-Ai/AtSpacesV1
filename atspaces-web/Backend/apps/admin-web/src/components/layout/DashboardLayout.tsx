"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        router.push("/admin/login");
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground transition-all duration-500">
            {/* Mobile Header */}
            <div className="fixed top-6 left-6 right-6 z-40 flex items-center justify-between md:hidden pointer-events-none">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="glass-card border-white/10 shadow-xl size-11 rounded-2xl text-foreground hover:bg-primary/10 hover:text-primary transition-all active:scale-95 pointer-events-auto"
                >
                    <Menu className="size-6" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="glass-card border-white/10 shadow-xl size-11 rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all active:scale-95 pointer-events-auto"
                >
                    <LogOut className="size-5" />
                </Button>
            </div>

            <Sidebar
                isExpanded={isExpanded}
                onToggle={() => setIsExpanded(!isExpanded)}
                isMobileOpen={isMobileSidebarOpen}
                setMobileOpen={setIsMobileSidebarOpen}
            />

            <main className={`flex-1 p-5 lg:p-8 transition-all duration-500 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] 
                pb-24 md:pb-8
                ${isExpanded ? "md:ml-72" : "md:ml-24"}`}>
                <div className="mx-auto max-w-7xl pt-16 md:pt-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
