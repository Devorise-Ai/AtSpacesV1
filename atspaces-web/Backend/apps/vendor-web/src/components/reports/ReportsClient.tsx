"use client";

import { useState } from "react";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { TrendingUp, TrendingDown, Minus, Users, XCircle, CheckCircle2, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// ── Mock Data ──────────────────────────────────────────────────────────────────

const OCCUPANCY_DATA = {
    week: [
        { day: "Mon", occupancy: 58 }, { day: "Tue", occupancy: 72 }, { day: "Wed", occupancy: 65 },
        { day: "Thu", occupancy: 88 }, { day: "Fri", occupancy: 44 }, { day: "Sat", occupancy: 30 }, { day: "Sun", occupancy: 20 },
    ],
    month: [
        { day: "Week 1", occupancy: 62 }, { day: "Week 2", occupancy: 74 }, { day: "Week 3", occupancy: 68 }, { day: "Week 4", occupancy: 80 },
    ],
};

const DAILY_VOLUME = {
    week: [
        { day: "Mon", bookings: 14 }, { day: "Tue", bookings: 18 }, { day: "Wed", bookings: 16 },
        { day: "Thu", bookings: 21 }, { day: "Fri", bookings: 11 }, { day: "Sat", bookings: 7 }, { day: "Sun", bookings: 5 },
    ],
    month: [
        { day: "Week 1", bookings: 56 }, { day: "Week 2", bookings: 72 }, { day: "Week 3", bookings: 64 }, { day: "Week 4", bookings: 80 },
    ],
};

const SERVICE_PIE = [
    { name: "Hot Desk", value: 58 },
    { name: "Private Office", value: 28 },
    { name: "Meeting Room", value: 14 },
];

const PIE_COLORS = ["#FF5B04", "#3b82f6", "#8b5cf6"];

const PEAK_HOURS = [
    { hour: "8AM", activity: 20 }, { hour: "9AM", activity: 60 }, { hour: "10AM", activity: 85 },
    { hour: "11AM", activity: 90 }, { hour: "12PM", activity: 70 }, { hour: "1PM", activity: 55 },
    { hour: "2PM", activity: 75 }, { hour: "3PM", activity: 80 }, { hour: "4PM", activity: 65 },
    { hour: "5PM", activity: 40 }, { hour: "6PM", activity: 20 },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, trend, icon: Icon }: {
    label: string; value: string; sub: string; trend: "up" | "down" | "neutral"; icon: React.ElementType;
}) {
    const trendConfig = {
        up: { icon: TrendingUp, color: "text-emerald-500" },
        down: { icon: TrendingDown, color: "text-red-500" },
        neutral: { icon: Minus, color: "text-muted-foreground" },
    };
    const TrendIcon = trendConfig[trend].icon;

    return (
        <Card className="glass-card shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="size-4 text-primary" />
                    </div>
                </div>
                <div>
                    <p className="text-3xl font-bold font-outfit tracking-tight text-foreground">{value}</p>
                    <div className={`flex items-center gap-1 text-xs mt-1 ${trendConfig[trend].color}`}>
                        <TrendIcon className="size-3" />
                        {sub}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const CustomTooltipStyle = {
    contentStyle: {
        background: "rgba(20, 28, 47, 0.9)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        color: "#ffffff",
        fontSize: 12,
        backdropFilter: "blur(10px)",
    },
    labelStyle: { color: "#94a3b8" },
};

// ── Main Component ─────────────────────────────────────────────────────────────

export function ReportsClient() {
    const [range, setRange] = useState<"week" | "month">("week");

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* ── Header ── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between glass-card p-6">
                <div>
                    <h1 className="text-3xl font-bold font-outfit tracking-tight text-foreground">Reports & Analytics</h1>
                    <p className="text-muted-foreground mt-1">Track your branch's performance and occupancy trends.</p>
                </div>
                <Select value={range} onValueChange={(v) => setRange(v as "week" | "month")}>
                    <SelectTrigger className="w-[160px] bg-card">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard label="Total Bookings" value={range === "week" ? "92" : "272"} sub="+12% vs last period" trend="up" icon={Users} />
                <KpiCard label="Avg Occupancy" value={range === "week" ? "68%" : "71%"} sub="+5pts vs last period" trend="up" icon={CheckCircle2} />
                <KpiCard label="No-Show Rate" value={range === "week" ? "4.3%" : "3.8%"} sub="-0.5pts vs last period" trend="down" icon={XCircle} />
                <KpiCard label="Top Service" value="Hot Desk" sub="58% of all bookings" trend="neutral" icon={Star} />
            </div>

            {/* ── Charts Row 1: Occupancy + Service Mix ── */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                <Card className="lg:col-span-2 glass-card">
                    <CardHeader>
                        <h2 className="font-semibold font-outfit text-foreground">Occupancy Over Time (%)</h2>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={OCCUPANCY_DATA[range]}>
                                <defs>
                                    <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF5B04" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#FF5B04" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
                                <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                                <Tooltip {...CustomTooltipStyle} formatter={(v) => [`${v}%`, "Occupancy"]} />
                                <Area type="monotone" dataKey="occupancy" stroke="#FF5B04" strokeWidth={3} fill="url(#occGrad)" dot={{ r: 5, fill: "#FF5B04", stroke: "#0B111F", strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <h2 className="font-semibold font-outfit text-foreground">Bookings by Service</h2>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie data={SERVICE_PIE} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                                    {SERVICE_PIE.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip {...CustomTooltipStyle} formatter={(v) => [`${v}%`, ""]} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2 pt-4">
                            {SERVICE_PIE.map((s, i) => (
                                <div key={s.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="size-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                                        <span className="text-muted-foreground">{s.name}</span>
                                    </div>
                                    <span className="font-semibold text-foreground">{s.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Charts Row 2: Daily Volume + Peak Hours Heatmap ── */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <Card className="glass-card">
                    <CardHeader>
                        <h2 className="font-semibold font-outfit text-foreground">Daily Booking Volume</h2>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={DAILY_VOLUME[range]} barSize={28}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
                                <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip {...CustomTooltipStyle} formatter={(v) => [v, "Bookings"]} />
                                <Bar dataKey="bookings" fill="#FF5B04" radius={[5, 5, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <h2 className="font-semibold font-outfit text-foreground">Peak Hours Activity</h2>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-4">
                        {PEAK_HOURS.map((h, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-xs">
                                <span className="w-10 text-right shrink-0 text-muted-foreground font-medium">{h.hour}</span>
                                <div className="flex-1 h-5 rounded-md bg-secondary overflow-hidden">
                                    <div
                                        className="h-full rounded-md transition-all duration-500"
                                        style={{
                                            width: `${h.activity}%`,
                                            background: h.activity > 75
                                                ? "#FF5B04"
                                                : h.activity > 50
                                                    ? "rgba(255, 91, 4, 0.65)"
                                                    : "rgba(255, 91, 4, 0.35)",
                                        }}
                                    />
                                </div>
                                <span className="w-8 shrink-0 font-semibold text-foreground">{h.activity}%</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* ── Usage Summary ── */}
            <Card className="glass-card">
                <CardHeader>
                    <h2 className="font-semibold font-outfit text-foreground">Weekly Insights</h2>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[
                            { label: "Busiest Day", value: "Thursday", sub: "88% avg occupancy", color: "text-primary" },
                            { label: "Peak Hours", value: "10AM – 12PM", sub: "Consistently above 85%", color: "text-blue-500" },
                            { label: "Quietest Day", value: "Sunday", sub: "Only 20% avg occupancy", color: "text-muted-foreground" },
                        ].map((insight) => (
                            <div key={insight.label} className="rounded-lg bg-secondary/50 p-4 space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{insight.label}</p>
                                <p className={`text-xl font-bold font-outfit ${insight.color}`}>{insight.value}</p>
                                <p className="text-xs text-muted-foreground">{insight.sub}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
