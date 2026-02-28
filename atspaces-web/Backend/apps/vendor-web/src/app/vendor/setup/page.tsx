"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, HelpCircle, Info } from "lucide-react";

const STEPS = [
    { id: 1, title: "Hot Desk", description: "Define shared flexible seating" },
    { id: 2, title: "Private Office", description: "Define enclosed private offices" },
    { id: 3, title: "Meeting Room", description: "Define bookable meeting rooms" },
    { id: 4, title: "Confirm", description: "Review and activate your branch" },
];

function StepHeader({ current, total }: { current: number; total: number }) {
    return (
        <div className="relative flex items-center justify-between mb-10">
            <div className="absolute left-0 right-0 top-4 h-[2px] bg-secondary -z-10">
                <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${((current - 1) / (total - 1)) * 100}%` }}
                />
            </div>
            {STEPS.map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-2 z-10">
                    <div className={`flex size-8 items-center justify-center rounded-full text-sm font-bold border-2 transition-all duration-300 ${s.id < current ? "bg-primary border-primary text-white" :
                            s.id === current ? "bg-background border-primary text-primary" :
                                "bg-background border-secondary text-muted-foreground"
                        }`}>
                        {s.id < current ? <CheckCircle2 className="size-4" /> : s.id}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${s.id === current ? "text-primary" : "text-muted-foreground"}`}>
                        {s.title}
                    </span>
                </div>
            ))}
        </div>
    );
}

function Tooltip({ text }: { text: string }) {
    return (
        <span className="group relative inline-flex cursor-pointer">
            <HelpCircle className="size-3.5 text-muted-foreground hover:text-foreground" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-popover text-popover-foreground border border-border text-xs rounded-md px-2 py-1 whitespace-nowrap shadow-md z-50">
                {text}
            </span>
        </span>
    );
}

export default function VendorSetupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hot Desk state
    const [hotDesk, setHotDesk] = useState({
        enabled: false,
        totalSeats: "",
        available: true,
    });

    // Private Offices state
    const [offices, setOffices] = useState([
        { id: 1, name: "Office A", capacity: "4", available: true },
    ]);

    // Meeting Rooms state
    const [rooms, setRooms] = useState([
        { id: 1, name: "Main Room", capacity: "8", slots: ["09:00", "11:00", "13:00", "15:00"] },
    ]);
    const ALL_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

    const addOffice = () => {
        const nextId = offices.length + 1;
        setOffices([...offices, { id: nextId, name: `Office ${String.fromCharCode(64 + nextId)}`, capacity: "2", available: true }]);
    };

    const addRoom = () => {
        const nextId = rooms.length + 1;
        setRooms([...rooms, { id: nextId, name: `Room ${nextId}`, capacity: "6", slots: ["09:00", "11:00", "13:00"] }]);
    };

    const toggleSlot = (roomId: number, slot: string) => {
        setRooms(rooms.map(r => r.id === roomId
            ? { ...r, slots: r.slots.includes(slot) ? r.slots.filter(s => s !== slot) : [...r.slots, slot] }
            : r
        ));
    };

    const handleFinish = async () => {
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-muted/30 flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-2xl space-y-8">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">A</div>
                    <span className="text-lg font-bold tracking-tight font-outfit">AtSpaces <span className="text-primary text-xs font-normal uppercase tracking-wider">Vendor</span></span>
                </div>

                {/* Intro */}
                <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
                        First-Time Setup Required
                    </div>
                    <h1 className="text-3xl font-bold font-outfit text-foreground">Set up your branch capacity</h1>
                    <p className="text-muted-foreground mt-1">Define your space's resources to start receiving bookings through AtSpaces.</p>
                </div>

                {/* Step Progress */}
                <StepHeader current={step} total={STEPS.length} />

                {/* Step Content */}
                <div className="rounded-xl border bg-card p-8 shadow-sm">

                    {/* ── STEP 1: Hot Desk ── */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <h2 className="text-xl font-bold font-outfit">Hot Desks</h2>
                                <p className="text-muted-foreground text-sm mt-1">Shared flexible seating booked daily, weekly, or monthly.</p>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                                <div>
                                    <p className="font-medium text-foreground">Offer Hot Desks at this branch</p>
                                    <p className="text-xs text-muted-foreground">Enable shared workspace seating</p>
                                </div>
                                <button
                                    onClick={() => setHotDesk({ ...hotDesk, enabled: !hotDesk.enabled })}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${hotDesk.enabled ? "bg-primary" : "bg-secondary"}`}
                                >
                                    <span className={`inline-block size-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ${hotDesk.enabled ? "translate-x-5" : "translate-x-0"}`} />
                                </button>
                            </div>

                            {hotDesk.enabled && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5">
                                            <Label htmlFor="seats">Total Seat Count</Label>
                                            <Tooltip text="Total number of hot desk seats available in your branch." />
                                        </div>
                                        <Input
                                            id="seats"
                                            type="number"
                                            min="1"
                                            max="200"
                                            className="bg-background w-40"
                                            placeholder="e.g. 20"
                                            value={hotDesk.totalSeats}
                                            onChange={(e) => setHotDesk({ ...hotDesk, totalSeats: e.target.value })}
                                        />
                                        {hotDesk.totalSeats && parseInt(hotDesk.totalSeats) < 1 && (
                                            <p className="text-xs text-destructive">Please set at least 1 seat.</p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                                        <div>
                                            <p className="font-medium">Immediately available</p>
                                            <p className="text-xs text-muted-foreground">Will be visible to customers after setup</p>
                                        </div>
                                        <button
                                            onClick={() => setHotDesk({ ...hotDesk, available: !hotDesk.available })}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${hotDesk.available ? "bg-primary" : "bg-secondary"}`}
                                        >
                                            <span className={`inline-block size-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ${hotDesk.available ? "translate-x-5" : "translate-x-0"}`} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!hotDesk.enabled && (
                                <div className="flex items-start gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                                    <Info className="size-4 mt-0.5 shrink-0" />
                                    Hot Desks are disabled for this branch. You can enable this service later from Capacity Management.
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── STEP 2: Private Offices ── */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <h2 className="text-xl font-bold font-outfit">Private Offices</h2>
                                <p className="text-muted-foreground text-sm mt-1">Enclosed rooms for teams. Add each office you have available.</p>
                            </div>

                            <div className="space-y-3">
                                {offices.map((office, idx) => (
                                    <div key={office.id} className="rounded-lg border bg-background p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-foreground">{office.name}</p>
                                            {offices.length > 1 && (
                                                <button
                                                    onClick={() => setOffices(offices.filter((_, i) => i !== idx))}
                                                    className="text-xs text-muted-foreground hover:text-destructive"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">Office Name</Label>
                                                <Input
                                                    className="h-9 bg-card text-sm"
                                                    value={office.name}
                                                    onChange={(e) => setOffices(offices.map((o, i) => i === idx ? { ...o, name: e.target.value } : o))}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-1">
                                                    <Label className="text-xs">Capacity (people)</Label>
                                                    <Tooltip text="How many people can use this office at once." />
                                                </div>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    className="h-9 bg-card text-sm"
                                                    value={office.capacity}
                                                    onChange={(e) => setOffices(offices.map((o, i) => i === idx ? { ...o, capacity: e.target.value } : o))}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setOffices(offices.map((o, i) => i === idx ? { ...o, available: !o.available } : o))}
                                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${office.available ? "bg-primary" : "bg-secondary"}`}
                                            >
                                                <span className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${office.available ? "translate-x-4" : "translate-x-0"}`} />
                                            </button>
                                            <span className="text-sm text-muted-foreground">
                                                {office.available ? "Available for booking" : "Not available"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addOffice}
                                className="w-full rounded-lg border border-dashed border-primary/50 py-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                            >
                                + Add Another Office
                            </button>
                        </div>
                    )}

                    {/* ── STEP 3: Meeting Rooms ── */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <h2 className="text-xl font-bold font-outfit">Meeting Rooms</h2>
                                <p className="text-muted-foreground text-sm mt-1">Bookable by the hour. Define rooms and enable available time slots.</p>
                            </div>

                            <div className="space-y-4">
                                {rooms.map((room, idx) => (
                                    <div key={room.id} className="rounded-lg border bg-background p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-foreground">{room.name}</p>
                                            {rooms.length > 1 && (
                                                <button onClick={() => setRooms(rooms.filter((_, i) => i !== idx))} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">Room Name</Label>
                                                <Input className="h-9 bg-card text-sm" value={room.name} onChange={(e) => setRooms(rooms.map((r, i) => i === idx ? { ...r, name: e.target.value } : r))} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">Capacity (seats)</Label>
                                                <Input type="number" min="1" className="h-9 bg-card text-sm" value={room.capacity} onChange={(e) => setRooms(rooms.map((r, i) => i === idx ? { ...r, capacity: e.target.value } : r))} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Available Time Slots (click to toggle)</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {ALL_SLOTS.map(slot => (
                                                    <button
                                                        key={slot}
                                                        onClick={() => toggleSlot(room.id, slot)}
                                                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${room.slots.includes(slot) ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50"}`}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={addRoom} className="w-full rounded-lg border border-dashed border-primary/50 py-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
                                + Add Another Room
                            </button>
                        </div>
                    )}

                    {/* ── STEP 4: Confirm ── */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <h2 className="text-xl font-bold font-outfit">Review & Activate</h2>
                                <p className="text-muted-foreground text-sm mt-1">Confirm your branch details before going live.</p>
                            </div>

                            <div className="divide-y rounded-lg border bg-background overflow-hidden">
                                {/* Hot Desk row */}
                                <div className="flex items-center justify-between px-5 py-4">
                                    <div>
                                        <p className="font-medium text-foreground">Hot Desks</p>
                                        {hotDesk.enabled ? <p className="text-sm text-muted-foreground">{hotDesk.totalSeats || "0"} total seats • {hotDesk.available ? "Available" : "Blocked"}</p> : <p className="text-sm text-muted-foreground">Not offered at this branch</p>}
                                    </div>
                                    {hotDesk.enabled
                                        ? <span className="text-xs font-semibold text-emerald-500 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full">Enabled</span>
                                        : <span className="text-xs font-semibold text-muted-foreground border border-border bg-muted/30 px-2 py-0.5 rounded-full">Disabled</span>
                                    }
                                </div>

                                {/* Private Offices row */}
                                <div className="flex items-start justify-between px-5 py-4">
                                    <div>
                                        <p className="font-medium text-foreground">Private Offices</p>
                                        <ul className="mt-1 space-y-0.5">
                                            {offices.map(o => (
                                                <li key={o.id} className="text-sm text-muted-foreground">{o.name} · {o.capacity}-person · {o.available ? "Available" : "Unavailable"}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <span className="text-xs font-semibold text-emerald-500 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full">{offices.length} office{offices.length > 1 ? "s" : ""}</span>
                                </div>

                                {/* Meeting Rooms row */}
                                <div className="flex items-start justify-between px-5 py-4">
                                    <div>
                                        <p className="font-medium text-foreground">Meeting Rooms</p>
                                        <ul className="mt-1 space-y-0.5">
                                            {rooms.map(r => (
                                                <li key={r.id} className="text-sm text-muted-foreground">{r.name} · {r.capacity}-seat · {r.slots.length} active slots</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <span className="text-xs font-semibold text-emerald-500 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full">{rooms.length} room{rooms.length > 1 ? "s" : ""}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
                                <Info className="size-4 mt-0.5 text-primary shrink-0" />
                                Once you complete setup, your branch will be immediately visible to customers. You can adjust availability or request capacity changes at any time from the dashboard.
                            </div>
                        </div>
                    )}

                    {/* Navigation footer */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setStep(s => Math.max(1, s - 1))}
                            disabled={step === 1}
                        >
                            Back
                        </Button>

                        {step < STEPS.length ? (
                            <Button onClick={() => setStep(s => s + 1)}>
                                Continue
                            </Button>
                        ) : (
                            <Button
                                onClick={handleFinish}
                                disabled={isSubmitting}
                                className="bg-primary text-white hover:bg-primary/90"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Activating branch...
                                    </span>
                                ) : "Complete Setup & Go Live"}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Skip option */}
                <p className="text-center text-sm text-muted-foreground">
                    Not ready?{" "}
                    <button onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground underline">
                        Skip for now
                    </button>
                    {" "}(branch won't be bookable until setup is complete)
                </p>
            </div>
        </div>
    );
}
