"use client";

import { useState } from "react";
import { Search, Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Subtitle {
    id: string;
    filename: string;
    lang: string;
    url: string;
}

export function SubtitleFinder() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Subtitle[]>([]);

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/subtitles?query=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data.role === "error" ? [] : data.subtitles || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="gap-2">
                <FileText className="w-4 h-4" />
                Find Subtitles
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md p-6 rounded-xl border border-border shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">AI Subtitle Finder</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>×</Button>
                </div>

                <div className="flex gap-2">
                    <input
                        className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Movie or Show Name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                </div>

                <div className="min-h-[200px] max-h-[300px] overflow-y-auto space-y-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <span className="text-xs">AI Agent is scanning the web...</span>
                        </div>
                    ) : results.length > 0 ? (
                        results.map((sub) => (
                            <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium truncate">{sub.filename}</p>
                                    <p className="text-xs text-muted-foreground uppercase">{sub.lang}</p>
                                </div>
                                <Button size="icon" variant="ghost" onClick={() => alert(`Applied: ${sub.filename}`)}>
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
                            <Search className="w-8 h-8 mb-2 opacity-50" />
                            <p>Enter a title to search for subtitles.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
