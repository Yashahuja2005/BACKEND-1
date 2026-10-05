import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, HumanMessage, SystemMessage } from "langchain";
import { searchInternet } from "./internet.service.js";

function getModel() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("Configure GEMINI_API_KEY to use Auralis.");

    return new ChatGoogleGenerativeAI({
        model: "gemini-3.5-flash",
        apiKey,
        maxRetries: 1,
    });
}

export async function* streamResponse(messages, { search = false, attachment } = {}) {
    const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");
    let systemPrompt = "You are Auralis, a thoughtful, precise AI assistant. Be useful, clear, and honest about uncertainty. Use Markdown when it improves readability.";

    if (search && latestUserMessage) {
        const results = await searchInternet({ query: latestUserMessage.content });
        const sources = (results.results || []).map((result) =>
            `- ${result.title}: ${result.url}\n  ${result.content}`
        ).join("\n");
        systemPrompt += `\n\nUse these current web search results to answer, and cite relevant sources with Markdown links.\n${sources}`;
    }

    if (attachment?.text) {
        systemPrompt += `\n\nThe user attached a file named "${attachment.name}". Use its contents as reference material when relevant.\n<file>\n${attachment.text}\n</file>`;
    }

    const promptMessages = [
        new SystemMessage(systemPrompt),
        ...messages.map((message) => new (message.role === "user" ? HumanMessage : AIMessage)(message.content)),
    ];

    const model = getModel();
    for await (const chunk of await model.stream(promptMessages)) {
        const content = chunk.content;
        const text = typeof content === "string"
            ? content
            : Array.isArray(content)
                ? content.map((part) => typeof part === "string" ? part : part.text || "").join("")
                : "";
        if (text) yield text;
    }
}

export async function generateResponse(messages) {
    let response = "";
    for await (const chunk of streamResponse(messages)) response += chunk;
    return response;
}

export function generateChatTitle(message) {
    const title = message.replace(/\s+/g, " ").trim();
    return title.length > 42 ? `${title.slice(0, 39)}...` : title || "New chat";
}
