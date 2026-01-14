"use client";

import { Video, Home, Settings, LogOut, Clapperboard, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar - Desktop */}
            <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/" className="flex items-center justify-center p-2">
                        <img src="/logo.png" alt="Huddle Logo" className="w-16 h-16 object-contain" />
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <SidebarItem icon={Home} label="Overview" href="/dashboard" active={pathname === "/dashboard"} />
                    <SidebarItem icon={MonitorPlay} label="Work Meetings" href="/dashboard?mode=work" active={pathname.includes("mode=work")} />
                    <SidebarItem icon={Clapperboard} label="Watch Parties" href="/dashboard?mode=play" active={pathname.includes("mode=play")} />
                    <div className="my-4 border-t border-border/50" />
                    <SidebarItem icon={Settings} label="Settings" href="/dashboard/settings" active={pathname === "/dashboard/settings"} />
                </nav>

                <div className="p-4 border-t border-border space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium">Theme</span>
                        <ModeToggle />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
                        <div>
                            <p className="text-sm font-medium">Guest User</p>
                            <p className="text-xs text-muted-foreground">Free Plan</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start gap-2 text-muted-foreground">
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Mobile Header Placeholder */}
                <header className="md:hidden flex items-center p-4 border-b bg-card gap-2">
                    <img src="/logo.png" alt="Huddle Logo" className="w-10 h-10 object-contain" />
                </header>
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function SidebarItem({ icon: Icon, label, href, active }: { icon: any, label: string, href: string, active: boolean }) {
    return (
        <Link href={href}>
            <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}>
                <Icon className={cn("w-5 h-5", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {label}
            </div>
        </Link>
    )
}
