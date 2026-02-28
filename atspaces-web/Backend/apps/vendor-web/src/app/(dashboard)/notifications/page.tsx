"use client";

import { useState } from "react";
import { Card, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bell,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    Info,
    MoreVertical,
    Search,
    Trash2,
    Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type NotificationType = "booking" | "alert" | "system";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    time: string;
    isRead: boolean;
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "booking",
        title: "New Booking Received",
        description: "Sarah Miller booked 'Hot Desk A' for tomorrow at 09:00 AM.",
        time: "2 mins ago",
        isRead: false
    },
    {
        id: "2",
        type: "alert",
        title: "Capacity Warning",
        description: "Meeting Room B is reaching 90% occupancy for this afternoon.",
        time: "1 hour ago",
        isRead: false
    },
    {
        id: "3",
        type: "system",
        title: "Payout Successful",
        description: "Your weekly payout of 4,250 SAR has been processed to your Al Rajhi account.",
        time: "3 hours ago",
        isRead: true
    },
    {
        id: "4",
        type: "booking",
        title: "Booking Cancelled",
        description: "Ahmad K. cancelled his reservation for 'Private Office 4'.",
        time: "5 hours ago",
        isRead: true
    },
    {
        id: "5",
        type: "alert",
        title: "Profile Incomplete",
        description: "Please add your VAT ID to ensure uninterrupted payouts.",
        time: "1 day ago",
        isRead: true
    }
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [filter, setFilter] = useState("all");

    const filteredNotifications = notifications.filter(n => {
        if (filter === "all") return true;
        if (filter === "unread") return !n.isRead;
        return n.type === filter;
    });

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "booking": return <Calendar className="size-4 text-blue-500" />;
            case "alert": return <AlertTriangle className="size-4 text-amber-500" />;
            case "system": return <CheckCircle2 className="size-4 text-emerald-500" />;
            default: return <Info className="size-4 text-primary" />;
        }
    };

    const getBgColor = (type: NotificationType) => {
        switch (type) {
            case "booking": return "bg-blue-500/10 border-blue-500/20";
            case "alert": return "bg-amber-500/10 border-amber-500/20";
            case "system": return "bg-emerald-500/10 border-emerald-500/20";
            default: return "bg-primary/10 border-primary/20";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            {/* ── Page Header ── */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-outfit tracking-tight text-foreground">Notifications</h1>
                    <p className="text-muted-foreground">Stay updated with your latest bookings and system alerts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={markAllAsRead}
                        className="h-10 border-white/10 hover:bg-white/5 font-semibold"
                    >
                        <Check className="size-4 mr-2" />
                        Mark all as read
                    </Button>
                </div>
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                    <Tabs defaultValue="all" onValueChange={setFilter} className="w-auto">
                        <TabsList className="bg-muted/30 p-1 rounded-xl border border-white/5 h-auto flex gap-1 w-max">
                            <TabsTrigger value="all" className="rounded-lg py-2 px-4 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-semibold text-xs">
                                All
                            </TabsTrigger>
                            <TabsTrigger value="unread" className="rounded-lg py-2 px-4 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-semibold text-xs">
                                Unread
                            </TabsTrigger>
                            <TabsTrigger value="booking" className="rounded-lg py-2 px-4 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-semibold text-xs">
                                Bookings
                            </TabsTrigger>
                            <TabsTrigger value="alert" className="rounded-lg py-2 px-4 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-semibold text-xs">
                                Alerts
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        className="w-full bg-muted/30 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
            </div>

            {/* ── Notifications Feed ── */}
            <div className="space-y-3">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((n) => (
                        <Card
                            key={n.id}
                            className={`glass-card border-white/5 transition-all duration-300 hover:scale-[1.01] group ${!n.isRead ? 'border-l-4 border-l-primary ring-1 ring-primary/10' : ''}`}
                        >
                            <CardContent className="p-4 flex items-start gap-4">
                                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 border ${getBgColor(n.type)}`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1 space-y-1 overflow-hidden">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <h3 className={`font-bold text-sm truncate ${!n.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {n.title}
                                            </h3>
                                            {!n.isRead && (
                                                <Badge className="bg-primary hover:bg-primary text-[10px] font-bold h-4 px-1 rounded-full shrink-0">NEW</Badge>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2 md:line-clamp-none">
                                        {n.description}
                                    </p>
                                </div>
                                <div className="flex items-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity translate-x-0 md:translate-x-2 md:group-hover:translate-x-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteNotification(n.id)}
                                        className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground rounded-lg">
                                        <MoreVertical className="size-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 glass-card border-dashed border-white/10 bg-transparent">
                        <div className="size-16 rounded-full bg-muted/30 flex items-center justify-center">
                            <Bell className="size-8 text-muted-foreground/30" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">No notifications found</p>
                            <p className="text-sm text-muted-foreground">We'll let you know when something important happens.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
