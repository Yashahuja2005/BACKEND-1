import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDispatch, useSelector } from "react-redux";
import {
    ArrowUp,
    Check,
    FileText,
    Globe2,
    Menu,
    MessageSquare,
    Paperclip,
    Plus,
    Search,
    Sparkles,
    X,
} from "lucide-react";
import { setCurrentChatId } from "../chat.slice.js";
import { useChat } from "../hooks/useChat.js";

const suggestions = [
    "Explain a complex idea simply",
    "Help me plan a focused week",
    "What should I know today?",
];

export default function Dashboard() {
    const chat = useChat();
    const dispatch = useDispatch();
    const [chatInput, setChatInput] = useState("");
    const [searchEnabled, setSearchEnabled] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const [attachmentError, setAttachmentError] = useState("");
    const [filter, setFilter] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const fileInputRef = useRef(null);
    const endRef = useRef(null);
    const chats = useSelector((state) => state.chat.chats);
    const currentChatId = useSelector((state) => state.chat.currentChatId);
    const isLoading = useSelector((state) => state.chat.isLoading);
    const error = useSelector((state) => state.chat.error);
    const user = useSelector((state) => state.auth.user);
    const messages = chats[currentChatId]?.messages || [];
    const latestMessageContent = messages[messages.length - 1]?.content;
    const visibleChats = Object.values(chats)
        .filter((item) => item.title.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages.length, latestMessageContent]);

    useEffect(() => {
        function handleShortcut(event) {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                dispatch(setCurrentChatId(null));
                setChatInput("");
                setAttachment(null);
                setSearchEnabled(false);
                setSidebarOpen(false);
            }
        }
        window.addEventListener("keydown", handleShortcut);
        return () => window.removeEventListener("keydown", handleShortcut);
    }, [dispatch]);

    function startNewChat() {
        dispatch(setCurrentChatId(null));
        setChatInput("");
        setAttachment(null);
        setSearchEnabled(false);
        setSidebarOpen(false);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const message = chatInput.trim();
        if ((!message && !attachment) || isLoading) return;

        chat.handleSendMessage({
            message,
            chatId: currentChatId,
            search: searchEnabled,
            attachment,
        });
        setChatInput("");
        setAttachment(null);
        setAttachmentError("");
    }

    async function handleFileChange(event) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        const allowedExtension = /\.(txt|md|csv|json|log)$/i.test(file.name);
        if (!allowedExtension || file.size > 1024 * 1024) {
            setAttachmentError("Choose a TXT, MD, CSV, JSON, or LOG file under 1 MB.");
            return;
        }

        try {
            const text = await file.text();
            if (!text.trim()) {
                setAttachmentError("That file is empty.");
                return;
            }
            if (text.length > 12000) {
                setAttachmentError("Keep document text under 12,000 characters.");
                return;
            }
            setAttachment({ name: file.name, text });
            setAttachmentError("");
        } catch {
            setAttachmentError("This file could not be read.");
        }
    }

    function openChat(chatId) {
        chat.handleOpenChat(chatId, chats);
        setSidebarOpen(false);
    }

    return (
        <main className="auralis-app">
            {sidebarOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
            <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
                <div className="brand-lockup">
                    <span className="brand-mark"><Sparkles size={19} strokeWidth={2.2} /></span>
                    <span className="brand-name">auralis<span>·</span></span>
                    <button className="icon-button sidebar-dismiss" title="Close navigation" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
                </div>

                <button className="new-chat-button" onClick={startNewChat}>
                    <Plus size={17} /> <span>New conversation</span> <kbd>⌘ K</kbd>
                </button>

                <div className="history-heading">
                    <span>Your space</span>
                    <span className="history-count">{visibleChats.length}</span>
                </div>
                <label className="history-search">
                    <Search size={15} />
                    <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Find a conversation" />
                </label>
                <nav className="conversation-list" aria-label="Conversations">
                    {visibleChats.map((item) => (
                        <button
                            key={item.id}
                            className={`conversation-item ${item.id === currentChatId ? "conversation-active" : ""}`}
                            onClick={() => openChat(item.id)}
                        >
                            <MessageSquare size={15} />
                            <span>{item.title}</span>
                        </button>
                    ))}
                    {visibleChats.length === 0 && <p className="empty-history">{filter ? "No matching conversations" : "Your conversations will appear here"}</p>}
                </nav>

                <div className="sidebar-bottom">
                    <div className="account-row">
                        <span className="account-avatar">{(user?.username || user?.email || "A").slice(0, 1).toUpperCase()}</span>
                        <span className="account-copy"><strong>{user?.username || "Your account"}</strong><small>Auralis personal</small></span>
                        <span className="online-dot" title="Ready" />
                    </div>
                </div>
            </aside>

            <section className="chat-panel">
                <header className="topbar">
                    <button className="icon-button mobile-menu" title="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={19} /></button>
                    <div className="mobile-brand"><span className="brand-mark"><Sparkles size={16} /></span>auralis</div>
                    <div className="model-status"><span className="status-pulse" /> Auralis <span className="topbar-divider">/</span> <span className="model-label">Assistant</span></div>
                    <div className="topbar-right"><span className="secure-label"><span /> Private session</span></div>
                </header>

                <section className="conversation-stage" aria-live="polite">
                    {messages.length === 0 ? (
                        <div className="welcome-view">
                            <div className="welcome-orbit"><Sparkles size={23} /></div>
                            <p className="eyebrow">A THOUGHTFUL PLACE TO BEGIN</p>
                            <h1>{currentChatId ? "Pick up where you left off." : <>Good questions<br /><em>open new doors.</em></>}</h1>
                            <p className="welcome-subtitle">Ask, explore, or bring a document. Auralis is ready to think it through with you.</p>
                            <div className="suggestion-grid">
                                {suggestions.map((suggestion, index) => (
                                    <button key={suggestion} className="suggestion-card" onClick={() => setChatInput(suggestion)}>
                                        <span className={`suggestion-index suggestion-index-${index + 1}`}>0{index + 1}</span>
                                        <span>{suggestion}</span>
                                        <ArrowUp size={15} className="suggestion-arrow" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="message-thread">
                            {messages.map((message, index) => (
                                <article className={`message-row ${message.role === "user" ? "message-user" : "message-assistant"}`} key={message.id || message.requestId || `${message.role}-${index}`}>
                                    {message.role === "ai" && <div className="assistant-avatar"><Sparkles size={15} /></div>}
                                    <div className="message-content">
                                        {message.role === "user" ? (
                                            <>
                                                {message.attachment?.name && <div className="message-attachment"><FileText size={14} />{message.attachment.name}</div>}
                                                {message.content && <p>{message.content}</p>}
                                            </>
                                        ) : message.content ? (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                                        ) : isLoading ? (
                                            <div className="thinking-indicator"><span /><span /><span /><small>Auralis is thinking</small></div>
                                        ) : null}
                                    </div>
                                </article>
                            ))}
                            <div ref={endRef} />
                        </div>
                    )}
                </section>

                <div className="composer-dock">
                    {error && <div className="chat-error" role="status">{error}</div>}
                    {attachmentError && <div className="chat-error" role="status">{attachmentError}</div>}
                    <form className="composer" onSubmit={handleSubmit}>
                        {attachment && (
                            <div className="attached-file"><FileText size={15} /><span>{attachment.name}</span><button type="button" title="Remove attachment" onClick={() => setAttachment(null)}><X size={14} /></button></div>
                        )}
                        <textarea
                            value={chatInput}
                            onChange={(event) => setChatInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault();
                                    event.currentTarget.form.requestSubmit();
                                }
                            }}
                            placeholder="Ask Auralis anything..."
                            rows={2}
                            aria-label="Message Auralis"
                        />
                        <div className="composer-toolbar">
                            <div className="composer-tools">
                                <input ref={fileInputRef} className="visually-hidden" type="file" accept=".txt,.md,.csv,.json,.log,text/plain,text/markdown,text/csv,application/json" onChange={handleFileChange} />
                                <button type="button" className="tool-button" title="Attach a text file" onClick={() => fileInputRef.current?.click()}>
                                    <Paperclip size={16} /><span>Attach</span>
                                </button>
                                <button type="button" className={`tool-button search-toggle ${searchEnabled ? "tool-active" : ""}`} aria-pressed={searchEnabled} title="Search the web for current information" onClick={() => setSearchEnabled((enabled) => !enabled)}>
                                    {searchEnabled ? <Check size={15} /> : <Globe2 size={15} />}<span>Web search</span>
                                </button>
                            </div>
                            <div className="composer-send-area">
                                <span className="keyboard-hint">Shift + Enter for a new line</span>
                                <button className="send-button" type="submit" disabled={isLoading || (!chatInput.trim() && !attachment)} title="Send message">
                                    <ArrowUp size={18} />
                                </button>
                            </div>
                        </div>
                    </form>
                    <p className="composer-footnote">Auralis can make mistakes. Check important details.</p>
                </div>
            </section>
        </main>
    );
}