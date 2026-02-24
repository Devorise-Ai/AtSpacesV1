"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const steps = [
    { id: 1, title: "Personal Info" },
    { id: 2, title: "Branch Info" },
    { id: 3, title: "Space Details" },
    { id: 4, title: "Uploads" },
];

export default function BecomeAVendor() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        branchName: "",
        city: "",
        address: "",
        mapsLink: "",
        offersHotDesk: false,
        offersPrivateOffice: false,
        offersMeetingRoom: false,
    });

    const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => setIsSubmitted(true), 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    if (isSubmitted) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-background">
                <Card className="w-full max-w-md text-center py-8">
                    <CardHeader>
                        <div className="mx-auto size-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <CardTitle className="text-2xl font-outfit">Application Submitted</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Thank you for applying to join AtSpaces! Our team will review your branch details and contact you shortly.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button onClick={() => window.location.href = '/'}>Return Home</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center py-12 px-4 bg-muted/30">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                        Partner with us
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight font-outfit text-foreground">
                        Grow your workspace revenue
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Join the AtSpaces network and reach thousands of professionals looking for flexible desks and private offices.
                    </p>
                </div>

                {/* Form Wizard */}
                <Card className="border-border/50 shadow-sm backdrop-blur-sm bg-card/95">
                    <CardHeader>
                        {/* Progress Bar */}
                        <div className="mb-6 flex items-center justify-between">
                            {steps.map((step) => (
                                <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 w-full">
                                    <div className={`flex size-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${step.id === currentStep ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,91,4,0.4)]" :
                                            step.id < currentStep ? "bg-primary/80 text-primary-foreground" :
                                                "bg-secondary text-muted-foreground"
                                        }`}>
                                        {step.id < currentStep ? "✓" : step.id}
                                    </div>
                                    <span className={`text-xs font-medium hidden sm:block ${step.id === currentStep ? "text-primary" : "text-muted-foreground"}`}>
                                        {step.title}
                                    </span>
                                </div>
                            ))}
                            <div className="absolute left-[10%] right-[10%] top-[41px] h-[2px] bg-secondary -z-10 hidden sm:block">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                                />
                            </div>
                        </div>

                        <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                        <CardDescription>Please provide accurate details to speed up your approval process.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            {/* Step 1: Personal Info */}
                            {currentStep === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+962 7X XXX XXXX" required />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Branch Info */}
                            {currentStep === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="branchName">Branch / Workspace Name</Label>
                                        <Input id="branchName" name="branchName" value={formData.branchName} onChange={handleChange} placeholder="e.g. The Hub Hub" required />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Amman" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mapsLink">Google Maps Link</Label>
                                            <Input id="mapsLink" name="mapsLink" value={formData.mapsLink} onChange={handleChange} placeholder="https://maps.google.com/..." required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Detailed Address</Label>
                                        <Textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Building number, Street, Neighborhood" required />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Space Details */}
                            {currentStep === 3 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                    <Label>Which services do you plan to offer through AtSpaces?</Label>
                                    <p className="text-sm text-muted-foreground mb-4">Select all that apply.</p>

                                    <div className="grid grid-cols-1 gap-4">
                                        <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-secondary/50 ${formData.offersHotDesk ? 'border-primary bg-primary/5' : ''}`}>
                                            <input type="checkbox" name="offersHotDesk" checked={formData.offersHotDesk} onChange={handleChange} className="mt-1" />
                                            <div>
                                                <div className="font-medium text-foreground">Hot Desks</div>
                                                <div className="text-sm text-muted-foreground">Shared seating areas for freelancers or remote workers.</div>
                                            </div>
                                        </label>
                                        <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-secondary/50 ${formData.offersPrivateOffice ? 'border-primary bg-primary/5' : ''}`}>
                                            <input type="checkbox" name="offersPrivateOffice" checked={formData.offersPrivateOffice} onChange={handleChange} className="mt-1" />
                                            <div>
                                                <div className="font-medium text-foreground">Private Offices</div>
                                                <div className="text-sm text-muted-foreground">Enclosed rooms for teams or individuals.</div>
                                            </div>
                                        </label>
                                        <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-secondary/50 ${formData.offersMeetingRoom ? 'border-primary bg-primary/5' : ''}`}>
                                            <input type="checkbox" name="offersMeetingRoom" checked={formData.offersMeetingRoom} onChange={handleChange} className="mt-1" />
                                            <div>
                                                <div className="font-medium text-foreground">Meeting Rooms</div>
                                                <div className="text-sm text-muted-foreground">Bookable by the hour for team meetings.</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Uploads */}
                            {currentStep === 4 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div className="space-y-3">
                                        <Label>Branch Photography</Label>
                                        <div className="border-2 border-dashed border-border rounded-lg p-10 text-center hover:bg-secondary/50 transition-colors cursor-pointer">
                                            <div className="mx-auto size-12 bg-secondary rounded-full flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                            </div>
                                            <p className="font-medium text-foreground">Click to upload or drag and drop</p>
                                            <p className="text-sm text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Trade License / Business Registration</Label>
                                        <Input type="file" />
                                        <p className="text-xs text-muted-foreground">Required for vetting process.</p>
                                    </div>
                                </div>
                            )}
                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t pt-6 bg-secondary/10">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                        >
                            Back
                        </Button>

                        {currentStep < steps.length ? (
                            <Button onClick={handleNext}>Continue</Button>
                        ) : (
                            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-white">
                                Submit Application
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
