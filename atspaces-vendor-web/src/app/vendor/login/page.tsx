"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

export default function VendorLoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Simulate API call
        await new Promise((r) => setTimeout(r, 1200));

        // Demo: wrong password check
        if (formData.password !== "vendor123") {
            setError("Invalid email or password. Please try again.");
            setIsLoading(false);
            return;
        }

        // Success → redirect to dashboard
        router.push("/dashboard");
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left branding panel */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] bg-card border-r p-12">
                <div>
                    <div className="flex items-center gap-2.5 mb-16">
                        <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                            A
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground font-outfit">
                            AtSpaces <span className="text-primary text-sm font-normal uppercase tracking-wider">Vendor</span>
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold font-outfit text-foreground leading-tight mb-4">
                        Manage your workspace<br />
                        <span className="text-primary">with clarity.</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Your operations dashboard for real-time capacity control, booking oversight, and branch performance.
                    </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-6">
                    {[
                        { label: "Active Branches", value: "50+" },
                        { label: "Bookings Today", value: "1.2K" },
                        { label: "Avg Occupancy", value: "78%" },
                    ].map((s) => (
                        <div key={s.label} className="rounded-xl bg-secondary p-4 text-center">
                            <div className="text-2xl font-bold font-outfit text-primary">{s.value}</div>
                            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right login form */}
            <div className="flex flex-1 flex-col items-center justify-center p-8">
                {/* Mobile logo */}
                <div className="flex items-center gap-2 mb-10 lg:hidden">
                    <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">A</div>
                    <span className="text-xl font-bold tracking-tight font-outfit">AtSpaces <span className="text-primary text-sm font-normal uppercase tracking-wider">Vendor</span></span>
                </div>

                <div className="w-full max-w-sm space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold font-outfit text-foreground">Welcome back</h2>
                        <p className="text-muted-foreground mt-1">Sign in to your vendor account to continue.</p>
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div className="flex items-center gap-2.5 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            <AlertCircle className="size-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="pl-10 bg-card"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="/vendor/forgot-password"
                                    className="text-xs text-primary hover:underline"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    className="pl-10 pr-10 bg-card"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="size-4 rounded border-border accent-primary"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <Label htmlFor="remember" className="font-normal text-muted-foreground cursor-pointer">
                                Remember me for 30 days
                            </Label>
                        </div>

                        <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Signing in...
                                </span>
                            ) : "Sign In"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        New vendor?{" "}
                        <a href="/become-a-vendor" className="text-primary font-medium hover:underline">
                            Apply to join AtSpaces
                        </a>
                    </p>

                    {/* Demo hint */}
                    <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3 text-center">
                        <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Demo credentials:</span> any email + password <code className="bg-secondary px-1 rounded">vendor123</code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
