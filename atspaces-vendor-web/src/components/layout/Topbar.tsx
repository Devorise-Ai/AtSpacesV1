import { Bell } from "lucide-react";

export function Topbar() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-outfit font-semibold text-foreground">
                    {/* We can make this dynamic based on route later */}
                </h2>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <Bell className="size-5" />
                    <span className="absolute right-1.5 top-1.5 flex size-2.5 rounded-full bg-primary" />
                </button>
                <div className="flex items-center gap-3 border-l pl-4">
                    <div className="size-8 rounded-full bg-secondary flex items-center justify-center font-semibold text-sm">
                        V
                    </div>
                    <div className="hidden flex-col sm:flex">
                        <span className="text-sm font-medium leading-none">Vendor Demo</span>
                        <span className="text-xs text-muted-foreground mt-1">Amman Branch</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
