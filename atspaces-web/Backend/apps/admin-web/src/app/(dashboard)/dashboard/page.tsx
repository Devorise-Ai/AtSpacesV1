"use client";

import {
    TrendingUp,
    TrendingDown,
    Building2,
    Users,
    DollarSign,
    CalendarCheck,
    AlertTriangle,
    CheckSquare,
    ArrowRight,
    Activity,
    Clock,
} from "lucide-react";
import Link from "next/link";

const topBranches = [
    { name: "Amman Downtown Hub", city: "Amman", occupancy: 92 },
    { name: "Abdali Business Center", city: "Amman", occupancy: 87 },
    { name: "Irbid Innovation Lab", city: "Irbid", occupancy: 81 },
    { name: "Aqaba Marina Space", city: "Aqaba", occupancy: 76 },
    { name: "Zarqa Tech Park", city: "Zarqa", occupancy: 71 },
];

const recentActivity = [
    { action: "New booking", detail: "Hot Desk at Amman Downtown Hub", time: "2 min ago" },
    { action: "Vendor check-in", detail: "3 guests at Abdali Center", time: "15 min ago" },
    { action: "Pricing updated", detail: "Meeting Room hourly rate → 12 JOD", time: "1 hr ago" },
    { action: "Branch activated", detail: "Zarqa Tech Park is now live", time: "3 hrs ago" },
    { action: "Application submitted", detail: "New vendor from Salt", time: "5 hrs ago" },
];

import { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                {error}
            </div>
        );
    }

    const kpiCards = [
        { label: "Total Users", value: stats?.users?.total || 0, change: `+${stats?.users?.vendors || 0} Vendors`, trend: "up", icon: Users },
        { label: "Network Branches", value: stats?.branches?.total || 0, change: `${stats?.branches?.active || 0} Active`, trend: "up", icon: Building2 },
        { label: "Total Bookings", value: stats?.bookings?.total || 0, change: "All Time", trend: "up", icon: CalendarCheck },
        { label: "Pending Approvals", value: stats?.pendingApprovals || 0, change: "Action Req.", trend: stats?.pendingApprovals > 5 ? "down" : "up", icon: AlertTriangle },
    ];

    const dashboardAlerts = [
        ...(stats?.pendingApprovals > 0 ? [{ type: "warning", message: `${stats.pendingApprovals} pending approval requests`, link: "/approvals" }] : []),
        { type: "info", message: "Network Status: Healthy", link: "/dashboard" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* ── Header ── */}
            <div>
                <h1 className="font-outfit font-bold text-2xl lg:text-3xl">{greeting}, Admin</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    {" "} · Platform Overview
                </p>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((card) => (
                    <div key={card.label} className="glass-card p-5 rounded-2xl">
                        <div className="flex items-center justify-between mb-3">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <card.icon className="size-5 text-primary" />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${card.trend === "up"
                                ? "bg-green-500/10 text-green-400"
                                : "bg-red-500/10 text-red-400"
                                }`}>
                                {card.change}
                            </div>
                        </div>
                        <p className="font-outfit font-bold text-2xl">{card.value}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Alert Center ── */}
            {dashboardAlerts.length > 0 && (
                <div className="glass-card p-5 rounded-2xl">
                    <h2 className="font-outfit font-bold text-lg mb-4 flex items-center gap-2">
                        <AlertTriangle className="size-5 text-yellow-400" />
                        Alert Center
                    </h2>
                    <div className="space-y-3">
                        {dashboardAlerts.map((alert, i) => (
                            <Link
                                key={i}
                                href={alert.link}
                                className={`flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01] ${alert.type === "critical"
                                    ? "bg-red-500/10 border border-red-500/20"
                                    : alert.type === "warning"
                                        ? "bg-yellow-500/10 border border-yellow-500/20"
                                        : "bg-primary/5 border border-primary/10"
                                    }`}
                            >
                                <span className="text-sm font-medium">{alert.message}</span>
                                <ArrowRight className="size-4 text-muted-foreground" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Quick Stats Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performing Branches */}
                <div className="glass-card p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-outfit font-bold text-lg">Top Branches</h2>
                        <Link href="/branches" className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
                            View All <ArrowRight className="size-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {topBranches.map((branch, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{branch.name}</p>
                                        <p className="text-xs text-muted-foreground">{branch.city}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all"
                                            style={{ width: `${branch.occupancy}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-semibold w-10 text-right">{branch.occupancy}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-outfit font-bold text-lg">Recent Activity</h2>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" /> Live
                        </span>
                    </div>
                    <div className="space-y-3">
                        {recentActivity.map((event, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                                <div className="size-2 rounded-full bg-primary mt-2 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold">{event.action}</p>
                                    <p className="text-xs text-muted-foreground truncate">{event.detail}</p>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{event.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Quick Actions ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Review Approvals", href: "/approvals", icon: CheckSquare, count: "3" },
                    { label: "View All Branches", href: "/branches", icon: Building2 },
                    { label: "Manage Pricing", href: "/pricing", icon: DollarSign },
                ].map((action) => (
                    <Link
                        key={action.label}
                        href={action.href}
                        className="glass-card p-5 rounded-2xl flex items-center gap-4 group hover:border-primary/30 transition-all"
                    >
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <action.icon className="size-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-outfit font-semibold text-sm">{action.label}</p>
                        </div>
                        {action.count && (
                            <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                                {action.count}
                            </span>
                        )}
                        <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
