import { useState } from 'react';
import { Globe, Moon, Sun, User, Menu, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const location = useLocation();

    return (
        <>
            <motion.nav
                initial={{ y: -100, x: '-50%', opacity: 0 }}
                animate={{ y: 0, x: '-50%', opacity: 1 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
                className="glass-panel"
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '50%',
                    width: '90%',
                    maxWidth: '1200px',
                    zIndex: 1000,
                    padding: '0.5rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flex: window.innerWidth < 768 ? 1 : 'auto', justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div className="mobile-center-logo" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
                            At<span style={{ color: 'var(--primary)' }}>Spaces</span>
                        </div>
                    </Link>
                    <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
                        <Link
                            to="/"
                            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >Explore</Link>
                        <a href="#workspaces" className="nav-link">Workspaces</a>
                        <a href="#pricing" className="nav-link">Pricing</a>
                        <Link to="/ai-assistant" className={`nav-link ${location.pathname === '/ai-assistant' ? 'active' : ''}`}>AI Assistant</Link>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <button className="btn-primary desktop-only" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Book Now</button>

                    <div style={{
                        width: '36px',
                        height: '36px',
                        background: 'var(--bg-input)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: '1px solid var(--border)'
                    }}>
                        <User size={20} color="var(--primary)" />
                    </div>

                    <div className="desktop-only" style={{ position: 'relative' }}>
                        <div
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            style={{
                                cursor: 'pointer',
                                color: 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.5rem',
                                borderRadius: '8px',
                                transition: 'var(--transition)'
                            }}
                            className="nav-link"
                        >
                            <Settings size={20} />
                        </div>

                        <AnimatePresence>
                            {isSettingsOpen && (
                                <>
                                    <div
                                        onClick={() => setIsSettingsOpen(false)}
                                        style={{ position: 'fixed', inset: 0, zIndex: -1 }}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="glass-panel"
                                        style={{
                                            position: 'absolute',
                                            top: 'calc(100% + 20px)',
                                            right: '-1.5rem',
                                            width: '180px',
                                            padding: '0.75rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                            border: '1px solid var(--border)'
                                        }}
                                    >
                                        <div
                                            onClick={() => { setLanguage(language === 'en' ? 'ar' : 'en'); setIsSettingsOpen(false); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}
                                            className="nav-link"
                                        >
                                            <Globe size={16} /> {language === 'en' ? 'العربية' : 'English'}
                                        </div>
                                        <div
                                            onClick={() => { toggleTheme(); setIsSettingsOpen(false); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}
                                            className="nav-link"
                                        >
                                            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                                            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div
                        className="mobile-only"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{ color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-panel"
                        style={{
                            position: 'fixed',
                            top: '5.5rem',
                            left: '5%',
                            width: '90%',
                            zIndex: 999,
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem'
                        }}
                    >
                        <Link
                            to="/"
                            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                            onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        >Explore</Link>
                        <a href="#workspaces" className="nav-link" onClick={() => setIsMenuOpen(false)}>Workspaces</a>
                        <a href="#pricing" className="nav-link" onClick={() => setIsMenuOpen(false)}>Pricing</a>
                        <Link to="/ai-assistant" className={`nav-link ${location.pathname === '/ai-assistant' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>AI Assistant</Link>
                        <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }} />
                        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Globe size={18} /> Language
                            </div>
                            <div
                                onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                            >
                                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media (max-width: 768px) {
                    .nav-links { display: none !important; }
                    .mobile-only { display: block !important; }
                }
            `}</style>
        </>
    );
};

export default Navbar;
