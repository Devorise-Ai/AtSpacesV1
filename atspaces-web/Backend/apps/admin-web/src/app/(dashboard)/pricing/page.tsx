"use client";

import { useState } from "react";
import { DollarSign, Edit3, AlertTriangle, X, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const serviceTypes = ["Hot Desk", "Private Office", "Meeting Room"];

const pricingData: Record<string, Array<{ tier: string; price: string; unit: string; usagePercent: number }>> = {
    "Hot Desk": [
        { tier: "Hourly", price: "3.50", unit: "JOD/hr", usagePercent: 45 },
        { tier: "Half Day (4hr)", price: "12.00", unit: "JOD", usagePercent: 35 },
        { tier: "Full Day", price: "20.00", unit: "JOD", usagePercent: 20 },
    ],
    "Private Office": [
        { tier: "Hourly", price: "8.00", unit: "JOD/hr", usagePercent: 30 },
        { tier: "Half Day (4hr)", price: "28.00", unit: "JOD", usagePercent: 40 },
        { tier: "Full Day", price: "50.00", unit: "JOD", usagePercent: 30 },
    ],
    "Meeting Room": [
        { tier: "Hourly", price: "12.00", unit: "JOD/hr", usagePercent: 70 },
        { tier: "Half Day (4hr)", price: "40.00", unit: "JOD", usagePercent: 20 },
        { tier: "Full Day", price: "70.00", unit: "JOD", usagePercent: 10 },
    ],
};

const policies = [
    { name: "Cancellation Window", value: "2 hours before start", description: "Time before booking start for free cancellation." },
    { name: "Late Cancellation Fee", value: "50% of booking", description: "Fee charged for cancellations within the window." },
    { name: "No-Show Penalty", value: "100% of booking", description: "Fee for not showing up to a confirmed booking." },
    { name: "Max Bookings Per Day", value: "3 per user", description: "Limit on bookings a single user can make per day." },
    { name: "Late Arrival Grace", value: "15 minutes", description: "Grace period before a booking is considered a no-show." },
];

export default function PricingPage() {
    const [activeService, setActiveService] = useState("Hot Desk");
    const [editModal, setEditModal] = useState<{ tier: string; price: string; service: string } | null>(null);
    const [newPrice, setNewPrice] = useState("");

    const handleEditOpen = (tier: string, price: string) => {
        setEditModal({ tier, price, service: activeService });
        setNewPrice(price);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-outfit font-bold text-2xl lg:text-3xl">Pricing & Policies</h1>
                <p className="text-muted-foreground text-sm mt-1">Centralized pricing control across the network.</p>
            </div>

            {/* Service Type Tabs */}
            <div className="flex p-1 rounded-xl bg-muted/50 w-full sm:w-fit overflow-x-auto">
                {serviceTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveService(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeService === type
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Pricing Table */}
            <div className="glass-card p-5 rounded-2xl">
                <h2 className="font-outfit font-bold text-lg mb-4">{activeService} Pricing</h2>
                <div className="space-y-3">
                    {pricingData[activeService]?.map((item) => (
                        <div key={item.tier} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 p-3 sm:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div>
                                <p className="font-outfit font-semibold text-sm">{item.tier}</p>
                                <p className="text-xs text-muted-foreground">{item.usagePercent}% of bookings</p>
                            </div>
                            <div className="flex items-center gap-3 sm:ml-auto">
                                <p className="font-outfit font-bold text-xl">{item.price} <span className="text-xs text-muted-foreground font-normal">{item.unit}</span></p>
                                <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => handleEditOpen(item.tier, item.price)}>
                                    <Edit3 className="size-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Policies */}
            <div className="glass-card p-5 rounded-2xl">
                <h2 className="font-outfit font-bold text-lg mb-4">Booking Policies</h2>
                <div className="space-y-3">
                    {policies.map((policy) => (
                        <div key={policy.name} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-outfit font-semibold text-sm">{policy.name}</p>
                                    <div className="group relative">
                                        <Info className="size-3.5 text-muted-foreground cursor-help" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-popover text-popover-foreground text-xs shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                            {policy.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="font-outfit font-bold text-sm text-primary">{policy.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Pricing Modal */}
            {editModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setEditModal(null)} />
                    <div className="relative glass-card p-6 rounded-2xl max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-outfit font-bold text-lg">Edit Pricing</h3>
                            <button onClick={() => setEditModal(null)} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"><X className="size-4" /></button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{editModal.service} — {editModal.tier}</p>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold font-outfit mb-2">New Price (JOD)</label>
                            <input type="number" step="0.50" value={newPrice} onChange={(e) => setNewPrice(e.target.value)}
                                className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                        </div>
                        {/* Impact Simulation */}
                        <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="size-4 text-yellow-400" />
                                <span className="text-xs font-bold text-yellow-400">Impact Simulation</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This change affects <strong className="text-foreground">~120 future bookings</strong> across <strong className="text-foreground">42 branches</strong>.
                                Estimated revenue change: <strong className="text-primary">+850 JOD/month</strong>.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditModal(null)}>Cancel</Button>
                            <Button className="flex-1 rounded-xl"><Check className="size-4 mr-1" /> Update Price</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
