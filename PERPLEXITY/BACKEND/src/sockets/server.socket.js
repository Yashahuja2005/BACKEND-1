import {Server} from 'socket.io';
import jwt from 'jsonwebtoken';
import { registerChatSocket } from './chat.socket.js';

let io;

export function initServer(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        },
        maxHttpBufferSize: 2e6
    });

    io.use((socket, next) => {
        const cookieHeader = socket.handshake.headers.cookie || '';
        const token = cookieHeader
            .split('; ')
            .find((cookie) => cookie.startsWith('token='))
            ?.slice('token='.length);

        if (!token) return next(new Error('Authentication required'));

        try {
            const decoded = jwt.verify(decodeURIComponent(token), process.env.JWT_SECRET);
            socket.data.userId = decoded.id;
            next();
        } catch {
            next(new Error('Invalid authentication token'));
        }
    });

    io.on('connection', (socket) => {
        registerChatSocket(socket);
    });

    console.log("Socket.io server is running");
}

export function getIO(){
    if (!io) {
        throw new Error('Socket.io server not initialized');
    }
    return io;
}