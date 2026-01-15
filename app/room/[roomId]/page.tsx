
import RoomClient from "@/components/room/room-client";

export async function generateStaticParams() {
    return [
        { roomId: 'test-room' },
        { roomId: 'demo' },
    ];
}

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = await params;
    // In a real app, getUser() from session
    const mockUsername = "User-" + Math.floor(Math.random() * 1000);

    return <RoomClient room={roomId} username={mockUsername} />;
}
