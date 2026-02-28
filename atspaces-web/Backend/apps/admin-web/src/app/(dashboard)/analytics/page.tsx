"use client";

import { useState } from "react";
import {
    TrendingUp, TrendingDown, CalendarCheck, Activity, DollarSign, UserX, Receipt,
    Download, ArrowUpDown
} from "lucide-react";
import { Button } from "@repo/ui/button";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, LineChart, Line,
} from "recharts";

const dateRanges = ["Today", "This Week", "This Month", "Custom"];

const kpiCards = [
    { label: "Total Bookings", value: "1,247", change: "+18%", trend: "up", icon: CalendarCheck },
    { label: "Avg Occupancy", value: "73%", change: "+5%", trend: "up", icon: Activity },
    { label: "Total Revenue", value: "28,450 JOD", change: "+12%", trend: "up", icon: DollarSign },
    { label: "No-Show Rate", value: "4.2%", change: "-1.3%", trend: "down", icon: UserX },
    { label: "Avg Booking Value", value: "22.8 JOD", change: "+2%", trend: "up", icon: Receipt },
];

const occupancyByCity = [
    { city: "Amman", occupancy: 78 },
    { city: "Irbid", occupancy: 65 },
    { city: "Zarqa", occupancy: 58 },
    { city: "Aqaba", occupancy: 71 },
    { city: "Salt", occupancy: 45 },
    { city: "Madaba", occupancy: 52 },
];

const serviceUsage = [
    { name: "Hot Desk", value: 55, color: "#FF5B04" },
    { name: "Private Office", value: 28, color: "#3B82F6" },
    { name: "Meeting Room", value: 17, color: "#10B981" },
];

const bookingsOverTime = [
    { date: "Mon", bookings: 32 }, { date: "Tue", bookings: 45 },
    { date: "Wed", bookings: 38 }, { date: "Thu", bookings: 52 },
    { date: "Fri", bookings: 28 }, { date: "Sat", bookings: 15 },
    { date: "Sun", bookings: 12 },
];

const revenueOverTime = [
    { month: "Sep", current: 18500, previous: 15200 },
    { month: "Oct", current: 22300, previous: 18900 },
    { month: "Nov", current: 24100, previous: 21000 },
    { month: "Dec", current: 20800, previous: 23400 },
    { month: "Jan", current: 26700, previous: 22100 },
    { month: "Feb", current: 28450, previous: 24800 },
];

const peakHours = [
    { hour: "8am", Mon: 2, Tue: 3, Wed: 4, Thu: 3, Fri: 2 },
    { hour: "9am", Mon: 5, Tue: 6, Wed: 7, Thu: 6, Fri: 5 },
    { hour: "10am", Mon: 8, Tue: 9, Wed: 9, Thu: 8, Fri: 7 },
    { hour: "11am", Mon: 9, Tue: 10, Wed: 10, Thu: 9, Fri: 8 },
    { hour: "12pm", Mon: 7, Tue: 8, Wed: 7, Thu: 7, Fri: 6 },
    { hour: "1pm", Mon: 6, Tue: 7, Wed: 6, Thu: 6, Fri: 5 },
    { hour: "2pm", Mon: 8, Tue: 9, Wed: 8, Thu: 8, Fri: 7 },
    { hour: "3pm", Mon: 9, Tue: 10, Wed: 9, Thu: 9, Fri: 8 },
    { hour: "4pm", Mon: 7, Tue: 8, Wed: 7, Thu: 7, Fri: 6 },
    { hour: "5pm", Mon: 4, Tue: 5, Wed: 4, Thu: 4, Fri: 3 },
];

const branchPerformance = [
    { name: "Amman Downtown Hub", city: "Amman", occupancy: 92, bookings: 156, revenue: "4,230 JOD", status: "Active" },
    { name: "Abdali Business Center", city: "Amman", occupancy: 87, bookings: 134, revenue: "3,890 JOD", status: "Active" },
    { name: "Irbid Innovation Lab", city: "Irbid", occupancy: 81, bookings: 98, revenue: "2,450 JOD", status: "Active" },
    { name: "Aqaba Marina Space", city: "Aqaba", occupancy: 76, bookings: 87, revenue: "2,180 JOD", status: "Active" },
    { name: "Zarqa Tech Park", city: "Zarqa", occupancy: 71, bookings: 76, revenue: "1,890 JOD", status: "Active" },
    { name: "Salt Creative Hub", city: "Salt", occupancy: 45, bookings: 34, revenue: "850 JOD", status: "Under Review" },
];

function getHeatColor(val: number) {
    if (val >= 9) return "bg-primary text-primary-foreground";
    if (val >= 7) return "bg-primary/60 text-white";
    if (val >= 5) return "bg-primary/30 text-foreground";
    if (val >= 3) return "bg-primary/15 text-foreground";
    return "bg-muted text-muted-foreground";
}

export default function AnalyticsPage() {
    const [selectedRange, setSelectedRange] = useState("This Month");

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="font-outfit font-bold text-2xl lg:text-3xl">Network Analytics</h1>
                    <p className="text-muted-foreground text-sm mt-1">Data-driven insights across the AtSpaces network.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex p-1 rounded-xl bg-muted/50 overflow-x-auto">
                        {dateRanges.map((range) => (
                            <button
                                key={range}
                                onClick={() => setSelectedRange(range)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${selectedRange === range
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl h-9">
                        <Download className="size-4 mr-1" /> Export
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {kpiCards.map((card) => (
                    <div key={card.label} className="glass-card p-4 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <card.icon className="size-4 text-muted-foreground" />
                            <span className={`text-xs font-semibold flex items-center gap-0.5 ${card.trend === "up" ? "text-green-400" : "text-red-400"
                                }`}>
                                {card.trend === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                {card.change}
                            </span>
                        </div>
                        <p className="font-outfit font-bold text-xl">{card.value}</p>
                        <p className="text-muted-foreground text-[11px] mt-0.5">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Occupancy by City */}
                <div className="glass-card p-5 rounded-2xl">
                    <h2 className="font-outfit font-bold text-lg mb-4">Occupancy by City</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={occupancyByCity}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="city" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                            <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} unit="%" />
                            <Tooltip
                                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                            />
                            <Bar dataKey="occupancy" fill="#FF5B04" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Service Usage */}
                <div className="glass-card p-5 rounded-2xl">
                    <h2 className="font-outfit font-bold text-lg mb-4">Service Usage Distribution</h2>
                    <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={serviceUsage}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {serviceUsage.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-2">
                        {serviceUsage.map((s) => (
                            <div key={s.name} className="flex items-center gap-2">
                                <div className="size-3 rounded-full" style={{ background: s.color }} />
                                <span className="text-xs text-muted-foreground">{s.name} ({s.value}%)</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bookings Over Time */}
                <div className="glass-card p-5 rounded-2xl">
                    <h2 className="font-outfit font-bold text-lg mb-4">Bookings This Week</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={bookingsOverTime}>
                            <defs>
                                <linearGradient id="bookingsGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF5B04" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#FF5B04" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                            <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                            <Area type="monotone" dataKey="bookings" stroke="#FF5B04" fill="url(#bookingsGrad)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Over Time */}
                <div className="glass-card p-5 rounded-2xl">
                    <h2 className="font-outfit font-bold text-lg mb-4">Revenue Comparison (JOD)</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={revenueOverTime}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                            <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                            <Line type="monotone" dataKey="current" stroke="#FF5B04" strokeWidth={2} dot={{ r: 4 }} name="This Period" />
                            <Line type="monotone" dataKey="previous" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Previous" />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-6 mt-2">
                        <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-primary rounded" /><span className="text-xs text-muted-foreground">Current</span></div>
                        <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-gray-500 rounded border-dashed" /><span className="text-xs text-muted-foreground">Previous</span></div>
                    </div>
                </div>
            </div>

            {/* Peak Hours Heatmap */}
            <div className="glass-card p-5 rounded-2xl">
                <h2 className="font-outfit font-bold text-lg mb-4">Peak Hours Heatmap</h2>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[400px]">
                        <thead>
                            <tr>
                                <th className="text-xs text-muted-foreground font-medium p-2 text-left">Time</th>
                                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                                    <th key={day} className="text-xs text-muted-foreground font-medium p-2 text-center">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {peakHours.map((row) => (
                                <tr key={row.hour}>
                                    <td className="text-xs text-muted-foreground p-2">{row.hour}</td>
                                    {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => {
                                        const val = row[day as keyof typeof row] as number;
                                        return (
                                            <td key={day} className="p-1.5">
                                                <div className={`h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${getHeatColor(val)}`}>
                                                    {val}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Branch Performance Table */}
            <div className="glass-card p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-outfit font-bold text-lg">Branch Performance</h2>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                        <ArrowUpDown className="size-3 mr-1" /> Sort
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="border-b border-border/50">
                                <th className="text-xs text-muted-foreground font-medium py-3 px-3 text-left">Branch</th>
                                <th className="text-xs text-muted-foreground font-medium py-3 px-3 text-left">City</th>
                                <th className="text-xs text-muted-foreground font-medium py-3 px-3 text-center">Occupancy</th>
                                <th className="text-xs text-muted-foreground font-medium py-3 px-3 text-center">Bookings</th>
                                <th className="text-xs text-muted-foreground font-medium py-3 px-3 text-right">Revenue</th>
                                <th className="text-xs text-muted-foreground font-medium py-3 px-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branchPerformance.map((branch, i) => (
                                <tr key={i} className="border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer">
                                    <td className="py-3 px-3 text-sm font-semibold">{branch.name}</td>
                                    <td className="py-3 px-3 text-sm text-muted-foreground">{branch.city}</td>
                                    <td className="py-3 px-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                                                <div className="h-full rounded-full bg-primary" style={{ width: `${branch.occupancy}%` }} />
                                            </div>
                                            <span className="text-xs font-semibold">{branch.occupancy}%</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-sm text-center font-medium">{branch.bookings}</td>
                                    <td className="py-3 px-3 text-sm text-right font-semibold">{branch.revenue}</td>
                                    <td className="py-3 px-3 text-center">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${branch.status === "Active"
                                            ? "bg-green-500/10 text-green-400"
                                            : "bg-yellow-500/10 text-yellow-400"
                                            }`}>{branch.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
