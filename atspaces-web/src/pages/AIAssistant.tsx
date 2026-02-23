import { useState } from 'react';
import { MessageSquare, Send, Mic, Volume2, Globe, Plus, ChevronLeft, Moon, Sun, User, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const AIAssistantPage = () => {
    const { theme, toggleTheme } = useTheme();
    const [input, setInput] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const historyItems = [
        { title: 'Workspace Amman', time: '2 hours ago' },
        { title: 'Meeting Room for 4', time: 'Yesterday' },
        { title: 'High-speed Wi-Fi desks', time: 'Feb 20' }
    ];

    const suggestionButtons = [
        "Find meeting rooms in Amman",
        "Check private office pricing",
        "How does verification work?"
    ];

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
                    <div
                        className="mobile-only"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        style={{ cursor: 'pointer', marginRight: '0.5rem' }}
                    >
                        {isSidebarOpen ? <Plus size={24} style={{ transform: 'rotate(45deg)' }} /> : <MessageSquare size={24} />}
                    </div>
                    <Link to="/" className="desktop-only" style={{
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
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

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
                {/* Mobile Overlay */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="ai-overlay"
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <aside
                    className={`ai-sidebar ${isSidebarOpen ? 'open' : ''}`}
                    style={{
                        width: '260px',
                        borderRight: '1px solid var(--border)',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(0,0,0,0.02)',
                        flexShrink: 0
                    }}
                >
                    <button className="btn-primary" style={{
                        padding: '0.875rem',
                        width: '100%',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        marginBottom: '2rem',
                        borderRadius: '12px'
                    }}>
                        <Plus size={18} />
                        New Chat
                    </button>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <div style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: 'var(--text-secondary)',
                            letterSpacing: '1px',
                            opacity: 0.5,
                            marginBottom: '1.25rem',
                            textTransform: 'uppercase'
                        }}>
                            Recent History
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {historyItems.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ background: 'var(--bg-input)', x: 4 }}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.25rem' }}>{item.title}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.6 }}>
                                        <Clock size={10} />
                                        {item.time}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="ai-main-content" style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    padding: '2rem',
                    overflowY: 'auto'
                }}>
                    {/* Empty State / Welcome Content */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        paddingBottom: '160px'
                    }}>
                        {/* Centered Logo with Glow */}
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
                                width: '70px', // Slightly smaller
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

                        <h1 className="ai-welcome-title" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>How can I help you today?</h1>
                        <p className="ai-welcome-desc" style={{
                            fontSize: '1.1rem',
                            color: 'var(--text-secondary)',
                            maxWidth: '550px',
                            lineHeight: 1.5,
                            marginBottom: '2.5rem'
                        }}>
                            I can <span style={{ color: 'var(--primary)' }}>help you</span> find workspaces, check availability, or explain our pricing plans instantly.
                        </p>

                        {/* Suggestion Grid */}
                        <div className="ai-suggestion-grid" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            maxWidth: '700px'
                        }}>
                            <div className="ai-suggestion-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%' }}>
                                <motion.div
                                    whileHover={{ scale: 1.02, background: 'var(--bg-input)', borderColor: 'var(--primary)' }}
                                    className="glass-panel ai-suggestion-card"
                                    style={{ padding: '1.1rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, border: '1px solid var(--border)', transition: 'all 0.2s' }}
                                >
                                    {suggestionButtons[0]}
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.02, background: 'var(--bg-input)', borderColor: 'var(--primary)' }}
                                    className="glass-panel ai-suggestion-card"
                                    style={{ padding: '1.1rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, border: '1px solid var(--border)', transition: 'all 0.2s' }}
                                >
                                    {suggestionButtons[1]}
                                </motion.div>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.02, background: 'var(--bg-input)', borderColor: 'var(--primary)' }}
                                className="glass-panel ai-suggestion-card"
                                style={{ padding: '1.1rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, width: 'calc(50% - 0.375rem)', border: '1px solid var(--border)', transition: 'all 0.2s' }}
                            >
                                {suggestionButtons[2]}
                            </motion.div>
                        </div>
                    </div>

                    {/* Fixed Bottom Input Area */}
                    <div className="ai-input-container" style={{
                        position: 'absolute',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100%',
                        maxWidth: '900px',
                        padding: '0 1rem'
                    }}>
                        <div style={{
                            background: 'var(--bg-input)',
                            borderRadius: '20px',
                            padding: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{
                                padding: '0.6rem 0.8rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                            }}>
                                EN
                            </div>
                            <Mic size={22} style={{ cursor: 'pointer', opacity: 0.6 }} />
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
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
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Volume2 size={22} style={{ cursor: 'pointer', opacity: 0.6 }} />
                                <button style={{
                                    width: '44px',
                                    height: '44px',
                                    background: 'var(--primary)',
                                    border: 'none',
                                    borderRadius: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 16px var(--primary-glow)'
                                }}>
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AIAssistantPage;
