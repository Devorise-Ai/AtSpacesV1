import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw, ArrowLeft, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bookingService } from '../services/booking.service';
import { getToken } from '../lib/token';
import type { Booking, BookingStatus } from '../types';

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; icon: React.ReactNode }> = {
    PENDING: { label: 'Pending', color: '#f59e0b', icon: <AlertCircle size={16} /> },
    CONFIRMED: { label: 'Confirmed', color: '#10b981', icon: <CheckCircle2 size={16} /> },
    CANCELLED: { label: 'Cancelled', color: '#ef4444', icon: <XCircle size={16} /> },
    COMPLETED: { label: 'Completed', color: '#6366f1', icon: <CheckCircle2 size={16} /> },
    NO_SHOW: { label: 'No Show', color: '#94a3b8', icon: <XCircle size={16} /> },
};

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-JO', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
};

const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-JO', { hour: '2-digit', minute: '2-digit' });
};

const BookingSkeleton = () => (
    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="skeleton-shimmer" style={{ height: '20px', width: '40%', borderRadius: '6px', background: 'var(--bg-input)' }} />
            <div className="skeleton-shimmer" style={{ height: '24px', width: '90px', borderRadius: '20px', background: 'var(--bg-input)' }} />
        </div>
        <div className="skeleton-shimmer" style={{ height: '16px', width: '60%', borderRadius: '6px', background: 'var(--bg-input)', marginBottom: '0.75rem' }} />
        <div className="skeleton-shimmer" style={{ height: '16px', width: '45%', borderRadius: '6px', background: 'var(--bg-input)', marginBottom: '0.75rem' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <div className="skeleton-shimmer" style={{ height: '20px', width: '25%', borderRadius: '6px', background: 'var(--bg-input)' }} />
            <div className="skeleton-shimmer" style={{ height: '36px', width: '100px', borderRadius: '8px', background: 'var(--bg-input)' }} />
        </div>
    </div>
);

const MyBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL');
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if not logged in
        if (!getToken()) {
            navigate('/');
            return;
        }

        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await bookingService.getMyBookings();
                setBookings(data);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Failed to load bookings. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [navigate]);

    const handleCancel = async (id: number) => {
        try {
            setCancellingId(id);
            setConfirmCancelId(null);
            await bookingService.cancelBooking(id, 'Customer requested cancellation');
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' as BookingStatus } : b));
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to cancel booking. Please try again.');
        } finally {
            setCancellingId(null);
        }
    };

    const filteredBookings = filter === 'ALL'
        ? bookings
        : bookings.filter(b => b.status === filter);

    const statusFilters: Array<BookingStatus | 'ALL'> = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, paddingTop: '100px' }}>
                <section style={{ padding: '4rem 0 6rem 0' }}>
                    <div className="container" style={{ maxWidth: '900px' }}>
                        {/* Header */}
                        <div style={{ marginBottom: '2.5rem' }}>
                            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                <ArrowLeft size={16} /> Back to Home
                            </Link>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                                My <span style={{ color: 'var(--primary)' }}>Bookings</span>
                            </h1>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                {loading ? 'Loading your bookings...' : `${bookings.length} booking${bookings.length !== 1 ? 's' : ''} total`}
                            </p>
                        </div>

                        {/* Status Filter Chips */}
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                            {statusFilters.map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    style={{
                                        padding: '0.4rem 1rem',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        background: filter === status ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                        color: filter === status ? 'white' : 'var(--text-secondary)',
                                        border: `1px solid ${filter === status ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    {status === 'ALL' ? 'All' : STATUS_CONFIG[status as BookingStatus].label}
                                    {status !== 'ALL' && !loading && (
                                        <span style={{ marginLeft: '0.4rem', opacity: 0.7 }}>
                                            ({bookings.filter(b => b.status === status).length})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Error State */}
                        {error && (
                            <div style={{
                                padding: '1rem 1.5rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '12px',
                                color: '#ef4444',
                                marginBottom: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <AlertCircle size={20} />
                                {error}
                                <button
                                    onClick={() => window.location.reload()}
                                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                                >
                                    <RefreshCw size={14} /> Retry
                                </button>
                            </div>
                        )}

                        {/* Skeleton Loaders */}
                        {loading && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {Array.from({ length: 3 }).map((_, i) => <BookingSkeleton key={i} />)}
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && filteredBookings.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}
                            >
                                <Calendar size={64} style={{ opacity: 0.15, margin: '0 auto 1.5rem auto', display: 'block' }} />
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                                    {filter === 'ALL' ? 'No bookings yet' : `No ${STATUS_CONFIG[filter as BookingStatus].label.toLowerCase()} bookings`}
                                </h3>
                                <p style={{ marginBottom: '2rem' }}>
                                    {filter === 'ALL'
                                        ? "You haven't made any bookings yet. Find your perfect workspace and get started!"
                                        : 'Try selecting a different status filter.'}
                                </p>
                                <Link to="/workspaces" style={{ textDecoration: 'none' }}>
                                    <button className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                                        Browse Workspaces
                                    </button>
                                </Link>
                            </motion.div>
                        )}

                        {/* Booking Cards */}
                        {!loading && !error && filteredBookings.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {filteredBookings.map((booking, index) => {
                                    const statusCfg = STATUS_CONFIG[booking.status];
                                    return (
                                        <motion.div
                                            key={booking.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="glass-panel"
                                            style={{ padding: '1.5rem', borderRadius: '16px' }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                                        {booking.branch?.name} — {booking.vendorService?.service?.name}
                                                    </h3>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                                                        #{booking.bookingNumber}
                                                    </span>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    padding: '0.35rem 0.85rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    background: `${statusCfg.color}20`,
                                                    color: statusCfg.color,
                                                    border: `1px solid ${statusCfg.color}40`
                                                }}>
                                                    {statusCfg.icon}
                                                    {statusCfg.label}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                    <MapPin size={15} />
                                                    {booking.branch?.address || booking.branch?.city || 'Amman, Jordan'}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                    <Calendar size={15} />
                                                    {formatDate(booking.startTime)}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                    <Clock size={15} />
                                                    {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                                <div>
                                                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>JOD {booking.totalPrice}</span>
                                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '0.4rem' }}>
                                                        via {booking.paymentMethod}
                                                    </span>
                                                </div>
                                                {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                        <Link to={`/workspaces/${booking.branch?.id}`} style={{ textDecoration: 'none' }}>
                                                            <button className="btn-outline-primary" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                                                                View Space
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => setConfirmCancelId(booking.id)}
                                                            disabled={cancellingId === booking.id}
                                                            style={{
                                                                fontSize: '0.85rem', padding: '0.4rem 1rem',
                                                                borderRadius: '8px', border: '1px solid rgba(239,68,68,0.4)',
                                                                background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                                                                cursor: cancellingId === booking.id ? 'not-allowed' : 'pointer',
                                                                opacity: cancellingId === booking.id ? 0.6 : 1,
                                                                fontFamily: 'inherit', fontWeight: 500,
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                                                        </button>
                                                    </div>
                                                )}
                                                {booking.status === 'COMPLETED' && (
                                                    <Link to={`/workspaces/${booking.branch?.id}`} style={{ textDecoration: 'none' }}>
                                                        <button className="btn-outline-primary" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                                                            Book Again
                                                        </button>
                                                    </Link>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />

            {/* Cancel Confirmation Modal */}
            <AnimatePresence>
                {confirmCancelId !== null && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setConfirmCancelId(null)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-panel"
                            style={{
                                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                zIndex: 101, padding: '2rem', borderRadius: '20px', maxWidth: '420px', width: '90%'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Cancel Booking</h3>
                                <button onClick={() => setConfirmCancelId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                Are you sure you want to cancel this booking? This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setConfirmCancelId(null)}
                                    style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
                                >
                                    Keep Booking
                                </button>
                                <button
                                    onClick={() => handleCancel(confirmCancelId)}
                                    style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}
                                >
                                    Yes, Cancel
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyBookings;
