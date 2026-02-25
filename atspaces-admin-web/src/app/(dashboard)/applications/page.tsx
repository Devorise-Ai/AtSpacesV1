"use client";

import { useState } from "react";
import { FileText, Search, Eye, Check, X, Clock, MapPin, Mail, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const applications = [
    {
        id: "APP-001", name: "Khalil Rawashine", email: "k.rawashine@email.com", phone: "+962 7 9123 4567",
        branchName: "Khalil Co-Work", city: "Amman", services: ["Hot Desk", "Meeting Room"],
        status: "New", submittedDate: "Feb 23, 2026",
        description: "Modern coworking space in Jabal Amman with rooftop area. 200 sqm, 30 desks, 2 meeting rooms."
    },
    {
        id: "APP-002", name: "Nour Alshami", email: "n.alshami@email.com", phone: "+962 7 8234 5678",
        branchName: "Nour Business Lounge", city: "Irbid", services: ["Hot Desk", "Private Office"],
        status: "Under Review", submittedDate: "Feb 20, 2026",
        description: "Downtown Irbid workspace near the university. 150 sqm, 20 desks, 5 private offices."
    },
    {
        id: "APP-003", name: "Tariq Abu-Ghazaleh", email: "t.abughazaleh@email.com", phone: "+962 7 7345 6789",
        branchName: "TAX Work Hub", city: "Aqaba", services: ["Hot Desk"],
        status: "Approved", submittedDate: "Feb 15, 2026",
        description: "Beachside workspace in downtown Aqaba. 100 sqm, 15 desks."
    },
    {
        id: "APP-004", name: "Rania Qasem", email: "r.qasem@email.com", phone: "+962 7 6456 7890",
        branchName: "Rania Creative Studio", city: "Salt", services: ["Meeting Room"],
        status: "Rejected", submittedDate: "Feb 10, 2026",
        description: "Small meeting space in Salt. 50 sqm, 1 meeting room."
    },
];

function getStatusStyle(status: string) {
    switch (status) {
        case "New": return "bg-blue-500/10 text-blue-400";
        case "Under Review": return "bg-yellow-500/10 text-yellow-400";
        case "Approved": return "bg-green-500/10 text-green-400";
        case "Rejected": return "bg-red-500/10 text-red-400";
        default: return "bg-muted text-muted-foreground";
    }
}

export default function ApplicationsPage() {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<typeof applications[0] | null>(null);

    const filtered = applications.filter((a) =>
        !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.branchName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-outfit font-bold text-2xl lg:text-3xl">Vendor Applications</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Review &quot;Become a Vendor&quot; submissions.
                    <span className="ml-2 text-blue-400 font-semibold">{applications.filter(a => a.status === "New").length} new</span>
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input type="text" placeholder="Search applications..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
            </div>

            {!selected ? (
                <div className="space-y-3">
                    {filtered.map((app) => (
                        <div key={app.id} className="glass-card p-4 sm:p-5 rounded-2xl cursor-pointer hover:border-primary/20 transition-all" onClick={() => setSelected(app)}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-4">
                                    <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center font-outfit font-bold text-primary text-lg">
                                        {app.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-xs font-mono text-muted-foreground">{app.id}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getStatusStyle(app.status)}`}>{app.status}</span>
                                        </div>
                                        <h3 className="font-outfit font-bold text-sm">{app.branchName}</h3>
                                        <p className="text-xs text-muted-foreground">{app.name} · {app.city} · {app.submittedDate}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-xl text-xs h-8 shrink-0">
                                    <Eye className="size-3 mr-1" /> Review
                                </Button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="glass-card p-12 rounded-2xl text-center">
                            <FileText className="size-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-outfit font-bold text-lg mb-1">No applications</h3>
                            <p className="text-sm text-muted-foreground">No matching applications found.</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Application Detail View */
                <div className="space-y-6">
                    <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                        <ArrowLeft className="size-4" /> Back to Applications
                    </button>
                    <div className="glass-card p-4 sm:p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono text-muted-foreground">{selected.id}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getStatusStyle(selected.status)}`}>{selected.status}</span>
                                </div>
                                <h2 className="font-outfit font-bold text-xl">{selected.branchName}</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase text-muted-foreground">Contact Info</h3>
                                <div className="space-y-2">
                                    <p className="text-sm flex items-center gap-2"><Mail className="size-4 text-muted-foreground" /> {selected.email}</p>
                                    <p className="text-sm flex items-center gap-2"><Phone className="size-4 text-muted-foreground" /> {selected.phone}</p>
                                    <p className="text-sm flex items-center gap-2"><MapPin className="size-4 text-muted-foreground" /> {selected.city}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase text-muted-foreground">Services Offered</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selected.services.map((s) => (
                                        <span key={s} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                                    ))}
                                </div>
                                <h3 className="text-xs font-bold uppercase text-muted-foreground mt-4">Submitted</h3>
                                <p className="text-sm flex items-center gap-2"><Clock className="size-4 text-muted-foreground" /> {selected.submittedDate}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">Description</h3>
                            <p className="text-sm text-foreground/80 p-4 rounded-xl bg-muted/30">{selected.description}</p>
                        </div>

                        {(selected.status === "New" || selected.status === "Under Review") && (
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/30">
                                <Button className="flex-1 rounded-xl bg-green-500 hover:bg-green-600">
                                    <Check className="size-4 mr-1" /> Approve & Send Invitation
                                </Button>
                                <Button variant="outline" className="flex-1 rounded-xl text-red-400 border-red-500/20 hover:bg-red-500/10">
                                    <X className="size-4 mr-1" /> Reject
                                </Button>
                                {selected.status === "New" && (
                                    <Button variant="outline" className="rounded-xl">
                                        <Eye className="size-4 mr-1" /> Mark Under Review
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
