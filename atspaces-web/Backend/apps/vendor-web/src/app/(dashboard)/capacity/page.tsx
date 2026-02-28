"use client";

import { useState, useEffect } from "react";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@repo/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Settings2, Trash2, ShieldCheck, Building2, AlertTriangle } from "lucide-react";
import { vendorService } from "@/services/vendor.service";

export default function CapacityPage() {
    const [requestType, setRequestType] = useState<"add" | "remove" | "modify" | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [branches, setBranches] = useState<any[]>([]);
    const [inventory, setInventory] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        quantity: "1",
        description: "",
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const myBranches = await vendorService.getMyBranches();
            setBranches(myBranches);

            if (myBranches.length > 0) {
                const details = await vendorService.getBranchDetails(myBranches[0].id);
                // Map vendorServices to inventory format
                const mapped = details.vendorServices.map((vs: any) => ({
                    id: vs.id,
                    branchId: vs.branchId,
                    serviceId: vs.serviceId,
                    name: vs.service?.name || "Service",
                    total: vs.maxCapacity,
                    available: vs.maxCapacity, // Simplified available logic
                    type: vs.service?.name?.replace('_', ' ') || "Service"
                }));
                setInventory(mapped);
            }
        } catch (err) {
            console.error("Failed to fetch capacity data", err);
            setError("Failed to load your workspaces");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenRequest = (type: "add" | "remove" | "modify", item?: any) => {
        setRequestType(type);
        setSelectedItem(item || null);
        setFormData({
            title: item?.name || "",
            quantity: item?.total?.toString() || "1",
            description: "",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!branches[0]) return;

        setIsSubmitting(true);
        try {
            const requestData = {
                branchId: branches[0].id,
                serviceId: selectedItem?.serviceId,
                requestType: requestType === "add" ? "capacity_change" : requestType === "remove" ? "pause_branch" : "capacity_change",
                newValue: formData.quantity,
                reason: formData.description,
                oldValue: selectedItem?.total?.toString()
            };

            await vendorService.submitApprovalRequest(requestData);

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setRequestType(null);
                setSelectedItem(null);
            }, 2500);
        } catch (err) {
            console.error("Submission failed", err);
            // Could add error toast here if available
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* ── Header Section ── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between glass-card p-6 border-l-4 border-l-primary shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold font-outfit tracking-tight text-foreground">Workspaces</h1>
                    <p className="text-muted-foreground mt-1">Manage your active listings and branch capacity.</p>
                    {branches[0] && (
                        <p className="text-xs text-primary font-semibold mt-1 flex items-center gap-1">
                            <Building2 className="size-3" />
                            {branches[0].name}
                        </p>
                    )}
                </div>
                <Button
                    onClick={() => handleOpenRequest("add")}
                    className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="size-5 mr-2" />
                    List New Workspace
                </Button>
            </div>

            {/* ── Workspace Management Grid ── */}
            <div className="grid gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold font-outfit flex items-center gap-2">
                        <Building2 className="size-5 text-primary" />
                        Active Workspaces
                    </h2>
                    <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border">
                        {inventory.length} Total Resources
                    </div>
                </div>

                {loading && inventory.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-2xl flex flex-col items-center gap-3 text-center">
                        <AlertTriangle className="size-8" />
                        <div>
                            <p className="font-bold">Error Loading Capacity</p>
                            <p className="text-sm opacity-80">{error}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchData} className="mt-2">Retry</Button>
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                        {inventory.map((item) => (
                            <Card key={item.id} className="glass-card group overflow-hidden border-white/5 hover:border-primary/20 shadow-sm transition-all duration-300">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                    {item.type}
                                                </span>
                                                {item.available === 0 && (
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-destructive bg-destructive/10 px-2 py-0.5 rounded border border-destructive/20">
                                                        Fully Booked
                                                    </span>
                                                )}
                                            </div>
                                            <CardTitle className="font-outfit text-xl group-hover:text-primary transition-colors">
                                                {item.name}
                                            </CardTitle>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className="text-2xl font-bold font-outfit text-foreground">{item.available}<span className="text-sm text-muted-foreground font-medium">/{item.total}</span></p>
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-tighter">Seats Available</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-white/5">
                                        <ShieldCheck className="size-4 text-emerald-500" />
                                        <span>Verified Listing</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/20 border-t border-white/5 p-4 flex gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 h-9 font-semibold text-xs border-white/10 hover:bg-primary/5 hover:text-primary transition-all"
                                        onClick={() => handleOpenRequest("modify", item)}
                                    >
                                        <Settings2 className="size-3.5 mr-2" />
                                        Manage Capacity
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 w-10 p-0 text-muted-foreground hover:bg-destructive/5 hover:text-destructive border-white/10 transition-all"
                                        onClick={() => handleOpenRequest("remove", item)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Request Dialog ── */}
            <Dialog open={requestType !== null} onOpenChange={(open) => !open && setRequestType(null)}>
                <DialogContent className="sm:max-w-[450px] bg-card/95 backdrop-blur-2xl border-white/10 shadow-2xl">
                    {success ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300">
                            <div className="size-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                                <ShieldCheck className="size-10" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold font-outfit text-foreground">Request Received</h2>
                                <p className="text-muted-foreground max-w-[280px]">Our admin team has been notified and will review your changes shortly.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${requestType === 'add' ? 'bg-primary/10 text-primary' : requestType === 'remove' ? 'bg-destructive/10 text-destructive' : 'bg-blue-500/10 text-blue-500'}`}>
                                        {requestType === 'add' ? <Plus className="size-5" /> : requestType === 'remove' ? <Trash2 className="size-5" /> : <Settings2 className="size-5" />}
                                    </div>
                                    <DialogTitle className="font-outfit text-2xl capitalize">
                                        {requestType === 'add' ? 'List New Workspace' : requestType === 'remove' ? 'Delete Workspace' : 'Modify Capacity'}
                                    </DialogTitle>
                                </div>
                                <DialogDescription className="text-sm">
                                    {requestType === 'add'
                                        ? "Apply to add a new space to your branch. Verification usually takes 2-4 hours."
                                        : "This request requires administration oversight to ensure all active bookings are handled."}
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-5 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Workspace Name</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder={requestType === "add" ? "e.g. Creative Pod" : ""}
                                        className="h-11 bg-muted/50 border-white/5 focus:border-primary/50 transition-all font-medium"
                                        required
                                        disabled={requestType !== "add" && requestType !== "modify"}
                                    />
                                </div>

                                {requestType !== "remove" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Capacity (Seats)</Label>
                                        <Input
                                            id="quantity"
                                            name="quantity"
                                            type="number"
                                            min="1"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            className="h-11 bg-muted/50 border-white/5 focus:border-primary/50 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Additional Details / Reason</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Explain the reason for this change..."
                                        className="min-h-[100px] bg-muted/50 border-white/5 focus:border-primary/50 transition-all resize-none"
                                        required
                                    />
                                </div>

                                <DialogFooter className="gap-2 sm:gap-0 sm:space-x-2 pt-2">
                                    <Button type="button" variant="ghost" onClick={() => setRequestType(null)} className="h-11 px-6">Cancel</Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`h-11 px-8 font-bold rounded-xl shadow-lg transition-all ${requestType === 'remove' ? 'bg-destructive hover:bg-destructive/90 text-white shadow-destructive/20' : 'bg-primary hover:bg-primary/90 text-white shadow-primary/20'}`}
                                    >
                                        {isSubmitting ? "Processing..." : requestType === 'add' ? "Submit for Review" : requestType === 'remove' ? "Confirm Deletion Request" : "Update Resource"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
