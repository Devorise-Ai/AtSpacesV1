"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Lock,
    Unlock,
    AlertCircle,
    Building2,
    Clock,
    CheckCircle2,
    LayoutGrid
} from "lucide-react";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { vendorService } from "@/services/vendor.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CalendarPage() {
    const [branches, setBranches] = useState<any[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>("");
    const [services, setServices] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<string>("");
    const [availability, setAvailability] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [togglingId, setTogglingId] = useState<number | null>(null);

    useEffect(() => {
        const loadBranches = async () => {
            try {
                const data = await vendorService.getMyBranches();
                setBranches(data);
                if (data.length > 0) {
                    setSelectedBranch(data[0].id.toString());
                }
            } catch (err) {
                console.error("Failed to load branches", err);
            }
        };
        loadBranches();
    }, []);

    useEffect(() => {
        if (!selectedBranch) return;
        const loadBranchDetails = async () => {
            try {
                const data = await vendorService.getBranchDetails(parseInt(selectedBranch));
                setServices(data.vendorServices || []);
                if (data.vendorServices?.length > 0) {
                    setSelectedService(data.vendorServices[0].id.toString());
                }
            } catch (err) {
                console.error("Failed to load services", err);
            }
        };
        loadBranchDetails();
    }, [selectedBranch]);

    useEffect(() => {
        if (!selectedService) return;
        const loadAvailability = async () => {
            setLoading(true);
            try {
                const data = await vendorService.getAvailability(parseInt(selectedService));
                setAvailability(data);
            } catch (err) {
                console.error("Failed to load availability", err);
            } finally {
                setLoading(false);
            }
        };
        loadAvailability();
    }, [selectedService]);

    const handleToggleBlock = async (id: number) => {
        setTogglingId(id);
        try {
            await vendorService.toggleAvailabilityBlock(id);
            // Update local state
            setAvailability(prev => prev.map(a => a.id === id ? { ...a, isBlocked: !a.isBlocked } : a));
        } catch (err) {
            console.error("Failed to toggle block", err);
        } finally {
            setTogglingId(null);
        }
    };

    // Calendar logic
    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const renderCalendar = () => {
        const days = [];
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);

        // Blank days at the start
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`blank-${i}`} className="h-24 md:h-32 border border-white/5 opacity-20" />);
        }

        // Actual days
        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayAvails = availability.filter(a => {
                const aDate = new Date(a.date);
                return aDate.getFullYear() === year && aDate.getMonth() === month && aDate.getDate() === d;
            });

            days.push(
                <div key={d} className="h-24 md:h-32 border border-white/5 p-2 flex flex-col gap-1 overflow-hidden relative group hover:bg-white/[0.02] transition-colors">
                    <span className="text-sm font-bold opacity-40 group-hover:opacity-100 transition-opacity">{d}</span>
                    <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                        {dayAvails.map(a => (
                            <motion.div
                                key={a.id}
                                whileHover={{ scale: 1.02 }}
                                layoutId={`avail-${a.id}`}
                                className={`text-[9px] md:text-[10px] p-1.5 rounded-md border flex items-center justify-between gap-1 cursor-pointer transition-all ${a.isBlocked
                                    ? "bg-destructive/10 border-destructive/20 text-destructive"
                                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                    }`}
                                onClick={() => handleToggleBlock(a.id)}
                            >
                                <div className="flex items-center gap-1 overflow-hidden">
                                    {a.isBlocked ? <Lock size={8} /> : <Unlock size={8} />}
                                    <span className="truncate">
                                        {a.availableUnits} Seats
                                    </span>
                                </div>
                                {togglingId === a.id && (
                                    <div className="animate-spin size-2 border-b border-current rounded-full" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between glass-card p-6 border-l-4 border-l-primary">
                <div>
                    <h1 className="text-3xl font-bold font-outfit tracking-tight text-foreground">Availability Calendar</h1>
                    <p className="text-muted-foreground">Manage operating hours and block specific dates for each resource.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                        <SelectTrigger className="w-[180px] bg-background">
                            <Building2 className="size-4 mr-2 text-primary" />
                            <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                            {branches.map(b => (
                                <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger className="w-[180px] bg-background">
                            <LayoutGrid className="size-4 mr-2 text-primary" />
                            <SelectValue placeholder="Select Resource" />
                        </SelectTrigger>
                        <SelectContent>
                            {services.map(vs => (
                                <SelectItem key={vs.id} value={vs.id.toString()}>{vs.service?.name.replace('_', ' ')}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Calendar Control */}
            <Card className="glass-card border-white/5 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={prevMonth} className="hover:bg-primary/10">
                                <ChevronLeft className="size-5" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:bg-primary/10">
                                <ChevronRight className="size-5" />
                            </Button>
                        </div>
                        <h2 className="text-xl font-bold font-outfit min-w-[150px]">
                            {monthNames[month]} {year}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="size-3 bg-emerald-500/20 border border-emerald-500/40 rounded shadow-sm shadow-emerald-500/10" />
                            <span className="text-muted-foreground">Available</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="size-3 bg-destructive/20 border border-destructive/40 rounded shadow-sm shadow-destructive/10" />
                            <span className="text-muted-foreground">Blocked</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-muted/50 rounded-full border">
                            <AlertCircle size={12} className="text-primary" />
                            <span>Click slots to toggle status</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="grid grid-cols-7 border-b border-white/5 bg-muted/30">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <div key={day} className="py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7">
                        {loading ? (
                            Array.from({ length: 35 }).map((_, i) => (
                                <div key={i} className="h-24 md:h-32 border border-white/5 animate-pulse bg-white/[0.01]" />
                            ))
                        ) : (
                            renderCalendar()
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Legend / Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card border-white/5 h-full">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Clock className="size-4 text-primary" />
                            Business Hours
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm py-2 border-b border-white/5">
                            <span className="text-muted-foreground">Weekdays</span>
                            <span className="font-medium">08:00 AM - 08:00 PM</span>
                        </div>
                        <div className="flex justify-between text-sm py-2 border-b border-white/5">
                            <span className="text-muted-foreground">Saturday</span>
                            <span className="font-medium">10:00 AM - 06:00 PM</span>
                        </div>
                        <div className="flex justify-between text-sm py-2 text-destructive">
                            <span className="opacity-80">Sunday</span>
                            <span className="font-bold">Closed</span>
                        </div>
                        <Button variant="outline" className="w-full text-xs h-9 mt-2">Edit Hours</Button>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 glass-card p-6 flex items-center gap-6 border-white/5">
                    <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <CheckCircle2 className="size-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold font-outfit">Real-time Syncing</h3>
                        <p className="text-sm text-muted-foreground max-w-md">Your calendar is automatically updated when customers book. Manual blocks take immediate effect on the customer-facing website.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
