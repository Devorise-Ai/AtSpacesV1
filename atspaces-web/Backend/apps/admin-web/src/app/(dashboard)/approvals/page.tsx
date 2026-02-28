import { useState, useEffect } from "react";
import {
    CheckSquare, XCircle, Clock, MessageSquare, Check, X, Send, AlertTriangle
} from "lucide-react";
import { Button } from "@repo/ui/button";
import { adminService } from "@/services/admin.service";

const tabs = ["All", "Pending", "Approved", "Rejected"];

function getStatusStyle(status: string) {
    switch (status.toLowerCase()) {
        case "pending": return "bg-yellow-500/10 text-yellow-400";
        case "approved": return "bg-green-500/10 text-green-400";
        case "rejected": return "bg-red-500/10 text-red-400";
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
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [isActioning, setIsActioning] = useState<number | null>(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await adminService.listApprovalRequests();
            setRequests(data);
        } catch (err) {
            console.error("Failed to fetch requests", err);
            setError("Failed to load approval requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const filtered = activeTab === "All"
        ? requests
        : requests.filter((r) => r.status.toLowerCase() === activeTab.toLowerCase());

    const handleApprove = async (id: number) => {
        try {
            setIsActioning(id);
            await adminService.approveRequest(id);
            fetchRequests();
            setSelectedRequest(null);
        } catch (err) {
            console.error("Approval failed", err);
        } finally {
            setIsActioning(null);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;
        try {
            setIsActioning(selectedRequest.id);
            await adminService.rejectRequest(selectedRequest.id, rejectReason);
            setShowRejectModal(false);
            setRejectReason("");
            setSelectedRequest(null);
            fetchRequests();
        } catch (err) {
            console.error("Rejection failed", err);
        } finally {
            setIsActioning(null);
        }
    };

    if (loading && requests.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="font-outfit font-bold text-2xl lg:text-3xl">Approvals</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Review and process vendor requests.
                    <span className="ml-2 text-yellow-400 font-semibold">{requests.filter(r => r.status.toLowerCase() === "pending").length} pending</span>
                </p>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="size-5" />
                    <p className="text-sm font-medium">{error}</p>
                    <Button variant="ghost" size="sm" onClick={fetchRequests} className="ml-auto underline">Retry</Button>
                </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/50 w-full sm:w-fit overflow-x-auto">
                {tabs.map((tab) => {
                    const count = tab === "All" ? requests.length : requests.filter(r => r.status.toLowerCase() === tab.toLowerCase()).length;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab
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
                        className="glass-card p-4 sm:p-5 rounded-2xl cursor-pointer hover:border-primary/20 transition-all border border-white/5"
                        onClick={() => setSelectedRequest(req)}
                    >
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-4">
                                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${req.status.toLowerCase() === "pending" ? "bg-yellow-500/10" : req.status.toLowerCase() === "approved" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                                    {req.status.toLowerCase() === "pending" ? <Clock className="size-5 text-yellow-400" /> :
                                        req.status.toLowerCase() === "approved" ? <Check className="size-5 text-green-400" /> :
                                            <X className="size-5 text-red-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="text-xs text-muted-foreground font-mono">REQ-{req.id.toString().padStart(3, '0')}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${getStatusStyle(req.status)}`}>{req.status}</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-500/10 text-blue-400 uppercase">{req.requestType.replace('_', ' ')}</span>
                                    </div>
                                    <h3 className="font-outfit font-semibold text-sm truncate">{req.summary || `Request to change ${req.serviceName || 'Capacity'}`}</h3>
                                    <p className="text-xs text-muted-foreground mt-1 truncate">{req.vendorName} · {req.branchName} · {new Date(req.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            {req.status.toLowerCase() === "pending" && (
                                <div className="flex gap-2 shrink-0 self-start" onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        size="sm"
                                        disabled={isActioning === req.id}
                                        className="rounded-xl text-xs h-8 bg-green-500 hover:bg-green-600"
                                        onClick={() => handleApprove(req.id)}
                                    >
                                        <Check className="size-3 mr-1" /> {isActioning === req.id ? "..." : "Approve"}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={isActioning === req.id}
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

                        <h3 className="font-outfit font-bold text-lg mb-1">{selectedRequest.summary || `Request to change ${selectedRequest.serviceName || 'Capacity'}`}</h3>
                        <p className="text-sm text-muted-foreground mb-6 underline decoration-primary/30 underline-offset-4 capitalize">{selectedRequest.requestType.replace('_', ' ')} · {selectedRequest.branchName}</p>

                        {/* Comparison */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="glass-panel p-4 rounded-xl text-center border border-white/5 bg-muted/20">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1 tracking-wider">Current Value</p>
                                <p className="font-outfit font-bold text-lg">{selectedRequest.oldValue || "N/A"}</p>
                            </div>
                            <div className="glass-panel p-4 rounded-xl text-center border-primary/20 bg-primary/5">
                                <p className="text-[10px] text-primary uppercase font-bold mb-1 tracking-wider">New Value</p>
                                <p className="font-outfit font-bold text-lg text-primary">{selectedRequest.newValue}</p>
                            </div>
                        </div>

                        {/* Vendor Reason */}
                        <div className="mb-6">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Vendor&apos;s Reason</h4>
                            <p className="text-sm text-foreground/80 p-4 rounded-xl bg-muted/50 border border-white/5 italic">
                                &quot;{selectedRequest.reason}&quot;
                            </p>
                        </div>

                        {/* Actions */}
                        {selectedRequest.status.toLowerCase() === "pending" && (
                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 rounded-xl bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20"
                                    onClick={() => handleApprove(selectedRequest.id)}
                                    disabled={isActioning !== null}
                                >
                                    <Check className="size-4 mr-1" /> {isActioning === selectedRequest.id ? "Processing..." : "Approve"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-xl text-red-400 border-red-500/20 hover:bg-red-500/10"
                                    onClick={() => setShowRejectModal(true)}
                                    disabled={isActioning !== null}
                                >
                                    <X className="size-4 mr-1" /> Reject
                                </Button>
                            </div>
                        )}

                        {selectedRequest.status.toLowerCase() !== "pending" && (
                            <div className="glass-panel p-4 rounded-xl border-white/5 bg-muted/10">
                                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Review Summary</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground text-xs">Reviewed On</span>
                                        <span className="font-medium">{new Date(selectedRequest.updatedAt).toLocaleString()}</span>
                                    </div>
                                    {selectedRequest.reviewNotes && (
                                        <div className="mt-2 text-xs border-t border-white/5 pt-2">
                                            <p className="text-muted-foreground mb-1">Feedback:</p>
                                            <p className="text-foreground">{selectedRequest.reviewNotes}</p>
                                        </div>
                                    )}
                                </div>
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
