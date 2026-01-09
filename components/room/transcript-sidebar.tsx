"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { TranscriptLine } from "@/hooks/use-transcription";
import { format } from "date-fns";
import { FileText } from "lucide-react";

export function TranscriptSidebar({ transcript }: { transcript: TranscriptLine[] }) {
    if (transcript.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                <FileText className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Meeting transcript will appear here...</p>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-l border-border">
            <div className="p-4 border-b border-border bg-card/50">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Live Transcript
                </h3>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {transcript.map((line) => (
                        <div key={line.id} className="flex flex-col space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className={`font-medium ${line.speaker === "You" ? "text-primary" : ""}`}>
                                    {line.speaker}
                                </span>
                                <span>{format(line.timestamp, "HH:mm")}</span>
                            </div>
                            <p className="text-sm leading-relaxed">{line.text}</p>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
