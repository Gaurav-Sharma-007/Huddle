const { AccessToken } = require('livekit-server-sdk');

module.exports = async function (context, req) {
    const room = req.query.room;
    const username = req.query.username;

    if (!room) {
        context.res = {
            status: 400,
            body: { error: 'Missing "room" query parameter' }
        };
        return;
    } else if (!username) {
        context.res = {
            status: 400,
            body: { error: 'Missing "username" query parameter' }
        };
        return;
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
        context.res = {
            status: 500,
            body: { error: "Server misconfigured" }
        };
        return;
    }

    const at = new AccessToken(apiKey, apiSecret, { identity: username });

    at.addGrant({ roomJoin: true, room: room, canPublish: true, canSubscribe: true });

    const token = await at.toJwt();

    context.res = {
        body: { token: token }
    };
};