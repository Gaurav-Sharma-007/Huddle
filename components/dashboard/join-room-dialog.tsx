"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

export function JoinRoomDialog({ children }: { children: React.ReactNode }) {
    const [roomId, setRoomId] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode") || "work";
    const [open, setOpen] = useState(false);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomId.trim()) {
            setOpen(false);
            router.push(`/room/${roomId.trim()}?mode=${mode}`);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Join a Meeting</DialogTitle>
                    <DialogDescription>
                        Enter the room code or link securely shared with you.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleJoin} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="roomId" className="text-right">
                            Room ID
                        </Label>
                        <Input
                            id="roomId"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g. daily-standup"
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Join Room</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
