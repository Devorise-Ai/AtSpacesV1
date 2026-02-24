"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock Data
const INVENTORY = [
    { id: "hot-desks", name: "Hot Desks", total: 15, available: 10, type: "individual" },
    { id: "private-office-1", name: "Private Office A (4-person)", total: 1, available: 0, type: "room" },
    { id: "private-office-2", name: "Private Office B (6-person)", total: 1, available: 1, type: "room" },
    { id: "meeting-room-a", name: "Executive Meeting Room", total: 1, available: 1, type: "room" },
];

export default function CapacityPage() {
    const [requestType, setRequestType] = useState<"add" | "remove" | "modify" | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        quantity: "1",
        description: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API Call to create an admin request
        setTimeout(() => {
            setIsSubmitting(false);
            setSuccess(true);
            // Reset form
            setTimeout(() => {
                setSuccess(false);
                setRequestType(null);
                setFormData({ title: "", quantity: "1", description: "" });
            }, 3000); // Hide success after 3 seconds
        }, 1200);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold font-outfit tracking-tight text-foreground">Capacity Management</h1>
                <p className="text-muted-foreground">Manage your branch resources and submit requests for capacity changes.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Active Inventory List */}
                <Card className="col-span-full border border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Current Resources</CardTitle>
                        <CardDescription>Real-time availability of your registered spaces.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {INVENTORY.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                                    <div className="space-y-1">
                                        <p className="font-medium font-outfit">{item.name}</p>
                                        <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">{item.available}<span className="text-sm text-muted-foreground font-normal">/{item.total}</span></div>
                                            <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Avail</div>
                                        </div>

                                        {/* Simplified individual toggle mimicking availability control */}
                                        <div className="ml-4 pl-4 border-l">
                                            <Button variant={item.available > 0 ? "outline" : "secondary"} size="sm" className="w-24">
                                                {item.available > 0 ? "Block All" : "Unblock"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Widgets for Requests */}
                <Dialog open={requestType !== null} onOpenChange={(open) => !open && setRequestType(null)}>
                    <Card className="border hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => setRequestType("add")}>
                        <CardHeader>
                            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                            </div>
                            <CardTitle className="font-outfit">Add New Resource</CardTitle>
                            <CardDescription>Request a new desk pool, private office, or meeting room to be listed.</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border hover:border-blue-500/50 transition-colors cursor-pointer group" onClick={() => setRequestType("modify")}>
                        <CardHeader>
                            <div className="size-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3" /></svg>
                            </div>
                            <CardTitle className="font-outfit">Modify Capacity</CardTitle>
                            <CardDescription>Increase or decrease the total number of an existing resource.</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border hover:border-destructive/50 transition-colors cursor-pointer group" onClick={() => setRequestType("remove")}>
                        <CardHeader>
                            <div className="size-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
                            </div>
                            <CardTitle className="font-outfit">Remove Resource</CardTitle>
                            <CardDescription>Submit a request to permanently delist a space from AtSpaces.</CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Shared Request Modal */}
                    <DialogContent className="sm:max-w-[425px]">
                        {success ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="size-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <h2 className="text-xl font-bold font-outfit text-foreground">Request Submitted</h2>
                                <p className="text-muted-foreground">The admin team will review your request and process it shortly.</p>
                            </div>
                        ) : (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="font-outfit capitalize text-xl">
                                        {requestType} Resource Request
                                    </DialogTitle>
                                    <DialogDescription>
                                        This request will be sent to AtSpaces administration for approval to maintain platform consistency.
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Resource Name</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder={requestType === "add" ? "e.g. New Podcast Room" : "e.g. Hot Desks"}
                                            required
                                        />
                                    </div>

                                    {requestType !== "remove" && (
                                        <div className="space-y-2">
                                            <Label htmlFor="quantity">Quantity / Total Seats</Label>
                                            <Input
                                                id="quantity"
                                                name="quantity"
                                                type="number"
                                                min="1"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Reason for Request</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Briefly explain the changes needed..."
                                            required
                                        />
                                    </div>

                                    <DialogFooter className="pt-4">
                                        <Button type="button" variant="outline" onClick={() => setRequestType(null)}>Cancel</Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? "Submitting..." : "Send Request"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
