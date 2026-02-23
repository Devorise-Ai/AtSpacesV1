import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';

const AppleLogo = ({ size = 20, color = 'white' }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 814 1000" fill={color}>
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.3-81.3-105.9-207.5-105.9-329.1 0-193.9 126.1-296.8 249.6-296.8 65.9 0 120.8 43.4 162.2 43.4 39.5 0 101.1-46 176.6-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8.7 15.6 1.3 18.2 2.6.6 6.4 1.3 10.2 1.3 45.4 0 103.6-30.4 139.5-71.4z" />
    </svg>
);

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (bookingDetails: BookingDetails) => void;
    spaceName: string;
    price: number;
    date: string;
    startTime: string;
    duration: number;
}

export interface BookingDetails {
    spaceName: string;
    date: string;
    startTime: string;
    duration: number;
    total: number;
    paymentMethod: string;
}

const PaymentModal = ({ isOpen, onClose, onSuccess, spaceName, price, date, startTime, duration }: PaymentModalProps) => {
    const [method, setMethod] = useState<'apple' | 'card' | null>(null);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const total = price * duration;

    const formatCardNumber = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatExpiry = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        return digits;
    };

    const handlePay = () => {
        if (method === 'card') {
            if (cardNumber.replace(/\s/g, '').length < 16) {
                setError('Please enter a valid card number.');
                return;
            }
            if (expiry.length < 5) {
                setError('Please enter a valid expiry date.');
                return;
            }
            if (cvv.length < 3) {
                setError('Please enter a valid CVV.');
                return;
            }
        }
        if (!method) {
            setError('Please select a payment method.');
            return;
        }

        setError('');
        setLoading(true);

        // Simulate payment processing
        setTimeout(() => {
            setLoading(false);
            onSuccess({
                spaceName,
                date,
                startTime,
                duration,
                total,
                paymentMethod: method === 'apple' ? 'Apple Pay' : 'Visa/MasterCard'
            });
        }, 2000);
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '1rem',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        background: 'var(--bg-input)',
        color: 'var(--text-primary)',
        fontFamily: 'inherit',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.3s ease'
    };

    const methodBtnStyle = (selected: boolean): React.CSSProperties => ({
        flex: 1,
        padding: '1rem',
        borderRadius: '12px',
        border: selected ? '2px solid var(--primary)' : '2px solid var(--border)',
        background: selected ? 'rgba(255, 91, 4, 0.08)' : 'var(--bg-input)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: '0.95rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        transition: 'all 0.2s ease'
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }}
                        exit={{ opacity: 0, scale: 0.9, y: 30, transition: { duration: 0.2 } }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass-panel"
                        style={{
                            width: '100%',
                            maxWidth: '480px',
                            padding: '2.5rem',
                            position: 'relative',
                            borderRadius: '24px'
                        }}
                    >
                        {/* Close */}
                        <button
                            onClick={onClose}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                            Complete Payment
                        </h2>

                        {/* Booking Summary */}
                        <div style={{
                            padding: '1.25rem',
                            borderRadius: '16px',
                            background: 'rgba(255, 91, 4, 0.05)',
                            border: '1px solid rgba(255, 91, 4, 0.15)',
                            marginBottom: '2rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Workspace</span>
                                <span style={{ fontWeight: 600 }}>{spaceName}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Date</span>
                                <span style={{ fontWeight: 600 }}>{date || 'Not selected'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Time</span>
                                <span style={{ fontWeight: 600 }}>{startTime || 'Not selected'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Duration</span>
                                <span style={{ fontWeight: 600 }}>{duration} hour{duration > 1 ? 's' : ''}</span>
                            </div>
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>JOD {total}</span>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 500 }}>
                            Select payment method
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <button
                                onClick={() => { setMethod('apple'); setError(''); }}
                                style={{
                                    flex: 1,
                                    padding: '0.9rem 1rem',
                                    borderRadius: '12px',
                                    border: method === 'apple' ? '2px solid var(--primary)' : '2px solid var(--border)',
                                    background: method === 'apple' ? 'var(--primary)' : 'var(--bg-input)',
                                    color: method === 'apple' ? '#fff' : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <AppleLogo size={18} color={method === 'apple' ? '#fff' : 'var(--text-primary)'} /> Pay
                            </button>
                            <button style={methodBtnStyle(method === 'card')} onClick={() => { setMethod('card'); setError(''); }}>
                                <CreditCard size={20} /> Card
                            </button>
                        </div>

                        {/* Card Form */}
                        <AnimatePresence>
                            {method === 'card' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ overflow: 'hidden', marginBottom: '1.5rem' }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Card Number</label>
                                            <input
                                                placeholder="1234 5678 9012 3456"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                style={inputStyle}
                                                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Expiry</label>
                                                <input
                                                    placeholder="MM/YY"
                                                    value={expiry}
                                                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                                    style={inputStyle}
                                                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>CVV</label>
                                                <input
                                                    type="password"
                                                    placeholder="•••"
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                    style={inputStyle}
                                                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {error && (
                            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
                        )}

                        {/* Pay Button */}
                        {method === 'apple' ? (
                            <button
                                onClick={handlePay}
                                disabled={loading}
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    justifyContent: 'center',
                                    fontSize: '1.15rem',
                                    gap: '0.4rem',
                                    opacity: loading ? 0.6 : 1,
                                    boxShadow: '0 8px 25px rgba(255, 91, 4, 0.3)'
                                }}
                            >
                                {loading ? (
                                    <><Loader2 size={20} className="spin" /> Processing...</>
                                ) : (
                                    <>Continue with <AppleLogo size={20} color="#fff" /> Pay</>
                                )}
                            </button>
                        ) : (
                            <button
                                className="btn-primary"
                                onClick={handlePay}
                                disabled={loading || !method}
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    padding: '1rem',
                                    fontSize: '1.1rem',
                                    gap: '0.5rem',
                                    opacity: loading || !method ? 0.6 : 1
                                }}
                            >
                                {loading ? (
                                    <><Loader2 size={20} className="spin" /> Processing...</>
                                ) : (
                                    <><CheckCircle2 size={20} /> Pay JOD {total}</>
                                )}
                            </button>
                        )}

                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '1rem' }}>
                            Your payment is secure and encrypted.
                        </p>

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

export default PaymentModal;
