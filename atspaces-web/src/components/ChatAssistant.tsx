import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, Volume2, Star, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { WORKSPACES } from '../data/workspaces';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    workspaceCards?: typeof WORKSPACES;
}

const BOOKING_KEYWORDS = ['book', 'reserve', 'find', 'workspace', 'office', 'desk', 'meeting', 'room', 'show', 'available', 'recommend', 'suggest', 'cheap', 'best', 'private', 'hot desk'];

const ChatAssistant = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            text: 'Hello! 👋 I\'m your AtSpaces assistant. Ask me about workspaces, pricing, or I can help you book a space right now!'
        }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const generateResponse = (userMessage: string): Message => {
        const lower = userMessage.toLowerCase();
        const isBookingQuery = BOOKING_KEYWORDS.some(kw => lower.includes(kw));

        if (isBookingQuery) {
            // Match workspaces based on keywords
            let matched = WORKSPACES;
            if (lower.includes('private') || lower.includes('office')) {
                matched = WORKSPACES.filter(w => w.type === 'Private Office');
            } else if (lower.includes('meeting') || lower.includes('room') || lower.includes('boardroom')) {
                matched = WORKSPACES.filter(w => w.type === 'Meeting Room');
            } else if (lower.includes('desk') || lower.includes('hot desk') || lower.includes('cheap')) {
                matched = WORKSPACES.filter(w => w.type === 'Hot Desk');
            }

            if (lower.includes('cheap') || lower.includes('affordable') || lower.includes('budget')) {
                matched = [...matched].sort((a, b) => a.price - b.price);
            }
            if (lower.includes('best') || lower.includes('top') || lower.includes('rated')) {
                matched = [...matched].sort((a, b) => b.rating - a.rating);
            }

            const results = matched.slice(0, 3);

            return {
                id: Date.now().toString(),
                role: 'assistant',
                text: `Great choice! Here are ${results.length} workspace${results.length > 1 ? 's' : ''} I'd recommend for you:`,
                workspaceCards: results
            };
        }

        if (lower.includes('price') || lower.includes('pricing') || lower.includes('cost') || lower.includes('how much')) {
            return {
                id: Date.now().toString(),
                role: 'assistant',
                text: 'Our workspaces range from **JOD 8/hour** for hot desks to **JOD 45/hour** for premium private offices. We also offer monthly plans starting at JOD 49. Would you like me to show you some options?'
            };
        }

        if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
            return {
                id: Date.now().toString(),
                role: 'assistant',
                text: 'Hey there! 😊 How can I help you today? I can find workspaces, check availability, or help you book a space.'
            };
        }

        if (lower.includes('help')) {
            return {
                id: Date.now().toString(),
                role: 'assistant',
                text: 'I can help you with:\n\n• Finding the perfect workspace\n• Checking pricing and plans\n• Booking a space\n• Getting directions\n\nJust ask me anything!'
            };
        }

        return {
            id: Date.now().toString(),
            role: 'assistant',
            text: 'I\'d love to help! Try asking me about available workspaces, pricing, or say "find me a workspace" to get started. 🚀'
        };
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input.trim()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate typing delay
        setTimeout(() => {
            const response = generateResponse(userMsg.text);
            setMessages(prev => [...prev, response]);
        }, 600);
    };

    return (
        <div className="chat-bubble" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000 }}>
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
                    cursor: 'pointer'
                }}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="glass-panel chat-window"
                        style={{
                            position: 'absolute',
                            bottom: '80px',
                            right: 0,
                            width: '400px',
                            height: '550px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 12px 48px rgba(0,0,0,0.5)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '1.5rem', background: 'rgba(255, 91, 4, 0.1)', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem' }}>AtSpaces Assistant</h3>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Always here to help</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <Volume2 size={20} style={{ cursor: 'pointer' }} />
                                    <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messages.map((msg) => (
                                <div key={msg.id}>
                                    <div style={{
                                        display: 'flex',
                                        gap: '0.75rem',
                                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                                    }}>
                                        {msg.role === 'assistant' && (
                                            <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <MessageSquare size={16} color="white" />
                                            </div>
                                        )}
                                        <div style={{
                                            background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                            padding: '0.75rem 1rem',
                                            borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '0 12px 12px 12px',
                                            fontSize: '0.9rem',
                                            lineHeight: 1.5,
                                            maxWidth: '85%',
                                            color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {msg.text}
                                        </div>
                                    </div>

                                    {/* Workspace Cards */}
                                    {msg.workspaceCards && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem', marginLeft: '2.5rem' }}>
                                            {msg.workspaceCards.map(space => (
                                                <motion.div
                                                    key={space.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    style={{
                                                        display: 'flex',
                                                        background: 'rgba(255,255,255,0.03)',
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        border: '1px solid var(--border)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    whileHover={{ scale: 1.02, borderColor: 'var(--primary)' }}
                                                >
                                                    <img src={space.image} alt={space.title} style={{ width: '80px', height: '80px', objectFit: 'cover', flexShrink: 0 }} />
                                                    <div style={{ padding: '0.5rem 0.75rem', flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <h4 style={{ fontSize: '0.85rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{space.title}</h4>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontSize: '0.75rem', flexShrink: 0 }}>
                                                                <Star size={12} fill="currentColor" /> {space.rating}
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '0.15rem 0' }}>
                                                            <MapPin size={10} /> {space.location}
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>JOD {space.price}/hr</span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/workspaces/${space.id}`);
                                                                    setIsOpen(false);
                                                                }}
                                                                style={{
                                                                    padding: '0.2rem 0.6rem',
                                                                    background: 'var(--primary)',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '6px',
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: 600,
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Book Now
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-input)', padding: '0.4rem 0.6rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <input
                                    type="text"
                                    placeholder="Ask about workspaces..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', padding: '0 0.25rem', outline: 'none', fontSize: '0.9rem' }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Mic size={18} color="var(--text-secondary)" style={{ cursor: 'pointer', opacity: 0.6 }} />
                                    <button
                                        onClick={handleSend}
                                        style={{ background: 'var(--primary)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatAssistant;
