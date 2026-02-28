import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, Send, Mic, Volume2, Globe, ChevronLeft, Moon, Sun, User, Loader2, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { io, Socket } from 'socket.io-client';
import api from '../lib/api';
import { getToken } from '../lib/token';

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

const AIAssistantPage = () => {
    const { theme, toggleTheme } = useTheme();
    const token = getToken();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            text: "Hello! 👋 I'm your AtSpaces Assistant, powered by AI. Ask me about workspaces, pricing, availability in any city, or I can book a space for you right now!",
        },
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const sessionId = useRef(getSessionId());
    const streamingIdRef = useRef<string | null>(null);

    // ── Fetch History ──────────────────────────────────
    useEffect(() => {
        const fetchHistory = async () => {
            if (!token) return;
            setIsLoadingHistory(true);
            try {
                const response = await api.get('/ai/history');
                const history = response.data;
                if (history && history.length > 0) {
                    setMessages(history);
                }
            } catch (error) {
                console.error("Failed to load chat history", error);
            } finally {
                setIsLoadingHistory(false);
            }
        };

        fetchHistory();
    }, [token]);

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

        socket.on('messageChunk', ({ chunk }: { chunk: string }) => {
            if (!streamingIdRef.current) return;
            const id = streamingIdRef.current;
            setMessages(prev =>
                prev.map(m =>
                    m.id === id ? { ...m, text: m.text + chunk } : m
                )
            );
        });

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

        socket.on('messageError', ({ error }: { error: string }) => {
            const streamingId = streamingIdRef.current;
            streamingIdRef.current = null;
            setIsThinking(false);
            setMessages(prev => [
                ...prev.filter(m => m.id !== streamingId),
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

    const handleSend = useCallback((textOverride?: string) => {
        const text = textOverride || input.trim();
        if (!text || isThinking) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text,
        };

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
                token: token || undefined
            });
        } else {
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

    const suggestionButtons = [
        "Find meeting rooms in Amman",
        "Check private office pricing",
        "How does verification work?"
    ];

    const statusColor =
        connectionStatus === 'connected' ? '#22c55e' :
            connectionStatus === 'connecting' ? '#f59e0b' : '#ef4444';

    return (
        <div style={{
            height: '100vh',
            background: 'var(--bg-deep)',
            color: 'var(--text-primary)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', sans-serif",
            overflow: 'hidden'
        }}>
            {/* Top Header */}
            <header style={{
                height: '70px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2rem',
                flexShrink: 0,
                zIndex: 1001
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/" style={{
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        opacity: 0.8
                    }}>
                        <ChevronLeft size={18} />
                        Back to Home
                    </Link>
                    <div className="desktop-only" style={{ width: '1px', height: '24px', background: 'var(--border)' }} />
                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                        At<span style={{ color: 'var(--primary)' }}>Assistant</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'connecting' ? 'Connecting' : 'Offline'}
                        </span>
                    </div>
                    <Globe size={18} style={{ cursor: 'pointer', opacity: 0.7 }} />
                    <div onClick={toggleTheme} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 0.7 }}>
                        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                    </div>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--bg-input)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border)',
                        cursor: 'pointer'
                    }}>
                        <User size={18} color="var(--primary)" />
                    </div>
                </div>
            </header>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', justifyContent: 'center' }}>
                {/* Main Content Area */}
                <main className="ai-main-content" style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    padding: '1rem',
                    overflow: 'hidden',
                    maxWidth: '1200px',
                    width: '100%'
                }}>
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        maxWidth: '900px',
                        width: '100%',
                        margin: '0 auto'
                    }}>
                        {isLoadingHistory ? (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Loader2 size={32} className="animate-spin" color="var(--primary)" />
                            </div>
                        ) : messages.length === 1 && messages[0].id === 'welcome' && (
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                paddingBottom: '80px'
                            }}>
                                <div style={{ position: 'relative', marginBottom: '2rem' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '120px',
                                        height: '120px',
                                        background: 'var(--primary-glow)',
                                        filter: 'blur(40px)',
                                        borderRadius: '50%',
                                        zIndex: 0
                                    }} />
                                    <div style={{
                                        width: '70px',
                                        height: '70px',
                                        background: 'var(--primary)',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        zIndex: 1,
                                        boxShadow: '0 10px 30px var(--primary-glow)'
                                    }}>
                                        <MessageSquare size={32} color="white" fill="white" />
                                    </div>
                                </div>

                                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>How can I help you?</h1>
                                <p style={{
                                    fontSize: '1.1rem',
                                    color: 'var(--text-secondary)',
                                    maxWidth: '550px',
                                    lineHeight: 1.5,
                                    marginBottom: '2.5rem'
                                }}>
                                    I can help you find workspaces, check availability, or explain our pricing plans instantly.
                                </p>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    width: '100%',
                                    maxWidth: '700px'
                                }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', width: '100%' }}>
                                        {suggestionButtons.map((btn, i) => (
                                            <div
                                                key={i}
                                                onClick={() => handleSend(btn)}
                                                className="glass-panel"
                                                style={{ padding: '1.1rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, border: '1px solid var(--border)', transition: 'all 0.2s' }}
                                            >
                                                {btn}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {(!isLoadingHistory && (messages.length > 1 || messages[0].id !== 'welcome')) && messages.map((msg) => (
                            <div key={msg.id} style={{ display: 'flex', gap: '1rem', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                {msg.role === 'assistant' && (
                                    <div style={{ width: '36px', height: '36px', background: 'var(--primary)', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MessageSquare size={18} color="white" />
                                    </div>
                                )}
                                <div style={{
                                    background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    padding: '1rem 1.25rem',
                                    borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '0 16px 16px 16px',
                                    fontSize: '1rem',
                                    lineHeight: 1.6,
                                    maxWidth: '80%',
                                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none'
                                }}>
                                    {msg.text || (msg.streaming ? '...' : '')}
                                </div>
                            </div>
                        ))}

                        {isThinking && !streamingIdRef.current && (
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '36px', height: '36px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Loader2 size={18} color="white" className="animate-spin" />
                                </div>
                                <div style={{ display: 'flex', gap: '4px', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0 16px 16px 16px', border: '1px solid var(--border)' }}>
                                    {[0, 1, 2].map(i => (
                                        <span key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-secondary)', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{
                        marginTop: 'auto',
                        padding: '1.5rem 0',
                        maxWidth: '900px',
                        width: '100%',
                        margin: '0 auto'
                    }}>
                        <div style={{
                            background: 'var(--bg-input)',
                            borderRadius: '24px',
                            padding: '0.75rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                            border: '1px solid var(--border)'
                        }}>
                            <Mic size={22} style={{ cursor: 'pointer', opacity: 0.6 }} />
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                placeholder="Message AtAssistant..."
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    padding: '0.5rem'
                                }}
                                disabled={connectionStatus === 'disconnected'}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Volume2 size={22} style={{ cursor: 'pointer', opacity: 0.6 }} />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={isThinking || !input.trim() || connectionStatus === 'disconnected'}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        background: isThinking || !input.trim() ? 'rgba(255,91,4,0.4)' : 'var(--primary)',
                                        border: 'none',
                                        borderRadius: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        cursor: isThinking || !input.trim() ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 8px 16px var(--primary-glow)',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    {isThinking ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                </button>
                            </div>
                        </div>
                        {connectionStatus === 'disconnected' && (
                            <p style={{ textAlign: 'center', color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <WifiOff size={14} /> Backend offline — start the NestJS server on port 3001
                            </p>
                        )}
                    </div>
                </main>
            </div>
            <style>{`
                @keyframes bounce { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
                .animate-spin { animation: spin 1s linear infinite }
                @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
            `}</style>
        </div>
    );
};

export default AIAssistantPage;
