"use client";

import { useState, useEffect } from "react";
import {
    Users, Search, Star, TrendingUp, MapPin, Mail, Plus, Pause, Play, ArrowRight, X, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { adminService } from "@/services/admin.service";

function getStatusStyle(status: string) {
    switch (status) {
        case "Active": return "bg-green-500/10 text-green-400";
        case "Under Review": return "bg-yellow-500/10 text-yellow-400";
        case "Suspended": return "bg-red-500/10 text-red-400";
        default: return "bg-muted text-muted-foreground";
    }
}

function getReliabilityColor(score: number) {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-yellow-400";
    return "text-red-400";
}

export default function VendorsPage() {
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteName, setInviteName] = useState("");

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const data = await adminService.listUsers();
                // Filter users to only include vendors
                const vendorList = data.filter((u: any) => u.role === "vendor");
                setVendors(vendorList);
            } catch (err) {
                console.error("Failed to fetch vendors", err);
                setError("Failed to load vendors");
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, []);

    const filtered = vendors.filter((v) =>
        !search || v.fullName.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-outfit font-bold text-2xl lg:text-3xl">Vendor Management</h1>
                    <p className="text-muted-foreground text-sm mt-1">{vendors.length} vendors in the network.</p>
                </div>
                <Button className="rounded-xl" onClick={() => setShowInviteModal(true)}>
                    <Plus className="size-4 mr-1" /> Invite Vendor
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                    type="text" placeholder="Search vendors by name or email..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {filtered.map((vendor) => (
                    <div key={vendor.id} className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col gap-3 sm:gap-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center font-outfit font-bold text-primary text-lg">
                                    {vendor.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-outfit font-bold text-sm">{vendor.name}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="size-3" /> {vendor.email}</p>
                                </div>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getStatusStyle(vendor.status)}`}>{vendor.status}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="glass-panel p-3 rounded-xl text-center">
                                <p className={`font-outfit font-bold text-lg ${getReliabilityColor(vendor.reliability)}`}>{vendor.reliability}%</p>
                                <p className="text-[10px] text-muted-foreground">Reliability</p>
                            </div>
                            <div className="glass-panel p-3 rounded-xl text-center">
                                <p className="font-outfit font-bold text-lg">{vendor.checkIn}%</p>
                                <p className="text-[10px] text-muted-foreground">Check-In</p>
                            </div>
                            <div className="glass-panel p-3 rounded-xl text-center">
                                <p className="font-outfit font-bold text-lg">{vendor.noShow}%</p>
                                <p className="text-[10px] text-muted-foreground">No-Show</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{vendor.branches} branch{vendor.branches > 1 ? "es" : ""}</span>
                            <span>Joined {vendor.joinedDate}</span>
                        </div>

                        <Link href={`/vendors/${vendor.id}`}>
                            <Button variant="outline" size="sm" className="w-full rounded-xl text-xs h-9">
                                View Profile <ArrowRight className="size-3 ml-1" />
                            </Button>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Invite Vendor Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />
                    <div className="relative glass-card p-6 rounded-2xl max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-outfit font-bold text-lg">Invite Vendor</h3>
                            <button onClick={() => setShowInviteModal(false)} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"><X className="size-4" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold font-outfit mb-2">Full Name</label>
                                <input type="text" value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Vendor full name"
                                    className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold font-outfit mb-2">Email</label>
                                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="vendor@example.com"
                                    className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowInviteModal(false)}>Cancel</Button>
                            <Button className="flex-1 rounded-xl" disabled={!inviteEmail || !inviteName}>
                                <Send className="size-4 mr-1" /> Send Invitation
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
