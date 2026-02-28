"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Simulate API call
        await new Promise((r) => setTimeout(r, 1500));

        // Basic validation for demo
        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        setIsSubmitted(true);
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left branding panel (Mirroring Login page) */}
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
                        Recover your account<br />
                        <span className="text-primary">access.</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Enter your email and we'll send you a link to reset your password and get back to managing your space.
                    </p>
                </div>

                {/* Stats row (Consistency) */}
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

            {/* Right Reset form */}
            <div className="flex flex-1 flex-col items-center justify-center p-8">
                {/* Mobile logo */}
                <div className="flex items-center gap-2 mb-10 lg:hidden text-center">
                    <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">A</div>
                    <span className="text-xl font-bold tracking-tight font-outfit">AtSpaces <span className="text-primary text-sm font-normal uppercase tracking-wider">Vendor</span></span>
                </div>

                <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {!isSubmitted ? (
                        <>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold font-outfit text-foreground">Forgot password?</h2>
                                <p className="text-muted-foreground">No worries, it happens. We'll send you reset instructions.</p>
                            </div>

                            {/* Error banner */}
                            {error && (
                                <div className="flex items-center gap-2.5 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                    <AlertCircle className="size-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            className="pl-10 bg-card"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                            Sending...
                                        </span>
                                    ) : "Send Reset Link"}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-6 py-4">
                            <div className="inline-flex size-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-2 border border-emerald-500/20">
                                <CheckCircle2 className="size-10" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold font-outfit text-foreground">Check your email</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    We've sent a password reset link to <span className="text-foreground font-semibold">{email}</span>. Please follow the instructions to reset your password.
                                </p>
                            </div>
                            <Link href="/vendor/login" className="block">
                                <Button variant="outline" className="w-full h-11 border-white/10 hover:bg-white/5 font-semibold">
                                    Back to Login
                                </Button>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                                Did't receive the email?{" "}
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-primary font-medium hover:underline"
                                >
                                    Try again
                                </button>
                            </p>
                        </div>
                    )}

                    {!isSubmitted && (
                        <div className="text-center">
                            <Link
                                href="/vendor/login"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                            >
                                <ArrowLeft className="size-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
