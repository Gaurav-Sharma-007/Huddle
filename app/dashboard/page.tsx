"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Copy, Monitor, PlayCircle, Plus, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { JoinRoomDialog } from "@/components/dashboard/join-room-dialog";

function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const mode = searchParams.get("mode") as "work" | "play" | null;

    const handleCreateRoom = () => {
        // Generate random ID for now
        const roomId = Math.random().toString(36).substring(7);
        router.push(`/room/${roomId}?mode=${mode || "work"}`);
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">
                    {mode === "play" ? "Entertainment Center" : mode === "work" ? "Workspace" : "Dashboard"}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {mode === "play" ? "Watch movies and listen to music with friends." : "Professional video conferencing for teams."}
                </p>
            </header>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ActionCard
                    title="New Meeting"
                    desc="Start an instant call"
                    icon={Video}
                    color="text-indigo-500"
                    bg="bg-indigo-500/10"
                    onClick={handleCreateRoom}
                />
                <JoinRoomDialog>
                    <div className="h-full"> {/* Wrapper to pass ref if needed, or just strict children */}
                        <ActionCard
                            title="Join Room"
                            desc="Enter code or link"
                            icon={Users}
                            color="text-purple-500"
                            bg="bg-purple-500/10"
                            onClick={() => { }} // Logic handled by DialogTrigger
                        />
                    </div>
                </JoinRoomDialog>
                {mode === "play" && (
                    <ActionCard
                        title="Browse Media"
                        desc="Find content to watch"
                        icon={PlayCircle}
                        color="text-pink-500"
                        bg="bg-pink-500/10"
                        onClick={() => { }}
                    />
                )}
                {mode === "work" && (
                    <ActionCard
                        title="Schedule"
                        desc="Plan for later"
                        icon={Copy}
                        color="text-blue-500"
                        bg="bg-blue-500/10"
                        onClick={() => { }}
                    />
                )}
            </div>

            {/* Recent Rooms (Mock) */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
                <div className="border border-border rounded-xl bg-card overflow-hidden">
                    <div className="p-4 border-b border-border text-xs font-medium text-muted-foreground grid grid-cols-4">
                        <div className="col-span-2">NAME</div>
                        <div>DATE</div>
                        <div className="text-right">DURATION</div>
                    </div>
                    {/* Empty State */}
                    <div className="p-8 text-center text-muted-foreground">
                        No recent activity found. Start a room to get going!
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    )
}

function ActionCard({ title, desc, icon: Icon, color, bg, onClick }: any) {
    return (
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <div
                onClick={onClick}
                className="p-6 rounded-xl border border-border bg-card hover:bg-accent/50 cursor-pointer transition-all shadow-sm hover:shadow-md flex items-start gap-4"
            >
                <div className={`p-3 rounded-lg ${bg} ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <div className="ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-5 h-5 text-muted-foreground" />
                </div>
            </div>
        </motion.div>
    )
}
