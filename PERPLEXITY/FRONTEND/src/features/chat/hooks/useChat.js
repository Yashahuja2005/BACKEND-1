import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
    addMessages,
    addNewMessage,
    appendMessageChunk,
    createNewChat,
    setChats,
    setCurrentChatId,
    setError,
    setLoading,
    setMessageContent,
} from "../chat.slice.js";
import { getChats, getMessages } from "../service/chat.api.js";
import { initializeSocketConnection } from "../service/chat.socket.js";

export function useChat() {
    const dispatch = useDispatch();
    const socketRef = useRef(null);
    const pendingChats = useRef(new Map());

    useEffect(() => {
        const socket = initializeSocketConnection();
        socketRef.current = socket;

        socket.on("chat:started", ({ requestId, chat, userMessage }) => {
            pendingChats.current.set(requestId, chat.id);
            dispatch(createNewChat({ chatId: chat.id, title: chat.title }));
            dispatch(addNewMessage({ chatId: chat.id, ...userMessage }));
            dispatch(addNewMessage({ chatId: chat.id, content: "", role: "ai", requestId }));
            dispatch(setCurrentChatId(chat.id));
        });
        socket.on("chat:chunk", (chunk) => dispatch(appendMessageChunk(chunk)));
        socket.on("chat:complete", ({ requestId, chatId, aiMessage }) => {
            dispatch(setMessageContent({ chatId, requestId, content: aiMessage.content }));
            pendingChats.current.delete(requestId);
            dispatch(setLoading(false));
        });
        socket.on("chat:error", ({ requestId, message }) => {
            const chatId = pendingChats.current.get(requestId);
            if (chatId) {
                dispatch(setMessageContent({
                    chatId,
                    requestId,
                    content: `I couldn't finish that request. ${message}`,
                }));
                pendingChats.current.delete(requestId);
            }
            dispatch(setError(message));
            dispatch(setLoading(false));
        });
        socket.on("connect_error", () => {
            dispatch(setError("Could not connect to Auralis. Check that the backend is running and you are signed in."));
            dispatch(setLoading(false));
        });

        getChats()
            .then(({ chats }) => dispatch(setChats(chats.reduce((result, chat) => {
                result[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                };
                return result;
            }, {}))))
            .catch(() => dispatch(setError("Your conversations could not be loaded.")));

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
            socketRef.current = null;
        };
    }, [dispatch]);

    function handleSendMessage({ message, chatId, search, attachment }) {
        const requestId = crypto.randomUUID();
        dispatch(setError(null));
        dispatch(setLoading(true));
        socketRef.current?.emit("chat:send", { requestId, message, chatId, search, attachment });
    }

    async function handleOpenChat(chatId, chats) {
        if (!chats[chatId]) return;
        try {
            if (chats[chatId].messages.length === 0) {
                const { messages } = await getMessages(chatId);
                dispatch(addMessages({
                    chatId,
                    messages: messages.map((message) => ({
                        id: message._id,
                        content: message.content,
                        role: message.role,
                        attachment: message.attachment,
                    })),
                }));
            }
            dispatch(setCurrentChatId(chatId));
            dispatch(setError(null));
        } catch {
            dispatch(setError("This conversation could not be loaded."));
        }
    }

    return { handleSendMessage, handleOpenChat };
}