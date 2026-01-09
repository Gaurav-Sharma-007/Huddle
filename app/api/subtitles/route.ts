
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("query");

    // Simulate AI Agent processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!query) {
        return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    // Mock Results
    const mockResults = [
        { id: "1", filename: `${query}.1080p.BluRay.x264-SPARKS.english.srt`, lang: "en", url: "#" },
        { id: "2", filename: `${query}.WEBRip.x264-ION10.english.srt`, lang: "en", url: "#" },
        { id: "3", filename: `${query}.HDRip.XviD.AC3-EVO.spanish.srt`, lang: "es", url: "#" },
        { id: "4", filename: `${query}.french.srt`, lang: "fr", url: "#" },
    ];

    return NextResponse.json({
        subtitles: mockResults,
        agentStatus: "Scanned 4 providers successfully."
    });
}
