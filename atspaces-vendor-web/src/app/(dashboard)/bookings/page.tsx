"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CheckCircle2, XCircle } from "lucide-react";

// Mock Data
const MOCK_BOOKINGS = [
    { id: "B-1001", customer: "Sarah Ahmad", service: "Hot Desk", date: "Present", time: "10:00 AM - 6:00 PM", status: "Upcoming", paid: true },
    { id: "B-1002", customer: "Khalid Tech LLC", service: "Private Office", date: "Present", time: "All Day", status: "Checked-In", paid: true },
    { id: "B-1003", customer: "Omar Design", service: "Meeting Room A", date: "Present", time: "2:00 PM - 4:00 PM", status: "Upcoming", paid: false },
    { id: "B-1004", customer: "Lina Co.", service: "Hot Desk", date: "Yesterday", time: "9:00 AM - 5:00 PM", status: "Completed", paid: true },
    { id: "B-1005", customer: "Ahmed Dev", service: "Hot Desk", date: "Present", time: "9:00 AM - 5:00 PM", status: "No-Show", paid: true },
];

export default function BookingsPage() {
    const [bookings, setBookings] = useState(MOCK_BOOKINGS);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [serviceFilter, setServiceFilter] = useState("All");

    const handleStatusChange = (id: string, newStatus: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    };

    const filteredBookings = bookings.filter(b => {
        const matchesSearch = b.customer.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || b.status === statusFilter;
        const matchesService = serviceFilter === "All" || b.service.includes(serviceFilter);
        return matchesSearch && matchesStatus && matchesService;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Upcoming": return <Badge variant="outline" className="text-blue-500 border-blue-500 bg-blue-500/10 hover:bg-blue-500/20">Upcoming</Badge>;
            case "Checked-In": return <Badge variant="outline" className="text-green-500 border-green-500 bg-green-500/10 hover:bg-green-500/20">Checked-In</Badge>;
            case "Completed": return <Badge variant="outline" className="text-muted-foreground border-muted-foreground bg-muted/50 hover:bg-muted">Completed</Badge>;
            case "No-Show": return <Badge variant="outline" className="text-destructive border-destructive bg-destructive/10 hover:bg-destructive/20">No-Show</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-outfit tracking-tight text-foreground">Bookings Oversight</h1>
                    <p className="text-muted-foreground">Manage daily check-ins, view past reservations, and mark no-shows.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row items-center justify-between bg-card p-4 rounded-lg border">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search customer or ID..."
                        className="pl-9 w-full bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Select value={serviceFilter} onValueChange={setServiceFilter}>
                        <SelectTrigger className="w-[140px] bg-background">
                            <SelectValue placeholder="Service" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Services</SelectItem>
                            <SelectItem value="Hot Desk">Hot Desk</SelectItem>
                            <SelectItem value="Private Office">Private Office</SelectItem>
                            <SelectItem value="Meeting Room">Meeting Room</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px] bg-background">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                            <SelectItem value="Checked-In">Checked-In</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="No-Show">No-Show</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Desktop Table / Mobile Card View */}
            <div className="rounded-xl overflow-hidden">
                {/* Desktop View */}
                <div className="hidden md:block rounded-xl border glass-card overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Date / Time</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBookings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                                        No bookings match your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <TableRow key={booking.id} className="group hover:bg-muted/30">
                                        <TableCell className="font-medium text-foreground">{booking.id}</TableCell>
                                        <TableCell className="font-medium">{booking.customer}</TableCell>
                                        <TableCell className="text-muted-foreground">{booking.service}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{booking.date}</span>
                                                <span className="text-xs text-muted-foreground">{booking.time}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {booking.paid ? (
                                                <span className="text-green-500 font-medium text-xs border border-green-500/30 bg-green-500/10 px-2 py-1 rounded-full">Paid</span>
                                            ) : (
                                                <span className="text-amber-500 font-medium text-xs border border-amber-500/30 bg-amber-500/10 px-2 py-1 rounded-full">Pending</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(booking.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2 transition-opacity">
                                                {booking.status === "Upcoming" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                                                            onClick={() => handleStatusChange(booking.id, "Checked-In")}
                                                        >
                                                            <CheckCircle2 className="size-4 mr-1" />
                                                            Check In
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                            onClick={() => {
                                                                if (confirm(`Mark ${booking.customer} as No-Show for ${booking.id}?`)) {
                                                                    handleStatusChange(booking.id, "No-Show")
                                                                }
                                                            }}
                                                        >
                                                            <XCircle className="size-4 mr-1" />
                                                            No Show
                                                        </Button>
                                                    </>
                                                )}

                                                {booking.status === "Checked-In" && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 text-muted-foreground hover:text-foreground"
                                                        onClick={() => handleStatusChange(booking.id, "Completed")}
                                                    >
                                                        Mark Completed
                                                    </Button>
                                                )}

                                                {/* For edge cases/mistakes */}
                                                {(booking.status === "Completed" || booking.status === "No-Show") && (
                                                    <Button size="sm" variant="ghost" className="h-8 text-muted-foreground opacity-0 group-hover:opacity-100">
                                                        View Details
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {filteredBookings.length === 0 ? (
                        <div className="text-center py-10 glass-card rounded-xl border border-white/5 text-muted-foreground text-sm">
                            No bookings match your filters.
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div key={booking.id} className="glass-card rounded-2xl border border-white/10 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{booking.id}</p>
                                        <h3 className="text-lg font-bold font-outfit text-foreground">{booking.customer}</h3>
                                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>

                                <div className="flex items-center justify-between py-3 border-y border-white/5">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Date / Time</p>
                                        <p className="text-sm font-medium text-foreground">{booking.date} · {booking.time}</p>
                                    </div>
                                    <div className="text-right space-y-0.5">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Payment</p>
                                        {booking.paid ? (
                                            <span className="text-green-500 font-bold text-xs">Paid</span>
                                        ) : (
                                            <span className="text-amber-500 font-bold text-xs">Pending</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {booking.status === "Upcoming" && (
                                        <>
                                            <Button
                                                className="flex-1 h-11 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl"
                                                onClick={() => handleStatusChange(booking.id, "Checked-In")}
                                            >
                                                Check In
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-11 px-4 border-destructive text-destructive hover:bg-destructive/10 rounded-xl"
                                                onClick={() => {
                                                    if (confirm(`Mark ${booking.customer} as No-Show for ${booking.id}?`)) {
                                                        handleStatusChange(booking.id, "No-Show")
                                                    }
                                                }}
                                            >
                                                <XCircle className="size-5" />
                                            </Button>
                                        </>
                                    )}

                                    {booking.status === "Checked-In" && (
                                        <Button
                                            className="flex-1 h-11 bg-primary text-white font-bold rounded-xl"
                                            onClick={() => handleStatusChange(booking.id, "Completed")}
                                        >
                                            Mark Completed
                                        </Button>
                                    )}

                                    {(booking.status === "Completed" || booking.status === "No-Show") && (
                                        <Button variant="outline" className="flex-1 h-11 border-white/10 rounded-xl text-sm font-semibold">
                                            View Details
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
