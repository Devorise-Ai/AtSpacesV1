"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@repo/ui/card";
import { CheckCircle2, XCircle, Clock, ArrowRight, TrendingUp, TrendingDown, Users, Building2, CalendarCheck } from "lucide-react";
import { vendorService } from "@/services/vendor.service";
import { bookingService } from "@/services/booking.service";

// Mock data (Fallback)
const VENDOR_NAME = "Yazeed";

export default function DashboardClient() {
    const [stats, setStats] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, bookingsData] = await Promise.all([
                    vendorService.getDashboardStats(),
                    bookingService.getVendorBookings(),
                ]);
                setStats(statsData);
                setBookings(bookingsData);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }
    const upcomingCheckins = bookings
        .filter(b => b.status === "upcoming" || b.status === "Upcoming")
        .slice(0, 5)
        .map(b => ({
            id: b.bookingNumber || b.id,
            customer: b.customerName || `Customer #${b.customerId}`,
            service: b.serviceName || "Workspace",
            time: new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: b.status
        }));

    function getBranchStatus(pct: number) {
        if (pct < 50) return { label: "Calm", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/30", dot: "bg-emerald-500" };
        if (pct < 80) return { label: "Moderate", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/30", dot: "bg-amber-500" };
        return { label: "Busy", color: "text-red-500", bg: "bg-red-500/10 border-red-500/30", dot: "bg-red-500" };
    }

    function MetricCard({ label, value, sub, icon: Icon, trend }: {
        label: string; value: string | number; sub?: string; icon: React.ElementType; trend?: "up" | "down" | "neutral";
    }) {
        return (
            <Card className="glass-card shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-muted-foreground">{label}</p>
                        <div className="rounded-lg bg-primary/10 p-2">
                            <Icon className="size-4 text-primary" />
                        </div>
                    </div>
                    <div>
                        <p className="text-3xl font-bold font-outfit tracking-tight text-foreground">{value}</p>
                        {sub && (
                            <p className={`flex items-center gap-1 text-xs mt-1 ${trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"}`}>
                                {trend === "up" && <TrendingUp className="size-3" />}
                                {trend === "down" && <TrendingDown className="size-3" />}
                                {sub}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const status = getBranchStatus(stats?.occupancyPct || 0);
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const dateStr = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    const handleCheckin = async (id: number) => {
        try {
            await bookingService.checkIn(id);
            const data = await bookingService.getVendorBookings();
            setBookings(data);
        } catch (err) {
            console.error("Failed to check in", err);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* ── Greeting Header ── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between glass-card p-6 border-l-4 border-l-primary">
                <div>
                    <p className="text-sm text-muted-foreground">{dateStr}</p>
                    <h1 className="text-3xl font-bold font-outfit tracking-tight text-foreground mt-0.5">
                        {greeting}, {VENDOR_NAME} 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">Vendor Dashboard Overview</p>
                </div>

                {/* Branch Status Badge */}
                <div className={`inline-flex items-center gap-2.5 rounded-xl border px-5 py-3 ${status.bg}`}>
                    <span className={`relative flex size-2.5`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.dot} opacity-60`}></span>
                        <span className={`relative inline-flex rounded-full size-2.5 ${status.dot}`}></span>
                    </span>
                    <div>
                        <p className={`font-bold text-sm ${status.color}`}>{status.label}</p>
                        <p className="text-xs text-muted-foreground">{stats?.occupancyPct || 0}% occupied today</p>
                    </div>
                </div>
            </div>

            {/* ── Metric Cards ── */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Today's Bookings" value={bookings.length} sub={`${bookings.filter(b => b.status === 'upcoming').length} upcoming`} icon={CalendarCheck} trend="up" />
                <MetricCard label="Total Branches" value={stats?.totalBranches || 0} sub={`${stats?.activeBranches || 0} active`} icon={Building2} trend="up" />
                <MetricCard label="Total Services" value={stats?.totalServices || 0} sub="Across branches" icon={Users} trend="neutral" />
                <MetricCard label="Pending Items" value={stats?.pendingBranches || 0} sub="Action required" icon={Clock} trend="neutral" />
            </div>

            {/* ── Today's Breakdown + Upcoming Check-ins ── */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">

                {/* Breakdown card */}
                <Card className="lg:col-span-2 glass-card">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold font-outfit text-foreground">Service Breakdown</h2>
                            <Users className="size-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {[
                            { label: "Hot Desks", count: 0, total: 15, color: "bg-primary" },
                            { label: "Private Offices", count: 0, total: 5, color: "bg-blue-500" },
                            { label: "Meeting Rooms", count: 0, total: 3, color: "bg-violet-500" },
                        ].map((s) => {
                            const pct = Math.round((s.count / s.total) * 100) || 0;
                            return (
                                <div key={s.label} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-foreground">{s.label}</span>
                                        <span className="text-muted-foreground">{s.count} / {s.total}</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${s.color}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground text-right">{pct}% booked</p>
                                </div>
                            );
                        })}

                        {/* Quick Actions */}
                        <div className="pt-3 border-t grid grid-cols-2 gap-2">
                            <Link href="/capacity">
                                <Button variant="outline" size="sm" className="w-full text-xs">Manage Capacity</Button>
                            </Link>
                            <Link href="/bookings">
                                <Button variant="outline" size="sm" className="w-full text-xs">All Bookings</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming check-ins */}
                <Card className="lg:col-span-3 glass-card">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold font-outfit text-foreground">Upcoming Check-Ins</h2>
                            <Link href="/bookings" className="flex items-center gap-1 text-xs text-primary hover:underline">
                                View all <ArrowRight className="size-3" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {upcomingCheckins.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center rounded-lg border border-dashed border-border/50">
                                <CheckCircle2 className="size-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium text-foreground">All caught up!</p>
                                <p className="text-xs text-muted-foreground mt-1">No more upcoming check-ins scheduled.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcomingCheckins.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${booking.status === "Checked-In" ? "border-emerald-500/30 bg-emerald-500/5" : "bg-background hover:bg-muted/30"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${booking.status === "Checked-In" ? "bg-emerald-500/20 text-emerald-500" : "bg-secondary text-muted-foreground"
                                                }`}>
                                                {booking.customer.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground leading-none">{booking.customer}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{booking.service} · {booking.time}</p>
                                            </div>
                                        </div>

                                        {booking.status === "Checked-In" ? (
                                            <Badge variant="outline" className="text-emerald-500 border-emerald-500/50 bg-emerald-500/10 text-xs shrink-0">
                                                ✓ Checked In
                                            </Badge>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 shrink-0 text-xs border-primary/50 text-primary hover:bg-primary hover:text-white transition-colors"
                                                onClick={() => handleCheckin(booking.id)}
                                            >
                                                <Clock className="size-3 mr-1" />
                                                Check In
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
