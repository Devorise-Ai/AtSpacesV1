"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    User,
    Building2,
    MapPin,
    CreditCard,
    Bell,
    ShieldCheck,
    Camera,
    Mail,
    Phone,
    Globe,
    Lock,
    Save,
    Clock
} from "lucide-react";

export default function ProfilePage() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            {/* ── Page Header ── */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-outfit tracking-tight text-foreground">Vendor Profile</h1>
                <p className="text-muted-foreground">Manage your brand identity, contact settings, and business locations.</p>
            </div>

            {/* ── Profile Overview Card ── */}
            <Card className="glass-card border-white/5 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="relative group">
                            <div className="size-24 rounded-2xl bg-card border-4 border-background shadow-xl flex items-center justify-center overflow-hidden">
                                <Building2 className="size-10 text-primary" />
                            </div>
                            <button className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                <Camera className="size-6" />
                            </button>
                        </div>
                    </div>
                </div>
                <CardContent className="pt-16 pb-6 px-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold font-outfit">TechHub Coworking Space</h2>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                <ShieldCheck className="size-4 text-emerald-500" />
                                <span>Verified Partner since 2024</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="h-10 border-white/10 hover:bg-white/5">View Public Listing</Button>
                            <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white h-10 px-6 font-bold shadow-lg shadow-primary/20">
                                {isSaving ? "Saving..." : "Save All Changes"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="general" className="w-full">
                <div className="flex justify-start mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    <TabsList className="bg-muted/30 p-1 rounded-xl border border-white/5 h-auto flex gap-1 w-max md:w-auto">
                        <TabsTrigger value="general" className="rounded-lg py-2.5 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-semibold text-sm whitespace-nowrap">
                            <Building2 className="size-4 mr-2" />
                            General
                        </TabsTrigger>
                        <TabsTrigger value="branch" className="rounded-lg py-2.5 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-semibold text-sm whitespace-nowrap">
                            <MapPin className="size-4 mr-2" />
                            Branch
                        </TabsTrigger>
                        <TabsTrigger value="account" className="rounded-lg py-2.5 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-semibold text-sm whitespace-nowrap">
                            <User className="size-4 mr-2" />
                            Account
                        </TabsTrigger>
                        <TabsTrigger value="payouts" className="rounded-lg py-2.5 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-semibold text-sm whitespace-nowrap">
                            <CreditCard className="size-4 mr-2" />
                            Payouts
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* ── General Section ── */}
                <TabsContent value="general" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Card className="glass-card border-white/5">
                        <CardHeader>
                            <CardTitle className="font-outfit text-xl">Brand Identity</CardTitle>
                            <CardDescription>Professional details that appear on your storefront.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="biz-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Business Display Name</Label>
                                    <Input id="biz-name" defaultValue="TechHub Coworking Space" className="bg-muted/40 border-white/5 focus:border-primary/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Primary Category</Label>
                                    <Select defaultValue="coworking">
                                        <SelectTrigger className="bg-muted/40 border-white/5">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="coworking">Coworking Space</SelectItem>
                                            <SelectItem value="private-office">Private Office Provider</SelectItem>
                                            <SelectItem value="hotel">Business Hotel</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Business Description</Label>
                                <Textarea
                                    id="description"
                                    defaultValue="Premium coworking space located in the heart of the tech district. We offer high-speed internet, ergonomic furniture, and a community of innovators."
                                    className="min-h-[120px] bg-muted/40 border-white/5 focus:border-primary/50 resize-none"
                                />
                                <p className="text-[10px] text-muted-foreground/60 italic">Maximum 500 characters. Describe what makes your space unique.</p>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="website" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Website URL</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                        <Input id="website" placeholder="https://yoursite.com" className="pl-10 bg-muted/40 border-white/5 focus:border-primary/50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Public Support Phone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                        <Input id="phone" defaultValue="+966 50 123 4567" className="pl-10 bg-muted/40 border-white/5 focus:border-primary/50" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── Branch Section ── */}
                <TabsContent value="branch" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="md:col-span-2 glass-card border-white/5">
                            <CardHeader>
                                <CardTitle className="font-outfit text-xl">Branch Location</CardTitle>
                                <CardDescription>Physical address and map coordinates.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Street Address</Label>
                                    <Input id="address" defaultValue="King Fahd Road, Al Olaya District" className="bg-muted/40 border-white/5 focus:border-primary/50" />
                                </div>
                                <div className="grid gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">City</Label>
                                        <Input id="city" defaultValue="Riyadh" className="bg-muted/40 border-white/5 focus:border-primary/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="postal" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Postal Code</Label>
                                        <Input id="postal" defaultValue="12211" className="bg-muted/40 border-white/5 focus:border-primary/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="building" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Building/Floor</Label>
                                        <Input id="building" defaultValue="Tower A, 15th Floor" className="bg-muted/40 border-white/5 focus:border-primary/50" />
                                    </div>
                                </div>
                                <div className="h-48 bg-muted/20 rounded-xl border border-white/5 flex items-center justify-center text-muted-foreground flex-col gap-2">
                                    <MapPin className="size-8 opacity-50" />
                                    <span className="text-xs font-medium uppercase tracking-widest opacity-50">Map Preview Placeholder</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-white/5 h-fit">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Clock className="size-5 text-primary" />
                                    <CardTitle className="font-outfit text-xl">Operating Hours</CardTitle>
                                </div>
                                <CardDescription>When is your space open?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-white/5">
                                    <span className="text-sm font-semibold">Sunday - Thursday</span>
                                    <span className="text-sm font-bold text-primary">08:00 - 22:00</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-white/5">
                                    <span className="text-sm font-semibold">Friday</span>
                                    <span className="text-sm font-bold text-muted-foreground">Closed</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-white/5">
                                    <span className="text-sm font-semibold">Saturday</span>
                                    <span className="text-sm font-bold text-primary">10:00 - 18:00</span>
                                </div>
                                <Button variant="outline" size="sm" className="w-full mt-4 border-primary/20 text-primary hover:bg-primary/5">Edit Schedule</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ── Account Section ── */}
                <TabsContent value="account" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Card className="glass-card border-white/5">
                        <CardHeader>
                            <CardTitle className="font-outfit text-xl">Account Credentials</CardTitle>
                            <CardDescription>Secure access and primary contact information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Login Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                            <Input id="contact-email" defaultValue="admin@techhub.sa" disabled className="pl-10 bg-muted/20 border-white/5 cursor-not-allowed" />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic">Email changes require security verification.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="current-pass" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Change Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                            <Input id="current-pass" type="password" placeholder="••••••••••••" className="pl-10 bg-muted/40 border-white/5 focus:border-primary/50" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="manager" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Lead Manager</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                            <Input id="manager" defaultValue="Omar Al-Fahad" className="pl-10 bg-muted/40 border-white/5 focus:border-primary/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-pass" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Confirm New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                            <Input id="new-pass" type="password" placeholder="••••••••••••" className="pl-10 bg-muted/40 border-white/5 focus:border-primary/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/10 border-t border-white/5 p-6 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <ShieldCheck className="size-4 text-emerald-500" />
                                <span className="text-xs font-medium">Two-Factor Authentication is Enabled</span>
                            </div>
                            <Button variant="outline" size="sm" className="h-9 font-bold px-4 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all">Enable 2FA</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* ── Payouts Section ── */}
                <TabsContent value="payouts" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Card className="glass-card border-white/5">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="font-outfit text-xl">Payout Settings</CardTitle>
                                <CardDescription>Manage how you receive your earnings.</CardDescription>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                                Active for Payouts
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 flex items-start gap-4">
                                <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <CreditCard className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-sm">Al Rajhi Bank Terminal</p>
                                    <p className="text-xs text-muted-foreground font-medium">SA43 1000 0000 1234 5678 9012 • Main Account</p>
                                </div>
                                <Button variant="ghost" size="sm" className="ml-auto text-xs font-bold text-primary hover:bg-primary/5">Edit</Button>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Payout Schedule</Label>
                                    <Select defaultValue="weekly">
                                        <SelectTrigger className="bg-muted/40 border-white/5">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Daily Settlements</SelectItem>
                                            <SelectItem value="weekly">Weekly (Every Monday)</SelectItem>
                                            <SelectItem value="monthly">Monthly Settlements</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">VAT Identification Number</Label>
                                    <Input defaultValue="310123456700003" className="bg-muted/40 border-white/5 focus:border-primary/50" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/10 border-t border-white/5 p-6 flex items-center justify-center">
                            <p className="text-[10px] text-muted-foreground text-center max-w-sm">
                                Payouts are processed according to the selected schedule. Transaction fees and VAT are automatically deducted at source.
                            </p>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
