"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-background">
            <div className="w-full max-w-md">
                <div className="flex items-center gap-3 mb-10 justify-center">
                    <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                        <LayoutGrid className="size-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-outfit font-bold text-xl leading-none">AtSpaces</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Admin</span>
                    </div>
                </div>

                {!isSubmitted ? (
                    <>
                        <div className="mb-8 text-center">
                            <h2 className="font-outfit font-bold text-2xl mb-2">Reset Password</h2>
                            <p className="text-muted-foreground text-sm">Enter your email and we&apos;ll send you a reset link.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold font-outfit mb-2 text-foreground">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@atspaces.com"
                                    className="w-full h-12 px-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </div>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <Mail className="size-8 text-primary" />
                        </div>
                        <h2 className="font-outfit font-bold text-2xl mb-2">Check Your Email</h2>
                        <p className="text-muted-foreground text-sm mb-6">
                            We&apos;ve sent a password reset link to <strong className="text-foreground">{email}</strong>.
                        </p>
                        <p className="text-muted-foreground text-xs">
                            Didn&apos;t receive it? Check your spam folder or try again.
                        </p>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                        <ArrowLeft className="size-4" />
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
