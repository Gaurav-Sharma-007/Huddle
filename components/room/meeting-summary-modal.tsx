"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TranscriptLine } from "@/hooks/use-transcription";
import { Download, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

interface MeetingSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    transcript: TranscriptLine[];
}

export function MeetingSummaryModal({ isOpen, onClose, transcript }: MeetingSummaryModalProps) {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);

    const handleGenerateSummary = async () => {
        setLoading(true);
        // Simulate AI delay
        await new Promise(r => setTimeout(r, 2000));

        const mockSummary = `
### Meeting Minutes

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** You + Remote Participants

**Key Discussion Points:**
1. Initial introductions and webcam check.
2. Discussion about project timelines for Q1.
3. Reviewed the latest design mockups for the new landing page.

**Action Items:**
- [ ] Send the updated slide deck by EOD.
- [ ] Schedule a follow-up meeting for next Tuesday.
        `;
        setSummary(mockSummary);
        setLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        Meeting Scribe
                    </DialogTitle>
                    <DialogDescription>
                        Generate an AI summary of your conversation.
                    </DialogDescription>
                </DialogHeader>

                {!summary ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 rounded-full bg-indigo-500/10">
                            <Sparkles className="w-8 h-8 text-indigo-500" />
                        </div>
                        <div>
                            <p className="font-medium">Ready to summarize?</p>
                            <p className="text-sm text-muted-foreground">
                                {transcript.length} lines of conversation recorded.
                            </p>
                        </div>
                    </div>
                ) : (
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-muted/50">
                        <pre className="whitespace-pre-wrap font-sans text-sm">{summary}</pre>
                    </ScrollArea>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    {!summary ? (
                        <Button onClick={handleGenerateSummary} disabled={loading || transcript.length === 0} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                            Generate Summary
                        </Button>
                    ) : (
                        <Button className="gap-2">
                            <Download className="w-4 h-4" />
                            Save to Dashboard
                        </Button>
                    )}

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
