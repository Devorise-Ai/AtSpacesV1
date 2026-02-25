import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, Phone, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Resend countdown timer
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep('phone');
                setPhone('');
                setOtp(['', '', '', '']);
                setLoading(false);
                setError('');
                setResendTimer(0);
            }, 300);
        }
    }, [isOpen]);

    const handleSendOtp = () => {
        if (phone.length < 7) {
            setError('Please enter a valid Jordanian phone number.');
            return;
        }
        setError('');
        setLoading(true);
        // Simulate sending OTP
        setTimeout(() => {
            setLoading(false);
            setStep('otp');
            setResendTimer(30);
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        }, 1000);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = () => {
        const code = otp.join('');
        if (code.length !== 4) {
            setError('Please enter the full 4-digit code.');
            return;
        }
        setError('');
        setLoading(true);
        // Simulate OTP verification
        setTimeout(() => {
            setLoading(false);
            onSuccess();
        }, 1000);
    };

    const handleResendOtp = () => {
        if (resendTimer > 0) return;
        setResendTimer(30);
        setOtp(['', '', '', '']);
        // Simulate resend
    };

    const overlayVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants: Variants = {
        hidden: { opacity: 0, scale: 0.9, y: 30 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
        exit: { opacity: 0, scale: 0.9, y: 30, transition: { duration: 0.2 } }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.65rem 0.85rem',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        background: 'var(--bg-input)',
        color: 'var(--text-primary)',
        fontFamily: 'inherit',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.3s ease'
    };

    const otpInputStyle: React.CSSProperties = {
        width: '60px',
        height: '60px',
        textAlign: 'center' as const,
        fontSize: '1.5rem',
        fontWeight: 700,
        borderRadius: '12px',
        border: '2px solid var(--border)',
        background: 'var(--bg-input)',
        color: 'var(--text-primary)',
        fontFamily: 'inherit',
        outline: 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '1rem'
                    }}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                        className="glass-panel"
                        style={{
                            width: '100%',
                            maxWidth: '440px',
                            padding: '2.5rem',
                            position: 'relative',
                            borderRadius: '24px'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: '8px',
                                display: 'flex',
                                transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                            <X size={20} />
                        </button>

                        <AnimatePresence mode="wait">
                            {step === 'phone' ? (
                                <motion.div
                                    key="phone"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Icon */}
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '16px',
                                        background: 'rgba(255, 91, 4, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <Phone color="var(--primary)" size={28} />
                                    </div>

                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                        Verify your phone
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                                        Enter your Jordanian phone number and we'll send you a one-time verification code.
                                    </p>

                                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>
                                        Phone Number
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                                        <div style={{
                                            ...inputStyle,
                                            width: '80px',
                                            flex: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 600,
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.85rem',
                                            gap: '0.25rem'
                                        }}>
                                            🇯🇴 +962
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="7X XXX XXXX"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                            maxLength={10}
                                            style={inputStyle}
                                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                                        />
                                    </div>

                                    {error && (
                                        <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
                                    )}

                                    <button
                                        className="btn-primary"
                                        onClick={handleSendOtp}
                                        disabled={loading}
                                        style={{
                                            width: '100%',
                                            justifyContent: 'center',
                                            padding: '1rem',
                                            fontSize: '1.05rem',
                                            gap: '0.5rem',
                                            opacity: loading ? 0.7 : 1
                                        }}
                                    >
                                        {loading ? <Loader2 size={20} className="spin" /> : <ArrowRight size={20} />}
                                        {loading ? 'Sending...' : 'Send Verification Code'}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="otp"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Icon */}
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '16px',
                                        background: 'rgba(255, 91, 4, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <ShieldCheck color="var(--primary)" size={28} />
                                    </div>

                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                        Enter verification code
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                                        We sent a 4-digit code to <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>+962 {phone}</span>
                                    </p>

                                    {/* OTP Inputs */}
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                        {otp.map((digit, i) => (
                                            <input
                                                key={i}
                                                ref={(el) => { otpRefs.current[i] = el; }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 91, 4, 0.15)';
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = 'var(--border)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                                style={otpInputStyle}
                                            />
                                        ))}
                                    </div>

                                    {error && (
                                        <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>
                                    )}

                                    <button
                                        className="btn-primary"
                                        onClick={handleVerifyOtp}
                                        disabled={loading}
                                        style={{
                                            width: '100%',
                                            justifyContent: 'center',
                                            padding: '1rem',
                                            fontSize: '1.05rem',
                                            gap: '0.5rem',
                                            marginBottom: '1.5rem',
                                            opacity: loading ? 0.7 : 1
                                        }}
                                    >
                                        {loading ? <Loader2 size={20} className="spin" /> : <ShieldCheck size={20} />}
                                        {loading ? 'Verifying...' : 'Verify & Continue'}
                                    </button>

                                    {/* Resend */}
                                    <div style={{ textAlign: 'center' }}>
                                        {resendTimer > 0 ? (
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                Resend code in <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{resendTimer}s</span>
                                            </p>
                                        ) : (
                                            <button
                                                onClick={handleResendOtp}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--primary)',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    fontFamily: 'inherit',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                Resend Code
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Spinner animation */}
                        <style>{`
                            .spin {
                                animation: spin 1s linear infinite;
                            }
                            @keyframes spin {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                            }
                        `}</style>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
