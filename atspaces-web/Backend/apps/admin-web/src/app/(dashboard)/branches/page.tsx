"use client";

import { useState, useEffect } from "react";
import {
    Building2, Search, Filter, MapPin, Users, Plus, Pause, Play,
    TrendingUp, CalendarCheck, AlertTriangle, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { adminService } from "@/services/admin.service";

const statuses = ["All", "Active", "Under Review", "Paused", "Inactive"];
const cities = ["All Cities", "Amman", "Irbid", "Zarqa", "Aqaba", "Salt", "Madaba"];

function getStatusStyle(status: string) {
    switch (status) {
        case "Active": return "bg-green-500/10 text-green-400";
        case "Under Review": return "bg-yellow-500/10 text-yellow-400";
        case "Paused": return "bg-red-500/10 text-red-400";
        case "Inactive": return "bg-muted text-muted-foreground";
        default: return "bg-muted text-muted-foreground";
    }
}

export default function BranchesPage() {
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [cityFilter, setCityFilter] = useState("All Cities");
    const [suspendDialog, setSuspendDialog] = useState<{ id: string; name: string; action: "pause" | "resume" } | null>(null);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const data = await adminService.listBranches();
                setBranches(data);
            } catch (err) {
                console.error("Failed to fetch branches", err);
                setError("Failed to load branches");
            } finally {
                setLoading(false);
            }
        };
        fetchBranches();
    }, []);

    const filtered = branches.filter((b) => {
        const matchesStatus = statusFilter === "All" || b.status?.toLowerCase() === statusFilter.toLowerCase();
        const matchesCity = cityFilter === "All Cities" || b.city === cityFilter;
        const matchesSearch = !search || b.name.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesCity && matchesSearch;
    });

    const handleSuspendConfirm = () => {
        // In real app: API call to pause/resume branch
        setSuspendDialog(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-outfit font-bold text-2xl lg:text-3xl">Branch Management</h1>
                    <p className="text-muted-foreground text-sm mt-1">{branches.length} branches across the network.</p>
                </div>
                <Button className="rounded-xl">
                    <Plus className="size-4 mr-1" /> Add Branch
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search branches..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto sm:overflow-visible">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 px-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer"
                    >
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="h-10 px-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer"
                    >
                        {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Branch Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {filtered.map((branch) => (
                    <div key={branch.id} className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col gap-3 sm:gap-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-outfit font-bold text-base">{branch.name}</h3>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin className="size-3" /> {branch.city}
                                </p>
                            </div>
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${getStatusStyle(branch.status)}`}>
                                {branch.status}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="size-3" /> {branch.vendor?.fullName || "Unassigned"}
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1 glass-panel p-3 rounded-xl text-center">
                                <p className="font-outfit font-bold text-lg">{branch.occupancy || 0}%</p>
                                <p className="text-[10px] text-muted-foreground">Occupancy</p>
                            </div>
                            <div className="flex-1 glass-panel p-3 rounded-xl text-center">
                                <p className="font-outfit font-bold text-lg">0</p>
                                <p className="text-[10px] text-muted-foreground">Today</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 min-h-[20px]">
                            {branch.vendorServices?.map((vs: any) => (
                                <span key={vs.id} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{vs.name || vs.service?.name}</span>
                            ))}
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-border/30">
                            <Link href={`/branches/${branch.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full rounded-xl text-xs h-9">
                                    View Details <ArrowRight className="size-3 ml-1" />
                                </Button>
                            </Link>
                            {branch.status === "Active" ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl text-xs h-9 text-yellow-500 hover:bg-yellow-500/10"
                                    onClick={() => setSuspendDialog({ id: branch.id, name: branch.name, action: "pause" })}
                                >
                                    <Pause className="size-3 mr-1" /> Pause
                                </Button>
                            ) : branch.status === "Paused" ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl text-xs h-9 text-green-400 hover:bg-green-500/10"
                                    onClick={() => setSuspendDialog({ id: branch.id, name: branch.name, action: "resume" })}
                                >
                                    <Play className="size-3 mr-1" /> Resume
                                </Button>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="glass-card p-12 rounded-2xl text-center">
                    <Building2 className="size-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-outfit font-bold text-lg mb-1">No branches found</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
                </div>
            )}

            {/* Suspension Confirmation Dialog */}
            {suspendDialog && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSuspendDialog(null)} />
                    <div className="relative glass-card p-6 rounded-2xl max-w-md w-full shadow-2xl">
                        <div className="size-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="size-6 text-yellow-400" />
                        </div>
                        <h3 className="font-outfit font-bold text-lg text-center mb-2">
                            {suspendDialog.action === "pause" ? "Pause Branch?" : "Resume Branch?"}
                        </h3>
                        <p className="text-sm text-muted-foreground text-center mb-6">
                            {suspendDialog.action === "pause"
                                ? `Pausing "${suspendDialog.name}" will prevent new bookings. Existing bookings will not be cancelled.`
                                : `Resuming "${suspendDialog.name}" will allow new bookings to be made.`
                            }
                        </p>
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setSuspendDialog(null)}>
                                Cancel
                            </Button>
                            <Button
                                className={`flex-1 rounded-xl ${suspendDialog.action === "pause" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}
                                onClick={handleSuspendConfirm}
                            >
                                {suspendDialog.action === "pause" ? "Pause Branch" : "Resume Branch"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
