import {createSlice} from "@reduxjs/toolkit"

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error:null
    },
    reducers: {
        createNewChat: (state, action) => {
            const {chatId, title} = action.payload
            state.chats[chatId] = state.chats[chatId]
                ? { ...state.chats[chatId], title }
                : { id: chatId, title, messages: [], lastUpdated: new Date().toISOString() }
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role, id, requestId, attachment } = action.payload
            if (!state.chats[chatId]) {
                state.chats[chatId] = { id: chatId, title: "New chat", messages: [], lastUpdated: new Date().toISOString() }
            }
            state.chats[chatId].messages.push({ content, role, id, requestId, attachment })
            state.chats[chatId].lastUpdated = new Date().toISOString()
        },
        appendMessageChunk: (state, action) => {
            const { chatId, requestId, content } = action.payload
            const message = state.chats[chatId]?.messages.find((item) => item.requestId === requestId)
            if (message) message.content += content
        },
        setMessageContent: (state, action) => {
            const { chatId, requestId, content } = action.payload
            const message = state.chats[chatId]?.messages.find((item) => item.requestId === requestId)
            if (message) message.content = content
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            state.chats[ chatId ].messages.push(...messages)
        },
        setChats: (state, action) => {
            state.chats = { ...action.payload, ...state.chats }
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
    }
})

export const {setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages, appendMessageChunk, setMessageContent} = chatSlice.actions
export default chatSlice.reducer