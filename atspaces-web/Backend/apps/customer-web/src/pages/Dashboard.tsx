import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, MapPin, Calendar, CheckCircle, Clock, XCircle, ArrowRight, Bot, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getUser } from '../lib/token';
import { authService } from '../services/auth.service';
import { bookingService } from '../services/booking.service';

interface Booking {
    id: number;
    status: string;
    date: string;
    startTime: string;
    duration: number;
    totalPrice: number;
    branch?: { name: string; city: string };
    vendorService?: { service?: { name: string } };
}

const formatServiceName = (name: string) =>
    name?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ?? name;

const statusColor: Record<string, string> = {
    CONFIRMED: '#22c55e',
    PENDING: '#f59e0b',
    CANCELLED: '#ef4444',
    COMPLETED: '#3b82f6',
};

const statusIcon: Record<string, React.ReactNode> = {
    CONFIRMED: <CheckCircle size={14} />,
    PENDING: <Clock size={14} />,
    CANCELLED: <XCircle size={14} />,
    COMPLETED: <CheckCircle size={14} />,
};

export default function Dashboard() {
    const navigate = useNavigate();
    const user = getUser();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authService.isLoggedIn()) {
            navigate('/');
            return;
        }
        bookingService.getMyBookings()
            .then((data: Booking[]) => setBookings(data))
            .catch(() => setBookings([]))
            .finally(() => setLoading(false));
    }, [navigate]);

    const total = bookings.length;
    const upcoming = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
    const completed = bookings.filter(b => b.status === 'COMPLETED').length;
    const cancelled = bookings.filter(b => b.status === 'CANCELLED').length;

    const upcomingBookings = bookings
        .filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING')
        .slice(0, 3);

    const memberSince = user ? new Date().getFullYear() : null;
    const userInitial = user?.fullName?.charAt(0)?.toUpperCase() ?? '?';

    const cardStyle: React.CSSProperties = {
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '1.5rem',
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
            <Navbar />
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '7rem 1.5rem 4rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                    <LayoutDashboard size={26} color="var(--primary)" />
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My Dashboard</h1>
                </div>

                {/* Profile + Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

                    {/* Profile Card */}
                    <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '72px', height: '72px', borderRadius: '50%',
                            background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.75rem', fontWeight: 800, color: 'white',
                        }}>
                            {userInitial}
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{user?.fullName ?? 'Customer'}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.2rem' }}>{user?.email}</div>
                        </div>
                        <div style={{
                            background: 'rgba(255,91,4,0.08)', color: 'var(--primary)',
                            borderRadius: '20px', padding: '0.3rem 0.9rem', fontSize: '0.8rem', fontWeight: 600,
                        }}>
                            Customer
                        </div>
                        {memberSince && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                Member since {memberSince}
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {[
                            { label: 'Total Bookings', value: total, color: 'var(--primary)', icon: <BookOpen size={20} /> },
                            { label: 'Upcoming', value: upcoming, color: '#f59e0b', icon: <Clock size={20} /> },
                            { label: 'Completed', value: completed, color: '#22c55e', icon: <CheckCircle size={20} /> },
                            { label: 'Cancelled', value: cancelled, color: '#ef4444', icon: <XCircle size={20} /> },
                        ].map(stat => (
                            <div key={stat.label} style={{ ...cardStyle, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: stat.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                                        {loading ? <Loader2 size={18} className="spin" /> : stat.value}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Bookings */}
                <div style={{ ...cardStyle, marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Upcoming Bookings</h2>
                        <Link to="/my-bookings" style={{ textDecoration: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                            <Loader2 size={22} className="spin" />
                        </div>
                    ) : upcomingBookings.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                            <Calendar size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                            <p style={{ fontSize: '0.9rem' }}>No upcoming bookings</p>
                            <Link to="/workspaces">
                                <button className="btn-primary" style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                                    Browse Spaces
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {upcomingBookings.map(b => (
                                <div key={b.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '0.9rem 1rem', background: 'var(--bg-input)', borderRadius: '12px',
                                    flexWrap: 'wrap', gap: '0.5rem',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <MapPin size={16} color="var(--primary)" />
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                {b.branch?.name ?? 'Space'}
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                                {formatServiceName(b.vendorService?.service?.name ?? '')} · {b.date} · {b.startTime} · {b.duration}h
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                                            JOD {b.totalPrice}
                                        </div>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                                            background: (statusColor[b.status] ?? '#888') + '18',
                                            color: statusColor[b.status] ?? '#888',
                                            borderRadius: '20px', padding: '0.25rem 0.75rem',
                                            fontSize: '0.75rem', fontWeight: 600,
                                        }}>
                                            {statusIcon[b.status] ?? null} {b.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {[
                        { to: '/workspaces', label: 'Book a Space', icon: <MapPin size={20} />, color: 'var(--primary)' },
                        { to: '/my-bookings', label: 'My Bookings', icon: <BookOpen size={20} />, color: '#3b82f6' },
                        { to: '/ai-assistant', label: 'AI Assistant', icon: <Bot size={20} />, color: '#8b5cf6' },
                    ].map(action => (
                        <Link key={action.to} to={action.to} style={{ textDecoration: 'none' }}>
                            <div style={{
                                ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                gap: '0.6rem', padding: '1.25rem', cursor: 'pointer', textAlign: 'center',
                                transition: 'transform 0.2s ease, border-color 0.2s ease',
                            }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.borderColor = action.color; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}
                            >
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: action.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: action.color }}>
                                    {action.icon}
                                </div>
                                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{action.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <Footer />

            <style>{`.spin { animation: spin 0.9s linear infinite; } @keyframes spin { from { transform:rotate(0) } to { transform:rotate(360deg) } }`}</style>
        </div>
    );
}
