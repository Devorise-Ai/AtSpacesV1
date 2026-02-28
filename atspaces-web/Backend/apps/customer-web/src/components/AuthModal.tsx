import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Loader2, LogIn, UserPlus } from 'lucide-react';
import { authService } from '../services/auth.service';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    defaultTab?: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, onSuccess, defaultTab = 'login' }: AuthModalProps) => {
    const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register form
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setError('');
                setLoading(false);
                setLoginEmail('');
                setLoginPassword('');
                setRegName('');
                setRegEmail('');
                setRegPhone('');
                setRegPassword('');
                setRegConfirm('');
                setShowPassword(false);
                setShowConfirm(false);
            }, 300);
        }
    }, [isOpen]);

    useEffect(() => {
        setTab(defaultTab);
    }, [defaultTab]);

    const handleLogin = async () => {
        setError('');
        if (!loginEmail || !loginPassword) {
            setError('Please enter your email and password.');
            return;
        }
        try {
            setLoading(true);
            await authService.login({ email: loginEmail, password: loginPassword });
            onSuccess();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setError('');
        if (!regName || !regEmail || !regPassword) {
            setError('Please fill in all required fields.');
            return;
        }
        if (regPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (regPassword !== regConfirm) {
            setError('Passwords do not match.');
            return;
        }
        try {
            setLoading(true);
            await authService.register({
                fullName: regName,
                email: regEmail,
                password: regPassword,
                phoneNumber: regPhone || undefined,
            });
            onSuccess();
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            setError(Array.isArray(msg) ? msg[0] : msg || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const overlayVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    const modalVariants: Variants = {
        hidden: { opacity: 0, scale: 0.92, y: 24 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 26, stiffness: 320 } },
        exit: { opacity: 0, scale: 0.92, y: 24, transition: { duration: 0.18 } }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.7rem 0.9rem 0.7rem 2.5rem',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        background: 'var(--bg-input)',
        color: 'var(--text-primary)',
        fontFamily: 'inherit',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.2s ease',
    };

    const iconWrap: React.CSSProperties = {
        position: 'absolute',
        left: '0.75rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-secondary)',
        pointerEvents: 'none',
        display: 'flex',
    };

    const field = (icon: React.ReactNode, input: React.ReactNode, rightEl?: React.ReactNode) => (
        <div style={{ position: 'relative', width: '100%' }}>
            <span style={iconWrap}>{icon}</span>
            {input}
            {rightEl && (
                <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                    {rightEl}
                </span>
            )}
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={overlayVariants}
                    initial="hidden" animate="visible" exit="hidden"
                    onClick={onClose}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.72)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 9999, padding: '1rem'
                    }}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden" animate="visible" exit="exit"
                        onClick={(e) => e.stopPropagation()}
                        className="glass-panel"
                        style={{ width: '100%', maxWidth: '440px', padding: '2.25rem', borderRadius: '24px', position: 'relative' }}
                    >
                        {/* Close */}
                        <button
                            onClick={onClose}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', display: 'flex', transition: 'color 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        >
                            <X size={20} />
                        </button>

                        {/* Branding */}
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                            At<span style={{ color: 'var(--primary)' }}>Spaces</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
                            {tab === 'login' ? 'Welcome back! Sign in to continue.' : 'Create your free account in seconds.'}
                        </p>

                        {/* Tab Switcher */}
                        <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: '12px', padding: '4px', marginBottom: '1.5rem' }}>
                            {(['login', 'register'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => { setTab(t); setError(''); }}
                                    style={{
                                        flex: 1, padding: '0.55rem', borderRadius: '9px', border: 'none',
                                        fontFamily: 'inherit', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        background: tab === t ? 'var(--primary)' : 'transparent',
                                        color: tab === t ? 'white' : 'var(--text-secondary)',
                                    }}
                                >
                                    {t === 'login' ? 'Sign In' : 'Register'}
                                </button>
                            ))}
                        </div>

                        {/* Google OAuth Button */}
                        <a
                            href="http://localhost:3001/api/auth/google"
                            style={{ display: 'block', textDecoration: 'none', marginBottom: '1.25rem' }}
                        >
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem',
                                padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)',
                                background: 'var(--bg-input)', cursor: 'pointer', fontWeight: 600,
                                fontSize: '0.9rem', color: 'var(--text-primary)', transition: 'border-color 0.2s ease',
                            }}
                                onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--primary)')}
                                onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)')}
                            >
                                {/* Google icon SVG */}
                                <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                </svg>
                                Continue with Google
                            </div>
                        </a>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>or continue with email</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                        </div>


                        <AnimatePresence mode="wait">
                            {tab === 'login' ? (
                                <motion.div key="login" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.25rem' }}>
                                        {field(
                                            <Mail size={16} />,
                                            <input
                                                type="email" placeholder="Email address" value={loginEmail}
                                                onChange={e => setLoginEmail(e.target.value)}
                                                onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                                                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                                style={inputStyle}
                                            />
                                        )}
                                        {field(
                                            <Lock size={16} />,
                                            <input
                                                type={showPassword ? 'text' : 'password'} placeholder="Password" value={loginPassword}
                                                onChange={e => setLoginPassword(e.target.value)}
                                                onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                                                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                                style={{ ...inputStyle, paddingRight: '2.5rem' }}
                                            />,
                                            <div onClick={() => setShowPassword(p => !p)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</div>
                                        )}
                                    </div>

                                    {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.9rem', lineHeight: 1.4 }}>{error}</p>}

                                    <button
                                        className="btn-primary" onClick={handleLogin} disabled={loading}
                                        style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', opacity: loading ? 0.7 : 1, gap: '0.5rem' }}
                                    >
                                        {loading ? <Loader2 size={18} className="spin" /> : <LogIn size={18} />}
                                        {loading ? 'Signing in...' : 'Sign In'}
                                    </button>

                                    <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        Don't have an account?{' '}
                                        <button onClick={() => { setTab('register'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }}>
                                            Register
                                        </button>
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div key="register" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.18 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                                        {field(
                                            <User size={16} />,
                                            <input
                                                type="text" placeholder="Full name *" value={regName}
                                                onChange={e => setRegName(e.target.value)}
                                                onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                                                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                                style={inputStyle}
                                            />
                                        )}
                                        {field(
                                            <Mail size={16} />,
                                            <input
                                                type="email" placeholder="Email address *" value={regEmail}
                                                onChange={e => setRegEmail(e.target.value)}
                                                onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                                                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                                style={inputStyle}
                                            />
                                        )}
                                        {field(
                                            <Phone size={16} />,
                                            <input
                                                type="tel" placeholder="Phone (optional)" value={regPhone}
                                                onChange={e => setRegPhone(e.target.value.replace(/\D/g, ''))}
                                                onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                                                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                                style={inputStyle}
                                            />
                                        )}
                                        {field(
                                            <Lock size={16} />,
                                            <input
                                                type={showPassword ? 'text' : 'password'} placeholder="Password * (min 8 chars)" value={regPassword}
                                                onChange={e => setRegPassword(e.target.value)}
                                                onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                                                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                                style={{ ...inputStyle, paddingRight: '2.5rem' }}
                                            />,
                                            <div onClick={() => setShowPassword(p => !p)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</div>
                                        )}
                                        {field(
                                            <Lock size={16} />,
                                            <input
                                                type={showConfirm ? 'text' : 'password'} placeholder="Confirm password *" value={regConfirm}
                                                onChange={e => setRegConfirm(e.target.value)}
                                                onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                                                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                                onKeyDown={e => e.key === 'Enter' && handleRegister()}
                                                style={{ ...inputStyle, paddingRight: '2.5rem' }}
                                            />,
                                            <div onClick={() => setShowConfirm(p => !p)}>{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</div>
                                        )}
                                    </div>

                                    {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.9rem', lineHeight: 1.4 }}>{error}</p>}

                                    <button
                                        className="btn-primary" onClick={handleRegister} disabled={loading}
                                        style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', opacity: loading ? 0.7 : 1, gap: '0.5rem' }}
                                    >
                                        {loading ? <Loader2 size={18} className="spin" /> : <UserPlus size={18} />}
                                        {loading ? 'Creating account...' : 'Create Account'}
                                    </button>

                                    <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        Already have an account?{' '}
                                        <button onClick={() => { setTab('login'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }}>
                                            Sign In
                                        </button>
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <style>{`
                            .spin { animation: spin 0.9s linear infinite; }
                            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                        `}</style>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
