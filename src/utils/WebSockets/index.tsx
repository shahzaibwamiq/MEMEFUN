import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (token?: string): Socket => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

    if (socket) {
        socket.disconnect();
        socket = null;
    }

    socket = io(backendUrl, {
        path: "/socket.io",
        transports: ['websocket', 'polling'],
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
    });

    socket.on("connect", () => console.log("connected", socket?.id, token ? "(auth)" : "(guest)"));
    socket.on("disconnect", () => console.warn("disconnected"));
    socket.on("connect_error", (err) => console.error("WebSocket error:", err));

    socket.on("reconnect_attempt", (attempt) => console.log(`Reconnect attempt ${attempt}`));
    socket.on("reconnect_failed", () => console.warn("Reconnection failed!"));
    socket.on("reconnect", (attempt) => console.log(`Reconnected on attempt ${attempt}`));


    return socket;
};

export const getSocket = (): Socket | null => socket;
