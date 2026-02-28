"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle2, XCircle, Lock, AlertCircle } from "lucide-react";

// Demo: simulate a valid invite token
const MOCK_INVITE = {
    valid: true,
    email: "branch@yourbusiness.com",
    branchName: "The Corner Hub",
};

function PasswordStrength({ password }: { password: string }) {
    const criteria = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "Uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Number", met: /\d/.test(password) },
        { label: "Special character (!@#...)", met: /[!@#$%^&*]/.test(password) },
    ];
    const metCount = criteria.filter((c) => c.met).length;
    const strength = metCount === 0 ? 0 : metCount <= 2 ? 1 : metCount === 3 ? 2 : 3;
    const bars = ["bg-destructive", "bg-amber-500", "bg-emerald-500"];
    const labels = ["", "Weak", "Good", "Strong"];

    if (!password) return null;

    return (
        <div className="space-y-2 mt-2">
            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${i < strength ? bars[strength - 1] : "bg-secondary"}`}
                    />
                ))}
            </div>
            <p className="text-xs font-medium text-muted-foreground">{labels[strength]}</p>
            <ul className="space-y-1">
                {criteria.map((c) => (
                    <li key={c.label} className={`flex items-center gap-1.5 text-xs transition-colors ${c.met ? "text-emerald-500" : "text-muted-foreground"}`}>
                        {c.met ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3 opacity-40" />}
                        {c.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function VendorOnboardPage() {
    const router = useRouter();
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Simulate expired invite (set to false to demo expired state)
    const invite = MOCK_INVITE;

    if (!invite.valid) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-background">
                <div className="w-full max-w-md text-center space-y-6">
                    <div className="mx-auto size-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
                        <AlertCircle className="size-8" />
                    </div>
                    <h1 className="text-2xl font-bold font-outfit text-foreground">Invitation Expired</h1>
                    <p className="text-muted-foreground">
                        This invitation link has expired or is no longer valid. Please contact AtSpaces support to request a new one.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={() => router.push("/vendor/login")}>Go to Login</Button>
                        <Button onClick={() => window.location.href = "mailto:support@atspaces.com"}>Contact Support</Button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        // On success, forward to first-time setup wizard
        router.push("/vendor/setup");
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
            <div className="w-full max-w-lg space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2.5 mb-6">
                        <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">A</div>
                        <span className="text-xl font-bold tracking-tight font-outfit">AtSpaces <span className="text-primary text-sm font-normal uppercase tracking-wider">Vendor</span></span>
                    </div>

                    {/* Email verified badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 text-sm text-emerald-500 font-medium">
                        <CheckCircle2 className="size-4" />
                        Email Verified
                    </div>

                    <h1 className="text-3xl font-bold font-outfit text-foreground pt-2">
                        Welcome to AtSpaces!
                    </h1>
                    <p className="text-muted-foreground text-base">
                        You've been invited to manage{" "}
                        <span className="font-semibold text-foreground">{invite.branchName}</span>.
                        <br /> Set a password to activate your account.
                    </p>
                    <p className="text-sm text-muted-foreground border border-border rounded-md px-4 py-2 bg-card">
                        Account: <span className="font-medium text-foreground">{invite.email}</span>
                    </p>
                </div>

                {/* Form card */}
                <div className="rounded-xl border bg-card p-8 shadow-sm space-y-6">
                    {error && (
                        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            <AlertCircle className="size-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="password">Create Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPass ? "text" : "password"}
                                    className="pl-10 pr-10 bg-background"
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                            <PasswordStrength password={password} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    id="confirm"
                                    type={showConfirm ? "text" : "password"}
                                    className={`pl-10 pr-10 bg-background ${confirmPassword && confirmPassword !== password ? "border-destructive" : ""}`}
                                    placeholder="Repeat your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                            {confirmPassword && confirmPassword !== password && (
                                <p className="text-xs text-destructive">Passwords do not match.</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 font-semibold mt-2"
                            disabled={isLoading || !password || password !== confirmPassword}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Setting up account...
                                </span>
                            ) : "Activate Account & Get Started"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
