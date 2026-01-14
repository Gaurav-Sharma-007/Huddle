import { useEffect, useState, useRef } from 'react';

export interface TranscriptLine {
    id: string;
    speaker: string;
    text: string;
    timestamp: number;
    isFinal: boolean;
}

export function useTranscription(username: string) {
    const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const isListeningRef = useRef(false); // Ref for sync access

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                        addTranscriptLine(username, finalTranscript, true);
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    isListeningRef.current = false;
                    setIsListening(false);
                }
            };

            recognition.onend = () => {
                // Sync state when it stops (e.g. timeout or manual stop)
                isListeningRef.current = false;
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        } else {
            console.warn("Web Speech API not supported in this browser.");
            // Fallback or mock for demo if needed
            const mockInterval = setInterval(() => {
                if (Math.random() > 0.9) {
                    addTranscriptLine("Mock User", "This is a simulated remote user speaking.", true);
                }
            }, 5000);
            return () => clearInterval(mockInterval);
        }
    }, [username]);

    const addTranscriptLine = (speaker: string, text: string, isFinal: boolean) => {
        const id = Date.now().toString() + Math.random();
        setTranscript(prev => {
            // Logic to merge interim results could go here, for now just append final
            if (!text.trim()) return prev;
            return [...prev, { id, speaker, text, timestamp: Date.now(), isFinal }];
        });
    };

    const startListening = () => {
        if (recognitionRef.current && !isListeningRef.current) {
            try {
                recognitionRef.current.start();
                isListeningRef.current = true;
                setIsListening(true);
            } catch (e) {
                console.error("Start listening error:", e);
                // If it says already started, we can just sync our state
                isListeningRef.current = true;
                setIsListening(true);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            isListeningRef.current = false;
            setIsListening(false);
        }
    };

    return { transcript, isListening, startListening, stopListening };
}
