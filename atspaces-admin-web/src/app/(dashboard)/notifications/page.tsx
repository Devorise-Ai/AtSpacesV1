"use client";

import { useState } from "react";
import {
    Bell, Check, CheckCheck, Trash2, Filter, Clock,
    Building2, Users, DollarSign, AlertTriangle, FileText, Shield,
    ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NotificationType = "approval" | "branch" | "vendor" | "pricing" | "security" | "application";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read: boolean;
    actionUrl?: string;
}

const allNotifications: Notification[] = [
    { id: "1", type: "approval", title: "New Approval Request", message: "Mohammed Al-Khatib requested to increase Hot Desk capacity from 30 to 45 seats at Amman Downtown Hub.", time: "5 min ago", read: false },
    { id: "2", type: "branch", title: "Low Occupancy Alert", message: "Zarqa Tech Park occupancy dropped below 30% for the third consecutive day.", time: "12 min ago", read: false },
    { id: "3", type: "vendor", title: "New Vendor Application", message: "Khalil Rawashine submitted a 'Become a Vendor' application for Khalil Co-Work in Amman.", time: "34 min ago", read: false },
    { id: "4", type: "security", title: "Unusual Login Detected", message: "A login attempt from an unrecognized IP address (185.234.xx.xx) was blocked.", time: "1 hr ago", read: false },
    { id: "5", type: "approval", title: "Request Expiring Soon", message: "REQ-002 from Dina Masri (branch pause) has been pending for 4 days. Auto-expires in 3 days.", time: "2 hr ago", read: true },
    { id: "6", type: "pricing", title: "Pricing Update Applied", message: "Hot Desk hourly rate updated from 3.00 JOD to 3.50 JOD across all branches.", time: "3 hr ago", read: true },
    { id: "7", type: "branch", title: "Branch Resumed", message: "Salt Creative Hub has been resumed after 2-week maintenance. All services are now active.", time: "5 hr ago", read: true },
    { id: "8", type: "vendor", title: "Vendor Reliability Drop", message: "Omar Nabil's reliability score dropped to 72%. No-show rate at 8.2%.", time: "6 hr ago", read: true },
    { id: "9", type: "application", title: "Application Approved", message: "Tariq Abu-Ghazaleh's application for TAX Work Hub in Aqaba has been approved.", time: "Yesterday", read: true },
    { id: "10", type: "security", title: "Password Changed", message: "Your account password was successfully changed.", time: "Yesterday", read: true },
    { id: "11", type: "branch", title: "New Branch Activated", message: "Abdali Business Center is now live and accepting bookings.", time: "2 days ago", read: true },
    { id: "12", type: "approval", title: "Request Rejected", message: "REQ-005 from Omar Nabil (capacity increase to 100 seats) was rejected.", time: "3 days ago", read: true },
];

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
    approval: { icon: CheckCheck, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    branch: { icon: Building2, color: "text-green-400", bg: "bg-green-500/10" },
    vendor: { icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
    pricing: { icon: DollarSign, color: "text-blue-400", bg: "bg-blue-500/10" },
    security: { icon: Shield, color: "text-red-400", bg: "bg-red-500/10" },
    application: { icon: FileText, color: "text-primary", bg: "bg-primary/10" },
};

const filterOptions: { label: string; value: string }[] = [
    { label: "All", value: "all" },
    { label: "Approvals", value: "approval" },
    { label: "Branches", value: "branch" },
    { label: "Vendors", value: "vendor" },
    { label: "Pricing", value: "pricing" },
    { label: "Security", value: "security" },
    { label: "Applications", value: "application" },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(allNotifications);
    const [filter, setFilter] = useState("all");
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const filtered = notifications.filter((n) => {
        if (filter !== "all" && n.type !== filter) return false;
        if (showUnreadOnly && n.read) return false;
        return true;
    });

    const markAsRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const clearAll = () => {
        setNotifications((prev) => prev.filter((n) => !n.read));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-outfit font-bold text-2xl lg:text-3xl">Notifications</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {unreadCount > 0
                            ? <><span className="text-primary font-semibold">{unreadCount} unread</span> notification{unreadCount !== 1 ? "s" : ""}</>
                            : "You\u2019re all caught up!"
                        }
                    </p>
                </div>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={markAllAsRead}>
                            <CheckCheck className="size-3.5 mr-1" /> Mark All Read
                        </Button>
                    )}
                    <Button variant="ghost" size="sm" className="rounded-xl text-xs text-muted-foreground" onClick={clearAll}>
                        <Trash2 className="size-3.5 mr-1" /> Clear Read
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                    {filterOptions.map((opt) => {
                        const count = opt.value === "all"
                            ? notifications.length
                            : notifications.filter((n) => n.type === opt.value).length;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => setFilter(opt.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${filter === opt.value
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "bg-muted/50 text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {opt.label}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === opt.value ? "bg-white/20" : "bg-muted"}`}>{count}</span>
                            </button>
                        );
                    })}
                </div>
                <button
                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ml-auto ${showUnreadOnly
                        ? "bg-primary/10 text-primary"
                        : "bg-muted/50 text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Unread only
                </button>
            </div>

            {/* Notification List */}
            <div className="space-y-2">
                {filtered.map((notification) => {
                    const config = typeConfig[notification.type];
                    const Icon = config.icon;

                    return (
                        <div
                            key={notification.id}
                            className={`glass-card p-3 sm:p-4 rounded-2xl flex items-start gap-3 sm:gap-4 transition-all group ${!notification.read
                                ? "border-l-2 border-l-primary bg-primary/[0.02]"
                                : "opacity-70 hover:opacity-100"
                                }`}
                        >
                            <div className={`size-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                                <Icon className={`size-5 ${config.color}`} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className={`font-outfit font-semibold text-sm ${!notification.read ? "" : "text-muted-foreground"}`}>
                                        {notification.title}
                                    </h3>
                                    {!notification.read && (
                                        <span className="size-2 rounded-full bg-primary shrink-0" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{notification.message}</p>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <Clock className="size-3 text-muted-foreground" />
                                    <span className="text-[11px] text-muted-foreground">{notification.time}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                {!notification.read && (
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                        title="Mark as read"
                                    >
                                        <Check className="size-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className="size-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
                <div className="glass-card p-12 rounded-2xl text-center">
                    <Bell className="size-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-outfit font-bold text-lg mb-1">
                        {showUnreadOnly ? "No unread notifications" : "No notifications"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {showUnreadOnly
                            ? "You\u2019ve read all your notifications. Toggle off the filter to see everything."
                            : "When something happens in the network, you\u2019ll see it here."
                        }
                    </p>
                </div>
            )}
        </div>
    );
}
