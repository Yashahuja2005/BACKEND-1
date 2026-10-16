import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import app_config from "../config/config.js";
import { ChatCohere } from "@langchain/cohere";

export const geminiModel = new ChatGoogle({
    model: "gemini-3.6-flash",
    apiKey: app_config.GOOGLE_API_KEY,
})

export const mistralModel = new ChatMistralAI({
    model: "codestral-latest",
    apiKey: app_config.MISTRAL_API_KEY
})

export const cohereModel = new ChatCohere({
    model: "command-r-08-2024",
    apiKey: app_config.COHERE_API_KEY
})