import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { WORKSPACES } from '../data/workspaces';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import PaymentModal from '../components/PaymentModal';
import type { BookingDetails } from '../components/PaymentModal';
import { Star, MapPin, Users, Wifi, Coffee, ArrowLeft, CheckCircle2 } from 'lucide-react';

const WorkspaceDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const space = WORKSPACES.find(w => w.id === id);

    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState(1);
    const [showAuth, setShowAuth] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    const handleBookClick = () => {
        setShowAuth(true);
    };

    const handleAuthSuccess = () => {
        setShowAuth(false);
        setTimeout(() => setShowPayment(true), 300);
    };

    const handlePaymentSuccess = (details: BookingDetails) => {
        setShowPayment(false);
        // Navigate to confirmation page with booking details
        navigate('/booking/confirmation', { state: details });
    };

    if (!space) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', paddingTop: '100px' }}>
                    <h1 style={{ fontSize: '2rem' }}>Workspace Not Found</h1>
                    <Link to="/workspaces" className="btn-primary" style={{ textDecoration: 'none' }}>Return to Workspaces</Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem' }}>
                <div className="container">

                    {/* Back Button */}
                    <Link to="/workspaces" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem', transition: 'var(--transition)' }} className="nav-link">
                        <ArrowLeft size={20} /> Back to all spaces
                    </Link>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '3rem', alignItems: 'start' }} className="workspace-details-grid">

                        {/* Main Content Area */}
                        <div>
                            {/* Image Header */}
                            <div style={{ borderRadius: '24px', overflow: 'hidden', height: '400px', marginBottom: '2rem', position: 'relative' }}>
                                <img src={space.image} alt={space.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute',
                                    top: '1.5rem',
                                    right: '1.5rem',
                                    background: 'rgba(11, 17, 31, 0.8)',
                                    backdropFilter: 'blur(8px)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    {space.type}
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>{space.title}</h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 600, fontSize: '1.1rem', background: 'rgba(251, 191, 36, 0.1)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
                                    <Star size={20} fill="currentColor" />
                                    {space.rating} <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.9rem' }}>({space.reviews} reviews)</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                                <MapPin size={20} /> {space.location}
                            </div>

                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>About this space</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.1rem', marginBottom: '3rem' }}>
                                {space.description}
                            </p>

                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Amenities</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                                {space.amenities.map(amenity => (
                                    <div key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                        <CheckCircle2 color="var(--primary)" size={20} />
                                        {amenity}
                                    </div>
                                ))}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                    <Wifi color="var(--primary)" size={20} /> Fast Wi-Fi
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                    <Coffee color="var(--primary)" size={20} /> Coffee & Tea
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                    <Users color="var(--primary)" size={20} /> Capacity: {space.capacity}
                                </div>
                            </div>
                        </div>

                        {/* Booking Sidebar */}
                        <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '120px' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Reserve</h3>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>JOD {space.price}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>/ hour</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Date</label>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Start Time</label>
                                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Duration</label>
                                        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontFamily: 'inherit', appearance: 'none' as const }}>
                                            <option value="1">1 Hour</option>
                                            <option value="2">2 Hours</option>
                                            <option value="3">3 Hours</option>
                                            <option value="4">4 Hours</option>
                                            <option value="8">Full Day (8 Hrs)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic total */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Total</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>JOD {space.price * duration}</span>
                            </div>

                            <button className="btn-primary" onClick={handleBookClick} style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem', marginBottom: '1rem' }}>
                                Confirm Booking
                            </button>

                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                You won't be charged yet.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                onSuccess={handleAuthSuccess}
            />

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                onSuccess={handlePaymentSuccess}
                spaceName={space.title}
                price={space.price}
                date={date}
                startTime={startTime}
                duration={duration}
            />

            <style>{`
                @media (max-width: 900px) {
                    .workspace-details-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default WorkspaceDetails;
