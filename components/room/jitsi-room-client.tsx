"use client";

import { JitsiMeeting } from "@jitsi/react-sdk";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SubtitleFinder } from "@/components/room/subtitle-finder";
import { useState, useEffect } from "react";

export default function JitsiRoomClient({ room, username }: { room: string, username: string }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const mode = searchParams.get("mode") || "work";
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="p-10 text-center">Loading Meeting...</div>;

    const jitsiConfig = {
        roomName: `Huddle-${room}`, // Prefix to avoid collisions on public servers
        displayName: username,
        configOverwrite: {
            startWithAudioMuted: true,
            disableDeepLinking: true,
            remoteVideoMenu: {
                disableKick: true,
            },
        },
        interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                'videoquality', 'filmstrip', 'tileview', 'videobackgroundblur',
                'download', 'help', 'mute-everyone', 'security'
            ],
        },
    };

    if (mode === "work") {
        return (
            <div className="h-screen w-full bg-black">
                <JitsiMeeting
                    domain="meet.jit.si"
                    roomName={jitsiConfig.roomName}
                    configOverwrite={jitsiConfig.configOverwrite}
                    interfaceConfigOverwrite={jitsiConfig.interfaceConfigOverwrite}
                    userInfo={{
                        displayName: username,
                        email: ""
                    }}
                    onApiReady={(externalApi) => {
                        // externalApi.executeCommand('toggleAudio');
                    }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = '100%';
                    }}
                />
            </div>
        );
    }

    // Play Mode
    return (
        <div className="flex h-screen bg-black overflow-hidden relative">
            {/* Main Stage (Theater) */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-0">
                <div className="text-white flex flex-col items-center p-8 bg-card/10 rounded-xl backdrop-blur-sm border border-white/10">
                    <h2 className="text-2xl font-bold mb-2">Theater Mode</h2>
                    <p className="text-gray-400 mb-6">Media Player Integration Coming Soon</p>
                    <div className="flex gap-3">
                        <Button variant="secondary">Select Media</Button>
                        <SubtitleFinder />
                    </div>
                </div>

                {/* Back Button Overlay */}
                <div className="absolute top-4 left-4">
                    <Button variant="ghost" className="text-white/50 hover:text-white" onClick={() => router.push("/dashboard")}>
                        &larr; Back
                    </Button>
                </div>
            </div>

            {/* Sidebar Jitsi (Communication) */}
            <div className="w-[350px] border-l border-white/10 bg-black flex flex-col h-full z-10 shadow-2xl relative">
                <JitsiMeeting
                    domain="meet.jit.si"
                    roomName={jitsiConfig.roomName}
                    configOverwrite={{
                        ...jitsiConfig.configOverwrite,
                        enableWelcomePage: false,
                        prejoinPageEnabled: false, // Skip prejoin for sidebar efficiency? Or keep it? keeping for permissions.
                        disable1On1Mode: true, // Force conference UI
                        filmStripOnly: false,
                    }}
                    interfaceConfigOverwrite={{
                        ...jitsiConfig.interfaceConfigOverwrite,
                        // Reduced toolbar for sidebar
                        TOOLBAR_BUTTONS: [
                            'microphone', 'camera', 'chat', 'raisehand', 'hangup', 'tileview'
                        ],
                        filmStripOnly: false,
                    }}
                    userInfo={{
                        displayName: username,
                        email: ""
                    }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = '100%';
                    }}
                />
            </div>
        </div>
    );
}
