"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, ArrowRight, TrendingUp, TrendingDown, Users, Building2, CalendarCheck } from "lucide-react";

// Mock data
const VENDOR_NAME = "Yazeed (The Lord Commander)";
const BRANCH_NAME = "The Corner Hub — Amman";

const TODAY_STATS = {
    totalBookings: 18,
    hotDesk: 11,
    privateOffice: 4,
    meetingRoom: 3,
    checkedIn: 7,
    noShows: 1,
    occupancyPct: 72,
};

const UPCOMING_CHECKINS = [
    { id: "B-1001", customer: "Sarah Ahmad", service: "Hot Desk", time: "10:00 AM", status: "Upcoming" },
    { id: "B-1002", customer: "Khalid Tech LLC", service: "Private Office A", time: "10:30 AM", status: "Upcoming" },
    { id: "B-1003", customer: "Omar Designs", service: "Meeting Room", time: "11:00 AM", status: "Upcoming" },
    { id: "B-1007", customer: "Randa Bakr", service: "Hot Desk", time: "12:00 PM", status: "Upcoming" },
    { id: "B-1009", customer: "Nour Startup", service: "Hot Desk", time: "1:00 PM", status: "Upcoming" },
];

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

export function DashboardClient() {
    const [checkins, setCheckins] = useState(UPCOMING_CHECKINS);
    const status = getBranchStatus(TODAY_STATS.occupancyPct);
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const dateStr = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    const handleCheckin = (id: string) => {
        setCheckins(prev => prev.map(b => b.id === id ? { ...b, status: "Checked-In" } : b));
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
                    <p className="text-muted-foreground mt-1">{BRANCH_NAME}</p>
                </div>

                {/* Branch Status Badge */}
                <div className={`inline-flex items-center gap-2.5 rounded-xl border px-5 py-3 ${status.bg}`}>
                    <span className={`relative flex size-2.5`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.dot} opacity-60`}></span>
                        <span className={`relative inline-flex rounded-full size-2.5 ${status.dot}`}></span>
                    </span>
                    <div>
                        <p className={`font-bold text-sm ${status.color}`}>{status.label}</p>
                        <p className="text-xs text-muted-foreground">{TODAY_STATS.occupancyPct}% occupied today</p>
                    </div>
                </div>
            </div>

            {/* ── Metric Cards ── */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Today's Bookings" value={TODAY_STATS.totalBookings} sub="+3 vs yesterday" icon={CalendarCheck} trend="up" />
                <MetricCard label="Checked In" value={TODAY_STATS.checkedIn} sub={`of ${TODAY_STATS.totalBookings} total`} icon={CheckCircle2} trend="neutral" />
                <MetricCard label="No-Shows" value={TODAY_STATS.noShows} sub="so far today" icon={XCircle} trend="neutral" />
                <MetricCard label="Capacity Used" value={`${TODAY_STATS.occupancyPct}%`} sub="across all services" icon={Building2} trend="up" />
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
                            { label: "Hot Desks", count: TODAY_STATS.hotDesk, total: 15, color: "bg-primary" },
                            { label: "Private Offices", count: TODAY_STATS.privateOffice, total: 5, color: "bg-blue-500" },
                            { label: "Meeting Rooms", count: TODAY_STATS.meetingRoom, total: 3, color: "bg-violet-500" },
                        ].map((s) => {
                            const pct = Math.round((s.count / s.total) * 100);
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
                        {checkins.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center rounded-lg border border-dashed border-border/50">
                                <CheckCircle2 className="size-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium text-foreground">All caught up!</p>
                                <p className="text-xs text-muted-foreground mt-1">No more upcoming check-ins scheduled.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {checkins.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${booking.status === "Checked-In" ? "border-emerald-500/30 bg-emerald-500/5" : "bg-background hover:bg-muted/30"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${booking.status === "Checked-In" ? "bg-emerald-500/20 text-emerald-500" : "bg-secondary text-muted-foreground"
                                                }`}>
                                                {booking.customer.split(" ").map(n => n[0]).join("").slice(0, 2)}
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
