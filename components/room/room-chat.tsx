"use client";

import { useChat } from "@livekit/components-react";
import { useCallback, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send, Smile, X, File as FileIcon } from "lucide-react";
import EmojiPicker from 'emoji-picker-react';
import { cn } from "@/lib/utils";

export function RoomChat() {
    // LiveKit Chat Hook
    const { send, chatMessages, isSending } = useChat();
    const [message, setMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // If file is attached, handle it (Mock for now or DataChannel if small)
        if (attachedFile) {
            // Ideally: Upload to server -> get URL -> send URL
            // For now: Just sending filename as a placeholder feature demonstration
            await send(`[FILE] ${attachedFile.name} (${(attachedFile.size / 1024).toFixed(1)} KB)`);
            setAttachedFile(null);
        }

        if (!message.trim()) return;
        await send(message);
        setMessage("");
        setShowEmoji(false);
    };

    const handleEmojiClick = (emojiData: any) => {
        setMessage((prev) => prev + emojiData.emoji);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachedFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/95 text-white">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {chatMessages.map((msg) => {
                        const isMe = msg.from?.isLocal;
                        return (
                            <div key={msg.timestamp} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                                <div className="text-xs text-white/50 mb-1 flex items-center gap-2">
                                    <span className="font-bold">{msg.from?.identity || "Unknown"}</span>
                                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div
                                    className={cn(
                                        "px-3 py-2 rounded-xl text-sm max-w-[85%]",
                                        isMe ? "bg-primary text-white" : "bg-white/10 text-white"
                                    )}
                                >
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-3 border-t border-white/10 bg-black/50 backdrop-blur-md relative">

                {/* Emoji Picker Popover */}
                {showEmoji && (
                    <div className="absolute bottom-16 left-0 z-50">
                        <div className="fixed inset-0 z-40" onClick={() => setShowEmoji(false)} /> {/* Backdrop to close */}
                        <div className="relative z-50">
                            <EmojiPicker onEmojiClick={handleEmojiClick} theme={"dark" as any} width={300} height={400} />
                        </div>
                    </div>
                )}

                {/* File Attachment Preview */}
                {attachedFile && (
                    <div className="flex items-center gap-2 bg-white/10 p-2 rounded-md mb-2">
                        <FileIcon className="h-4 w-4 text-primary" />
                        <span className="text-xs truncate max-w-[200px]">{attachedFile.name}</span>
                        <Button variant="ghost" size="icon" className="h-4 w-4 ml-auto" onClick={() => setAttachedFile(null)}>
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                )}

                <form onSubmit={onSubmit} className="flex gap-2 items-end">
                    {/* File Button */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="h-5 w-5" />
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                    </Button>

                    {/* Emoji Button */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn("text-white/70 hover:text-white", showEmoji && "text-primary")}
                        onClick={() => setShowEmoji(!showEmoji)}
                    >
                        <Smile className="h-5 w-5" />
                    </Button>

                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 border-white/10 focus-visible:ring-primary h-10"
                    />

                    <Button type="submit" size="icon" disabled={!message.trim() && !attachedFile} className="h-10 w-10">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
