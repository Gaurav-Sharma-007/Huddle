"use client";

import { LiveKitRoom, VideoConference, GridLayout, ParticipantTile, RoomAudioRenderer, ControlBar, useTracks, Chat } from "@livekit/components-react";
import { RoomEvent, Track } from "livekit-client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "@livekit/components-styles";
import { Button } from "@/components/ui/button";
import { SubtitleFinder } from "@/components/room/subtitle-finder";

import { TranscriptSidebar } from "@/components/room/transcript-sidebar";
import { useTranscription } from "@/hooks/use-transcription";
import { MeetingSummaryModal } from "@/components/room/meeting-summary-modal";
import { RoomChat } from "@/components/room/room-chat";

function RoomClientContent({ room, username }: { room: string, username: string }) {
    const [token, setToken] = useState("");
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode") || "work";
    const router = useRouter();
    const { transcript, isListening, startListening, stopListening } = useTranscription(username + " (You)");
    const [showSummary, setShowSummary] = useState(false);
    const [isChatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        // Start listening automatically in work mode
        if (mode === "work" && !isListening) {
            // Small timeout to allow user interaction requirement (though usually needs click)
            // For better UX, we might want a manual toggle, but auto-start is requested implicitly
            // We'll add a manual toggle button in the UI as well
            setTimeout(() => startListening(), 1000);
        }
        return () => { stopListening() }
    }, [mode, isListening, startListening, stopListening]);

    const handleDisconnect = () => {
        if (mode === "work" && transcript.length > 0) {
            setShowSummary(true);
        } else {
            router.push("/dashboard");
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch(`/api/token?room=${room}&username=${username}`);
                const data = await resp.json();
                if (data.token) {
                    setToken(data.token);
                } else {
                    console.error("Token fetch error:", data.error);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [room, username]);

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Connecting to Secure Room...</p>
                <p className="text-xs text-red-500 max-w-xs text-center">
                    Note: If this spins forever, the server might be missing LIVEKIT_API_KEY env vars.
                </p>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>Cancel</Button>
            </div>
        );
    }

    return (
        <>
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                data-lk-theme="default"
                style={{ height: "100vh" }}
                onDisconnected={handleDisconnect}
            >
                {mode === "work" ? (
                    // Work Mode: Video Conference + Transcript
                    <div className="flex h-full">
                        <div className="flex-1 flex flex-col">
                            <VideoConference />
                        </div>
                        {/* Transcript Sidebar */}
                        <div className="w-80 border-l border-border bg-background hidden md:block">
                            <TranscriptSidebar transcript={transcript} />
                        </div>
                    </div>
                ) : (
                    // Play Mode: Custom Layout
                    <div className="flex h-full relative overflow-hidden">
                        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                            {/* Top Bar / Stage */}
                            <PlayModeStage />
                            {/* Participants Bar (Bottom) */}
                            <div className="h-32 bg-background/80 backdrop-blur-sm border-t border-white/10 p-2 z-10">
                                <SimpleParticipantBar />
                            </div>

                            {/* Custom Control Bar Wrapper to add Chat Toggle */}
                            <div className="flex items-center justify-center gap-4 py-2 bg-black/90 border-t border-white/10 z-20">
                                <ControlBar variation="minimal" />
                                <div className="h-8 w-px bg-white/10 mx-2" />
                                <Button
                                    size="icon"
                                    variant={isChatOpen ? "secondary" : "ghost"}
                                    onClick={() => setChatOpen(!isChatOpen)}
                                    className="rounded-full h-10 w-10"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Chat Sidebar (Right) - Slide In */}
                        <div
                            className={cn(
                                "border-l border-white/10 bg-black/95 backdrop-blur-xl absolute right-0 top-0 h-full z-30 transition-all duration-300 ease-in-out shadow-2xl",
                                isChatOpen ? "translate-x-0 w-80 opacity-100" : "translate-x-full w-0 opacity-0 overflow-hidden"
                            )}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <h3 className="font-semibold text-white">Chat</h3>
                                <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)} className="h-6 w-6 text-white/50 hover:text-white">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="h-[calc(100%-60px)]">
                                <RoomChat />
                            </div>
                        </div>
                    </div>
                )}
                <RoomAudioRenderer />
            </LiveKitRoom>

            <RoomInfoOverlay room={room} />

            <MeetingSummaryModal
                isOpen={showSummary}
                onClose={() => router.push("/dashboard")}
                transcript={transcript}
            />
        </>
    );
}

export default function RoomClient(props: { room: string, username: string }) {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Room...</div>}>
            <RoomClientContent {...props} />
        </Suspense>
    )
}

function SimpleParticipantBar() {
    // Custom track usage for custom layout
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );

    return (
        <div className="flex gap-2 h-full overflow-x-auto">
            {tracks.map((track) => (
                <ParticipantTile
                    // Use identity + source for stable keys. TrackSid might change or be undefined initially.
                    key={`${track.participant.identity}-${track.source}`}
                    trackRef={track}
                    className="w-48 h-full aspect-video"
                />
            ))}
        </div>
    )
}

function PlayModeStage() {
    // Priority 1: Screen Shares
    const screenTracks = useTracks([Track.Source.ScreenShare], { onlySubscribed: false });

    // Priority 2: Video Tracks (for fallback)
    const videoTracks = useTracks([Track.Source.Camera], { onlySubscribed: false });

    // Logic: 
    // 1. If Screen Share -> Show it (Max Size)
    // 2. If No Media & Only 1 User (or just 1 video track) -> Show that user
    // 3. Fallback -> Show Media Placeholder

    const mainTrack = screenTracks[0] || (videoTracks.length === 1 ? videoTracks[0] : null);

    if (mainTrack) {
        return (
            <div className="w-full flex-1 min-h-0 p-2 bg-black flex items-center justify-center">
                <ParticipantTile
                    trackRef={mainTrack}
                    className="w-full h-full max-w-5xl aspect-video object-contain shadow-2xl"
                    disableSpeakingIndicator={true}
                />
            </div>
        )
    }

    return (
        <div className="flex-1 min-h-0 bg-black relative flex items-center justify-center">
            {/* Media Player Placeholder */}
            <div className="text-white flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-2">Theater Mode</h2>
                <p className="text-gray-400">Media Player Integration Coming Soon</p>
                <div className="mt-4 flex gap-2">
                    <Button variant="secondary">Select Media</Button>
                    <SubtitleFinder />
                </div>
            </div>
        </div>
    )
}

import { Copy, Check, Link as LinkIcon, MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";

function RoomInfoOverlay({ room }: { room: string }) {
    const [copied, setCopied] = useState<"code" | "link" | null>(null);

    const copyLink = () => {
        const url = `${window.location.origin}/room/${room}`;
        navigator.clipboard.writeText(url);
        setCopied("link");
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="fixed top-4 left-4 z-[50] glass-panel p-2 rounded-lg flex items-center gap-3 shadow-lg border border-white/10 bg-black/40 backdrop-blur-md text-white">
            <div className="flex flex-col">
                <span className="text-[10px] uppercase text-white/50 font-bold tracking-wider">Room Code</span>
                <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm">{room}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-white/50 hover:text-white"
                        onClick={() => {
                            navigator.clipboard.writeText(room);
                            setCopied("code");
                            setTimeout(() => setCopied(null), 2000);
                        }}
                        title="Copy Room Code"
                    >
                        {copied === "code" ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                    </Button>
                </div>
            </div>
            <div className="h-8 w-px bg-white/10 mx-1"></div>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-white hover:bg-white/10 hover:text-white"
                onClick={copyLink}
            >
                {copied === "link" ? <Check className="h-4 w-4 mr-2 text-green-400" /> : <LinkIcon className="h-4 w-4 mr-2" />}
                {copied === "link" ? "Copied" : "Copy Link"}
            </Button>
        </div>
    );
}
