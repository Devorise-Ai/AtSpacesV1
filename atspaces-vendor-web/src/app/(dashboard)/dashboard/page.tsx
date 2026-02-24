import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your branch's daily operations.
                    </p>
                </div>

                <div className="rounded-lg border bg-card p-8 text-center border-dashed">
                    <p className="text-muted-foreground font-medium">Dashboard Summary Components (To be implemented)</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
