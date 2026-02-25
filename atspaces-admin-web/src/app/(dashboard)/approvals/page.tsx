"use client";

import { useState } from "react";
import {
    CheckSquare, XCircle, Clock, MessageSquare, Filter,
    ChevronDown, AlertTriangle, ArrowUpDown, Check, X, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = ["All", "Pending", "Approved", "Rejected"];

const requests = [
    {
        id: "REQ-001", type: "Capacity Change", vendor: "Mohammed Al-Khatib", branch: "Amman Downtown Hub",
        submitted: "Feb 22, 2026", priority: "High", status: "Pending",
        summary: "Increase Hot Desk capacity from 30 to 45 seats",
        current: "30 desks", requested: "45 desks",
        reason: "Due to increasing demand and recent renovations, we have space for 15 additional desks.",
        impact: { bookings: 0, revenue: "+2,400 JOD/month est.", reliability: 94 }
    },
    {
        id: "REQ-002", type: "Branch Pause", vendor: "Dina Masri", branch: "Salt Creative Hub",
        submitted: "Feb 20, 2026", priority: "Medium", status: "Pending",
        summary: "Temporary branch pause for 2 weeks — maintenance",
        current: "Active", requested: "Paused (14 days)",
        reason: "Scheduled HVAC maintenance and interior refresh. Expected completion by March 6.",
        impact: { bookings: 8, revenue: "-1,200 JOD est.", reliability: 87 }
    },
    {
        id: "REQ-003", type: "Capacity Change", vendor: "Ahmad Yousef", branch: "Irbid Innovation Lab",
        submitted: "Feb 18, 2026", priority: "Low", status: "Pending",
        summary: "Add 1 new meeting room (8 person capacity)",
        current: "2 rooms", requested: "3 rooms",
        reason: "We've converted a storage area into a meeting-ready space.",
        impact: { bookings: 0, revenue: "+800 JOD/month est.", reliability: 91 }
    },
    {
        id: "REQ-004", type: "Capacity Change", vendor: "Sara Hassan", branch: "Abdali Business Center",
        submitted: "Feb 15, 2026", priority: "High", status: "Approved",
        summary: "Reduce Private Office count from 12 to 10",
        current: "12 offices", requested: "10 offices",
        reason: "Converting 2 offices into an expanded common area.",
        impact: { bookings: 3, revenue: "-1,800 JOD/month est.", reliability: 96 }
    },
    {
        id: "REQ-005", type: "Capacity Change", vendor: "Omar Nabil", branch: "Zarqa Tech Park",
        submitted: "Feb 12, 2026", priority: "Medium", status: "Rejected",
        summary: "Increase Hot Desk to 100 seats",
        current: "20 desks", requested: "100 desks",
        reason: "Expecting large corporate partnership.",
        impact: { bookings: 0, revenue: "+8,000 JOD/month est.", reliability: 72 }
    },
];

function getStatusStyle(status: string) {
    switch (status) {
        case "Pending": return "bg-yellow-500/10 text-yellow-400";
        case "Approved": return "bg-green-500/10 text-green-400";
        case "Rejected": return "bg-red-500/10 text-red-400";
        default: return "bg-muted text-muted-foreground";
    }
}

function getPriorityStyle(priority: string) {
    switch (priority) {
        case "High": return "bg-red-500/10 text-red-400";
        case "Medium": return "bg-yellow-500/10 text-yellow-400";
        case "Low": return "bg-green-500/10 text-green-400";
        default: return "bg-muted text-muted-foreground";
    }
}

export default function ApprovalsPage() {
    const [activeTab, setActiveTab] = useState("All");
    const [selectedRequest, setSelectedRequest] = useState<typeof requests[0] | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const filtered = activeTab === "All"
        ? requests
        : requests.filter((r) => r.status === activeTab);

    const handleApprove = (id: string) => {
        // In real app: API call
        setSelectedRequest(null);
    };

    const handleReject = () => {
        // In real app: API call with rejectReason
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedRequest(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-outfit font-bold text-2xl lg:text-3xl">Approvals</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Review and process vendor requests.
                    <span className="ml-2 text-yellow-400 font-semibold">{requests.filter(r => r.status === "Pending").length} pending</span>
                </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/50 w-full sm:w-fit overflow-x-auto">
                {tabs.map((tab) => {
                    const count = tab === "All" ? requests.length : requests.filter(r => r.status === tab).length;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === tab
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab ? "bg-white/20" : "bg-muted"}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Request List */}
            <div className="space-y-3">
                {filtered.map((req) => (
                    <div
                        key={req.id}
                        className="glass-card p-4 sm:p-5 rounded-2xl cursor-pointer hover:border-primary/20 transition-all"
                        onClick={() => setSelectedRequest(req)}
                    >
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-4">
                                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${req.status === "Pending" ? "bg-yellow-500/10" : req.status === "Approved" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                                    {req.status === "Pending" ? <Clock className="size-5 text-yellow-400" /> :
                                        req.status === "Approved" ? <Check className="size-5 text-green-400" /> :
                                            <X className="size-5 text-red-400" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="text-xs text-muted-foreground font-mono">{req.id}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getStatusStyle(req.status)}`}>{req.status}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getPriorityStyle(req.priority)}`}>{req.priority}</span>
                                    </div>
                                    <h3 className="font-outfit font-semibold text-sm">{req.summary}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{req.vendor} · {req.branch} · {req.submitted}</p>
                                </div>
                            </div>
                            {req.status === "Pending" && (

                                <div className="flex gap-2 shrink-0 self-start" onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        size="sm"
                                        className="rounded-xl text-xs h-8 bg-green-500 hover:bg-green-600"
                                        onClick={() => handleApprove(req.id)}
                                    >
                                        <Check className="size-3 mr-1" /> Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-xl text-xs h-8 text-red-400 border-red-500/20 hover:bg-red-500/10"
                                        onClick={() => { setSelectedRequest(req); setShowRejectModal(true); }}
                                    >
                                        <X className="size-3 mr-1" /> Reject
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="glass-card p-12 rounded-2xl text-center">
                    <CheckSquare className="size-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-outfit font-bold text-lg mb-1">No requests</h3>
                    <p className="text-sm text-muted-foreground">All caught up! No {activeTab.toLowerCase()} requests.</p>
                </div>
            )}

            {/* ── Request Detail Modal ── */}
            {selectedRequest && !showRejectModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
                    <div className="relative glass-card p-6 rounded-2xl max-w-lg w-full shadow-2xl max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-muted-foreground">{selectedRequest.id}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getStatusStyle(selectedRequest.status)}`}>{selectedRequest.status}</span>
                            </div>
                            <button onClick={() => setSelectedRequest(null)} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                                <X className="size-4" />
                            </button>
                        </div>

                        <h3 className="font-outfit font-bold text-lg mb-1">{selectedRequest.summary}</h3>
                        <p className="text-sm text-muted-foreground mb-6">{selectedRequest.type} · {selectedRequest.branch}</p>

                        {/* Comparison */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="glass-panel p-4 rounded-xl text-center">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Current</p>
                                <p className="font-outfit font-bold text-lg">{selectedRequest.current}</p>
                            </div>
                            <div className="glass-panel p-4 rounded-xl text-center border-primary/20">
                                <p className="text-[10px] text-primary uppercase font-bold mb-1">Requested</p>
                                <p className="font-outfit font-bold text-lg text-primary">{selectedRequest.requested}</p>
                            </div>
                        </div>

                        {/* Impact */}
                        <div className="glass-panel p-4 rounded-xl mb-6">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Impact Analysis</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Affected bookings</span>
                                    <span className={`font-semibold ${selectedRequest.impact.bookings > 0 ? "text-yellow-400" : "text-green-400"}`}>
                                        {selectedRequest.impact.bookings > 0 ? `⚠️ ${selectedRequest.impact.bookings} bookings` : "None"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Revenue impact</span>
                                    <span className="font-semibold">{selectedRequest.impact.revenue}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Vendor reliability</span>
                                    <span className="font-semibold">{selectedRequest.impact.reliability}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Vendor Reason */}
                        <div className="mb-6">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Vendor&apos;s Reason</h4>
                            <p className="text-sm text-foreground/80 p-3 rounded-xl bg-muted/50">{selectedRequest.reason}</p>
                        </div>

                        {/* Actions */}
                        {selectedRequest.status === "Pending" && (
                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 rounded-xl bg-green-500 hover:bg-green-600"
                                    onClick={() => handleApprove(selectedRequest.id)}
                                >
                                    <Check className="size-4 mr-1" /> Approve
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-xl text-red-400 border-red-500/20 hover:bg-red-500/10"
                                    onClick={() => setShowRejectModal(true)}
                                >
                                    <X className="size-4 mr-1" /> Reject
                                </Button>
                                <Button variant="ghost" className="rounded-xl" title="Request More Info">
                                    <MessageSquare className="size-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Reject Reason Modal ── */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
                    <div className="relative glass-card p-6 rounded-2xl max-w-md w-full shadow-2xl">
                        <div className="size-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                            <XCircle className="size-6 text-red-400" />
                        </div>
                        <h3 className="font-outfit font-bold text-lg text-center mb-2">Reject Request</h3>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                            {selectedRequest && `Rejecting: ${selectedRequest.summary}`}
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold font-outfit mb-2">Reason for Rejection</label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Provide a reason for the vendor..."
                                className="w-full h-28 p-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => { setShowRejectModal(false); setRejectReason(""); }}>
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 rounded-xl bg-red-500 hover:bg-red-600"
                                onClick={handleReject}
                                disabled={!rejectReason.trim()}
                            >
                                <Send className="size-4 mr-1" /> Reject with Reason
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
