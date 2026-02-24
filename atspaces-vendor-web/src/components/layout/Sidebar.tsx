import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Settings,
    ClipboardList,
    BarChart,
    UserCircle
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Capacity", href: "/capacity", icon: Settings },
    { name: "Bookings", href: "/bookings", icon: ClipboardList },
    { name: "Reports", href: "/reports", icon: BarChart },
    { name: "Profile", href: "/profile", icon: UserCircle },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col gap-4 border-r bg-card p-6">
            <div className="flex items-center gap-2 px-2 pb-6 pt-2">
                {/* Simple AtSpaces Logo Placeholder */}
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                    A
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground font-outfit">
                    AtSpaces <span className="text-primary text-sm font-normal uppercase tracking-wider">Vendor</span>
                </span>
            </div>

            <nav className="flex flex-1 flex-col gap-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                        >
                            <item.icon className="size-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <div className="rounded-lg bg-secondary p-4 text-xs">
                    <p className="font-semibold text-foreground mb-1">Need help?</p>
                    <p className="text-muted-foreground mb-3">Contact vendor support.</p>
                    <a href="#" className="font-medium text-primary hover:underline">support@atspaces.com</a>
                </div>
            </div>
        </div>
    );
}
