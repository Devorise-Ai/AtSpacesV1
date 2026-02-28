import { useState } from 'react';
import { Globe, Moon, Sun, User, Menu, X, Settings, BookOpen, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useIsMobile } from '../hooks/useMediaQuery';
import { getUser } from '../lib/token';
import { authService } from '../services/auth.service';
import AuthModal from './AuthModal';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const isLoggedIn = authService.isLoggedIn();
    const currentUser = getUser();
    // First letter of user's name for avatar initial
    const userInitial = currentUser?.fullName?.charAt(0)?.toUpperCase() || null;

    const handleLogout = () => {
        authService.logout();
        setIsUserOpen(false);
        navigate('/');
    };

    const handleUserIconClick = () => {
        if (isLoggedIn) {
            setIsUserOpen(!isUserOpen);
            setIsSettingsOpen(false);
        } else {
            setShowAuthModal(true);
        }
    };

    const handleAuthSuccess = () => {
        setShowAuthModal(false);
        navigate('/dashboard');
    };

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
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2.5rem',
                    flex: isMobile ? 1 : 'auto',
                    justifyContent: isMobile ? 'center' : 'flex-start'
                }}>
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
                        <Link
                            to="/workspaces"
                            className={`nav-link ${location.pathname === '/workspaces' ? 'active' : ''}`}
                        >Workspaces</Link>
                        <a href="/#pricing" className="nav-link">Pricing</a>
                        <Link to="/ai-assistant" className={`nav-link ${location.pathname === '/ai-assistant' ? 'active' : ''}`}>AI Assistant</Link>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <Link to="/workspaces" style={{ textDecoration: 'none' }}>
                        <button className="btn-primary desktop-only" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Book Now</button>
                    </Link>

                    {/* User Menu */}
                    <div style={{ position: 'relative' }}>
                        <div
                            onClick={handleUserIconClick}
                            style={{
                                width: '36px',
                                height: '36px',
                                background: isLoggedIn ? 'var(--primary)' : 'var(--bg-input)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                border: '1px solid var(--border)',
                                transition: 'var(--transition)',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                color: isLoggedIn ? 'white' : 'var(--primary)',
                            }}
                        >
                            {isLoggedIn && userInitial ? userInitial : <User size={18} color="var(--primary)" />}
                        </div>

                        <AnimatePresence>
                            {isUserOpen && (
                                <>
                                    <div
                                        onClick={() => setIsUserOpen(false)}
                                        style={{ position: 'fixed', inset: 0, zIndex: -1 }}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="glass-panel"
                                        style={{
                                            position: 'absolute',
                                            top: 'calc(100% + 12px)',
                                            right: 0,
                                            width: '200px',
                                            padding: '0.75rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.25rem',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                            border: '1px solid var(--border)'
                                        }}
                                    >
                                        {isLoggedIn ? (
                                            <>
                                                {currentUser && (
                                                    <div style={{ padding: '0.5rem 0.75rem 0.25rem', marginBottom: '0.25rem' }}>
                                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{currentUser.fullName}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{currentUser.email}</div>
                                                    </div>
                                                )}
                                                <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />
                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setIsUserOpen(false)}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <div
                                                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                                                        className="nav-link"
                                                    >
                                                        <LayoutDashboard size={16} /> Dashboard
                                                    </div>
                                                </Link>
                                                <Link
                                                    to="/my-bookings"
                                                    onClick={() => setIsUserOpen(false)}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <div
                                                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                                                        className="nav-link"
                                                    >
                                                        <BookOpen size={16} /> My Bookings
                                                    </div>
                                                </Link>
                                                <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />
                                                <div
                                                    onClick={handleLogout}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#ef4444' }}
                                                >
                                                    <LogOut size={16} /> Sign Out
                                                </div>
                                            </>
                                        ) : (
                                            <div
                                                onClick={() => { setIsUserOpen(false); setShowAuthModal(true); }}
                                                style={{ padding: '0.6rem 0.75rem', fontSize: '0.85rem', color: 'var(--primary)', textAlign: 'center', cursor: 'pointer', fontWeight: 600 }}
                                            >
                                                Sign in / Register
                                            </div>
                                        )}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Settings (Theme + Language) */}
                    <div className="desktop-only" style={{ position: 'relative' }}>
                        <div
                            onClick={() => { setIsSettingsOpen(!isSettingsOpen); setIsUserOpen(false); }}
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
                                            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
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
                        <Link
                            to="/workspaces"
                            className={`nav-link ${location.pathname === '/workspaces' ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                        >Workspaces</Link>
                        <a href="/#pricing" className="nav-link" onClick={() => setIsMenuOpen(false)}>Pricing</a>
                        <Link to="/ai-assistant" className={`nav-link ${location.pathname === '/ai-assistant' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>AI Assistant</Link>
                        {isLoggedIn && (
                            <Link to="/my-bookings" className={`nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>My Bookings</Link>
                        )}
                        <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }} />
                        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                            <div
                                onClick={() => { setLanguage(language === 'en' ? 'ar' : 'en'); setIsMenuOpen(false); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                            >
                                <Globe size={18} /> {language === 'en' ? 'العربية' : 'English'}
                            </div>
                            <div
                                onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </div>
                        </div>
                        {isLoggedIn && (
                            <button
                                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                Sign Out
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media (max-width: 768px) {
                    .nav-links { display: none !important; }
                    .mobile-only { display: block !important; }
                    .desktop-only { display: none !important; }
                }
            `}</style>

            {/* Auth Modal — triggered from Navbar */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={handleAuthSuccess}
            />
        </>
    );
};

export default Navbar;
