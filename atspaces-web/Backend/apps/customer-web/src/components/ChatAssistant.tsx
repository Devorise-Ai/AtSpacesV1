import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Mic, Volume2, Loader2, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';

// ── Backend URL ────────────────────────────────────────
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// ── Types ──────────────────────────────────────────────
interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    streaming?: boolean;
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

// ── Stable session ID per browser tab ─────────────────
function getSessionId(): string {
    let sid = sessionStorage.getItem('atspaces_chat_session');
    if (!sid) {
        sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        sessionStorage.setItem('atspaces_chat_session', sid);
    }
    return sid;
}

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            text: "Hello! 👋 I'm your AtSpaces Assistant, powered by AI. Ask me about workspaces, pricing, availability in any city, or I can book a space for you right now!",
        },
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const sessionId = useRef(getSessionId());
    const streamingIdRef = useRef<string | null>(null);

    // ── Auto-scroll ────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ── Socket connection ──────────────────────────────
    useEffect(() => {
        const socket = io(BACKEND_URL, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            setConnectionStatus('connected');
        });

        socket.on('disconnect', () => {
            setConnectionStatus('disconnected');
        });

        socket.on('connect_error', () => {
            setConnectionStatus('disconnected');
        });

        // Each incoming chunk appends to the streaming message
        socket.on('messageChunk', ({ chunk }: { chunk: string }) => {
            if (!streamingIdRef.current) return;
            const id = streamingIdRef.current;
            setMessages(prev =>
                prev.map(m =>
                    m.id === id ? { ...m, text: m.text + chunk } : m
                )
            );
        });

        // Stream finished — mark as done
        socket.on('messageComplete', () => {
            if (streamingIdRef.current) {
                const id = streamingIdRef.current;
                setMessages(prev =>
                    prev.map(m => m.id === id ? { ...m, streaming: false } : m)
                );
                streamingIdRef.current = null;
            }
            setIsThinking(false);
        });

        // Error from backend
        socket.on('messageError', ({ error }: { error: string }) => {
            streamingIdRef.current = null;
            setIsThinking(false);
            setMessages(prev => [
                ...prev.filter(m => m.streaming !== true),
                {
                    id: Date.now().toString(),
                    role: 'assistant',
                    text: `⚠️ ${error || 'Something went wrong. Please try again.'}`,
                },
            ]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // ── Send message ───────────────────────────────────
    const handleSend = useCallback(() => {
        const text = input.trim();
        if (!text || isThinking) return;

        // Add user message
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text,
        };

        // Add empty assistant placeholder that will stream into
        const assistantId = `stream_${Date.now()}`;
        streamingIdRef.current = assistantId;

        const assistantPlaceholder: Message = {
            id: assistantId,
            role: 'assistant',
            text: '',
            streaming: true,
        };

        setMessages(prev => [...prev, userMsg, assistantPlaceholder]);
        setInput('');
        setIsThinking(true);

        if (socketRef.current?.connected) {
            socketRef.current.emit('sendMessage', {
                message: text,
                sessionId: sessionId.current,
            });
        } else {
            // Backend offline fallback
            streamingIdRef.current = null;
            setIsThinking(false);
            setMessages(prev => [
                ...prev.filter(m => m.id !== assistantId),
                {
                    id: Date.now().toString(),
                    role: 'assistant',
                    text: "⚠️ I can't reach the server right now. Please make sure the backend is running on port 3001.",
                },
            ]);
        }
    }, [input, isThinking]);

    // ── UI ─────────────────────────────────────────────
    const statusColor =
        connectionStatus === 'connected' ? '#22c55e' :
            connectionStatus === 'connecting' ? '#f59e0b' : '#ef4444';

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000 }}>
            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 8px 32px var(--primary-glow)',
                    cursor: 'pointer',
                    position: 'relative',
                }}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                {/* Connection status dot */}
                <span style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: statusColor,
                    border: '2px solid #111',
                }} />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="glass-panel"
                        style={{
                            position: 'absolute',
                            bottom: '80px',
                            right: 0,
                            width: '400px',
                            height: '560px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
                            borderRadius: '20px',
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(255, 91, 4, 0.1)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MessageSquare size={20} color="white" />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', margin: 0 }}>AtSpaces Assistant</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, flexShrink: 0 }} />
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>
                                                {connectionStatus === 'connected' ? 'AI • Live' :
                                                    connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <Volume2 size={18} style={{ cursor: 'pointer', opacity: 0.5 }} />
                                    <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
                                </div>
                            </div>
                        </div>

                        {/* Offline banner */}
                        {connectionStatus === 'disconnected' && (
                            <div style={{ padding: '0.6rem 1rem', background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <WifiOff size={14} color="#ef4444" />
                                <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>Backend offline — start the NestJS server on port 3001</span>
                            </div>
                        )}

                        {/* Messages */}
                        <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messages.map((msg) => (
                                <div key={msg.id}>
                                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                        {msg.role === 'assistant' && (
                                            <div style={{ width: '30px', height: '30px', background: 'var(--primary)', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
                                                <MessageSquare size={15} color="white" />
                                            </div>
                                        )}
                                        <div style={{
                                            background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                            padding: '0.75rem 1rem',
                                            borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '0 12px 12px 12px',
                                            fontSize: '0.875rem',
                                            lineHeight: 1.6,
                                            maxWidth: '85%',
                                            color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                        }}>
                                            {msg.text || (msg.streaming ? '' : '…')}
                                            {/* Blinking cursor while streaming */}
                                            {msg.streaming && (
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '2px',
                                                    height: '14px',
                                                    background: 'var(--primary)',
                                                    marginLeft: '2px',
                                                    verticalAlign: 'middle',
                                                    animation: 'blink 1s step-end infinite',
                                                }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Thinking dots (before first chunk arrives) */}
                            {isThinking && !streamingIdRef.current && (
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <div style={{ width: '30px', height: '30px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Loader2 size={15} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0 12px 12px 12px' }}>
                                        {[0, 1, 2].map(i => (
                                            <span key={i} style={{
                                                width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-secondary)',
                                                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                                            }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-input, rgba(255,255,255,0.05))', padding: '0.45rem 0.75rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <input
                                    type="text"
                                    placeholder={connectionStatus === 'connected' ? 'Ask about workspaces...' : 'Backend offline...'}
                                    value={input}
                                    disabled={connectionStatus === 'disconnected'}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                    style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', padding: '0 0.25rem', outline: 'none', fontSize: '0.875rem' }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Mic size={17} color="var(--text-secondary)" style={{ cursor: 'pointer', opacity: 0.5 }} />
                                    <button
                                        onClick={handleSend}
                                        disabled={isThinking || !input.trim() || connectionStatus === 'disconnected'}
                                        style={{
                                            background: isThinking || !input.trim() ? 'rgba(255,91,4,0.4)' : 'var(--primary)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            cursor: isThinking || !input.trim() ? 'not-allowed' : 'pointer',
                                            transition: 'background 0.2s',
                                        }}
                                    >
                                        {isThinking
                                            ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                                            : <Send size={15} />
                                        }
                                    </button>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.4rem', textAlign: 'center', opacity: 0.6 }}>
                                Powered by AtSpaces AI · Kimi AI
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CSS animations */}
            <style>{`
                @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0) }
                    50% { transform: translateY(-5px) }
                }
                @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
            `}</style>
        </div>
    );
};

export default ChatAssistant;
