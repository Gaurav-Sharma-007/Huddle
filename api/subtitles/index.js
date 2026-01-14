module.exports = async function (context, req) {
    const query = req.query.query;

    // Simulate AI Agent processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!query) {
        context.res = {
            status: 400,
            body: { error: "Query required" }
        };
        return;
    }

    // Mock Results
    const mockResults = [
        { id: "1", filename: `${query}.1080p.BluRay.x264-SPARKS.english.srt`, lang: "en", url: "#" },
        { id: "2", filename: `${query}.WEBRip.x264-ION10.english.srt`, lang: "en", url: "#" },
        { id: "3", filename: `${query}.HDRip.XviD.AC3-EVO.spanish.srt`, lang: "es", url: "#" },
        { id: "4", filename: `${query}.french.srt`, lang: "fr", url: "#" },
    ];

    context.res = {
        body: {
            subtitles: mockResults,
            agentStatus: "Scanned 4 providers successfully."
        }
    };
};