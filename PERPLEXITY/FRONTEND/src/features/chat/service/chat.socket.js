import { io } from "socket.io-client";

export function initializeSocketConnection() {
    return io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
        withCredentials: true,
        transports: ["websocket", "polling"],
    });
}