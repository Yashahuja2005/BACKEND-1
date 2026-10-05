import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { streamResponse } from "../services/ai.service.js";

function makeTitle(message) {
    const title = message.replace(/\s+/g, " ").trim();
    return title.length > 42 ? `${title.slice(0, 39)}...` : title || "New chat";
}

export function registerChatSocket(socket) {
    socket.on("chat:send", async (payload = {}) => {
        const requestId = payload.requestId;

        try {
            const message = typeof payload.message === "string" ? payload.message.trim() : "";
            const attachment = payload.attachment;
            if (!message && !attachment?.text) throw new Error("Write a message or attach a text file first.");
            if (message.length > 8000) throw new Error("Messages must be under 8,000 characters.");
            if (attachment && (typeof attachment.text !== "string" || attachment.text.length > 12000)) {
                throw new Error("Attachments must contain less than 12,000 characters of text.");
            }

            let chat;
            if (payload.chatId) {
                chat = await chatModel.findOne({ _id: payload.chatId, user: socket.data.userId });
                if (!chat) throw new Error("That conversation could not be found.");
            } else {
                chat = await chatModel.create({
                    user: socket.data.userId,
                    title: makeTitle(message || attachment.name),
                });
            }

            const userMessage = await messageModel.create({
                chat: chat._id,
                content: message || `Please review the attached file: ${attachment.name}`,
                role: "user",
                ...(attachment ? { attachment: { name: attachment.name, text: attachment.text } } : {}),
            });

            socket.emit("chat:started", {
                requestId,
                chat: { id: chat._id.toString(), title: chat.title, lastUpdated: chat.updatedAt },
                userMessage: {
                    id: userMessage._id.toString(),
                    content: userMessage.content,
                    role: userMessage.role,
                    attachment: userMessage.attachment,
                },
            });

            const history = await messageModel.find({ chat: chat._id }).sort({ createdAt: 1 }).lean();
            const responseParts = [];
            for await (const chunk of streamResponse(history, {
                search: payload.search === true,
                attachment: attachment ? { name: attachment.name, text: attachment.text } : undefined,
            })) {
                responseParts.push(chunk);
                socket.emit("chat:chunk", { requestId, chatId: chat._id.toString(), content: chunk });
            }

            const aiMessage = await messageModel.create({
                chat: chat._id,
                content: responseParts.join(""),
                role: "ai",
            });

            socket.emit("chat:complete", {
                requestId,
                chatId: chat._id.toString(),
                aiMessage: { id: aiMessage._id.toString(), content: aiMessage.content, role: aiMessage.role },
            });
        } catch (error) {
            socket.emit("chat:error", {
                requestId,
                message: error.message || "Auralis could not complete that request.",
            });
        }
    });
}