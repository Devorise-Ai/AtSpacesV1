"use client";

import { useState } from "react";
import { User, Shield, Bell, Activity, Eye, EyeOff, Check, Upload } from "lucide-react";
import { Button } from "@repo/ui/button";

const settingsTabs = [
    { name: "Profile", icon: User },
    { name: "Security", icon: Shield },
    { name: "Notifications", icon: Bell },
    { name: "Activity Log", icon: Activity },
];

const notifications = [
    {
        category: "Approvals", items: [
            { label: "New approval request", email: true, push: true },
            { label: "Request expired (>7 days)", email: true, push: false },
        ]
    },
    {
        category: "Branches", items: [
            { label: "Branch paused/resumed", email: true, push: true },
            { label: "Low occupancy alert (<30%)", email: false, push: true },
        ]
    },
    {
        category: "Vendors", items: [
            { label: "New application submitted", email: true, push: true },
            { label: "Vendor reliability drop", email: true, push: false },
        ]
    },
    {
        category: "System", items: [
            { label: "Scheduled maintenance", email: true, push: true },
            { label: "Security alerts", email: true, push: true },
        ]
    },
];

const activityLog = [
    { action: "Approved request REQ-004", user: "Admin", time: "Feb 23, 2026 14:30", type: "Approval" },
    { action: "Updated Hot Desk pricing", user: "Admin", time: "Feb 23, 2026 12:15", type: "Pricing" },
    { action: "Invited vendor sara@email.com", user: "Admin", time: "Feb 22, 2026 16:45", type: "Vendor" },
    { action: "Paused Salt Creative Hub", user: "Admin", time: "Feb 22, 2026 11:20", type: "Branch" },
    { action: "Rejected request REQ-005", user: "Admin", time: "Feb 21, 2026 09:30", type: "Approval" },
    { action: "Activated Zarqa Tech Park", user: "Admin", time: "Feb 20, 2026 15:00", type: "Branch" },
    { action: "Login from 195.234.xx.xx", user: "Admin", time: "Feb 20, 2026 08:45", type: "Security" },
    { action: "Updated cancellation policy", user: "Admin", time: "Feb 19, 2026 13:10", type: "Policy" },
];

function getTypeStyle(type: string) {
    switch (type) {
        case "Approval": return "bg-yellow-500/10 text-yellow-400";
        case "Pricing": return "bg-blue-500/10 text-blue-400";
        case "Vendor": return "bg-purple-500/10 text-purple-400";
        case "Branch": return "bg-green-500/10 text-green-400";
        case "Security": return "bg-red-500/10 text-red-400";
        case "Policy": return "bg-primary/10 text-primary";
        default: return "bg-muted text-muted-foreground";
    }
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("Profile");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-outfit font-bold text-2xl lg:text-3xl">Settings</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 p-1 rounded-xl bg-muted/50 w-full sm:w-fit">
                {settingsTabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.name
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <tab.icon className="size-4" />
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === "Profile" && (
                <div className="glass-card p-4 sm:p-6 rounded-2xl max-w-2xl">
                    <h2 className="font-outfit font-bold text-lg mb-4 sm:mb-6">Profile Information</h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
                        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center font-outfit font-bold text-primary text-2xl">A</div>
                        <div>
                            <p className="font-outfit font-bold">Admin User</p>
                            <p className="text-xs text-muted-foreground">admin@atspaces.com</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto rounded-xl text-xs">
                            <Upload className="size-3 mr-1" /> Change Photo
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold font-outfit mb-2">Full Name</label>
                                <input type="text" defaultValue="Admin User" className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold font-outfit mb-2">Email</label>
                                <input type="email" defaultValue="admin@atspaces.com" className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold font-outfit mb-2">Phone</label>
                            <input type="tel" defaultValue="+962 7 9000 0000" className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                        </div>
                        <Button className="rounded-xl mt-2"><Check className="size-4 mr-1" /> Save Changes</Button>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === "Security" && (
                <div className="glass-card p-4 sm:p-6 rounded-2xl max-w-2xl">
                    <h2 className="font-outfit font-bold text-lg mb-6">Change Password</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold font-outfit mb-2">Current Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} className="w-full h-11 px-4 pr-12 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold font-outfit mb-2">New Password</label>
                            <input type="password" className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold font-outfit mb-2">Confirm New Password</label>
                            <input type="password" className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                        </div>
                        <Button className="rounded-xl mt-2"><Check className="size-4 mr-1" /> Update Password</Button>
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "Notifications" && (
                <div className="glass-card p-4 sm:p-6 rounded-2xl max-w-2xl">
                    <h2 className="font-outfit font-bold text-lg mb-6">Notification Preferences</h2>
                    <div className="space-y-6">
                        {notifications.map((group) => (
                            <div key={group.category}>
                                <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3">{group.category}</h3>
                                <div className="space-y-2">
                                    {group.items.map((item) => (
                                        <div key={item.label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 p-3 rounded-xl bg-muted/30">
                                            <span className="text-sm">{item.label}</span>
                                            <div className="flex items-center gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" defaultChecked={item.email} className="size-4 rounded accent-primary" />
                                                    <span className="text-xs text-muted-foreground">Email</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" defaultChecked={item.push} className="size-4 rounded accent-primary" />
                                                    <span className="text-xs text-muted-foreground">Push</span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <Button className="rounded-xl"><Check className="size-4 mr-1" /> Save Preferences</Button>
                    </div>
                </div>
            )}

            {/* Activity Log Tab */}
            {activeTab === "Activity Log" && (
                <div className="glass-card p-4 sm:p-6 rounded-2xl">
                    <h2 className="font-outfit font-bold text-lg mb-6">Activity Log</h2>
                    <div className="space-y-2">
                        {activityLog.map((entry, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getTypeStyle(entry.type)}`}>{entry.type}</span>
                                    <span className="text-sm">{entry.action}</span>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{entry.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
