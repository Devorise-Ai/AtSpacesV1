import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, CalendarPlus, MapPin, Home, Clock, CreditCard } from 'lucide-react';
import type { BookingDetails } from '../components/PaymentModal';

const BookingConfirmation = () => {
    const location = useLocation();
    const details = location.state as BookingDetails | null;

    const handleAddToCalendar = () => {
        if (!details) return;
        const startDate = details.date.replace(/-/g, '');
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${startDate}T${details.startTime.replace(':', '')}00`,
            `SUMMARY:Booking at ${details.spaceName}`,
            `DESCRIPTION:Workspace booking via AtSpaces`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'atspaces-booking.ics';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleGetDirections = () => {
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(details?.spaceName + ' Amman Jordan')}`, '_blank');
    };

    if (!details) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <h1 style={{ fontSize: '2rem' }}>No Booking Found</h1>
                <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>Back to Home</Link>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            <main style={{ flex: 1, padding: '3rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>

                    {/* Success Animation */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'rgba(34, 197, 94, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 2rem auto',
                            border: '3px solid rgba(34, 197, 94, 0.3)'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.4 }}
                        >
                            <CheckCircle size={50} color="#22c55e" />
                        </motion.div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.75rem' }}
                    >
                        Booking Confirmed!
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '3rem', lineHeight: 1.6 }}
                    >
                        Your workspace has been reserved. Here are your booking details.
                    </motion.p>

                    {/* Booking Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="glass-panel"
                        style={{ padding: '2rem', textAlign: 'left', marginBottom: '2rem' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 91, 4, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Home size={20} color="var(--primary)" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Workspace</p>
                                    <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{details.spaceName}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 91, 4, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <CalendarPlus size={20} color="var(--primary)" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Date & Time</p>
                                    <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{details.date} at {details.startTime}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 91, 4, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Clock size={20} color="var(--primary)" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Duration</p>
                                    <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{details.duration} hour{details.duration > 1 ? 's' : ''}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 91, 4, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <CreditCard size={20} color="var(--primary)" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Paid ({details.paymentMethod})</p>
                                    <p style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>JOD {details.total}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.85 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                        <button className="btn-primary" onClick={handleAddToCalendar} style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.05rem', gap: '0.5rem' }}>
                            <CalendarPlus size={20} /> Add to Calendar
                        </button>

                        <button
                            onClick={handleGetDirections}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--primary)',
                                background: 'rgba(255, 91, 4, 0.08)',
                                color: 'var(--primary)',
                                fontWeight: 600,
                                fontSize: '1.05rem',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'var(--transition)'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 91, 4, 0.08)'; e.currentTarget.style.color = 'var(--primary)'; }}
                        >
                            <MapPin size={20} /> Get Directions
                        </button>

                        <Link to="/" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem',
                            borderRadius: '12px',
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            fontWeight: 500,
                            fontSize: '1rem',
                            gap: '0.5rem',
                            transition: 'color 0.2s ease'
                        }}>
                            <Home size={18} /> Back to Home
                        </Link>
                    </motion.div>

                </div>
            </main>

        </div>
    );
};

export default BookingConfirmation;
