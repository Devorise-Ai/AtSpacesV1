import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import PaymentModal from '../components/PaymentModal';
import type { BookingDetails } from '../components/PaymentModal';
import { Star, MapPin, Users, Wifi, Coffee, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { publicService } from '../services/public.service';
import { getToken } from '../lib/token';
import type { Branch, VendorService } from '../types';

/** Convert DB snake_case service name to display title */
const formatServiceName = (name: string): string => {
    const map: Record<string, string> = {
        hot_desk: 'Hot Desk',
        dedicated_desk: 'Dedicated Desk',
        private_office: 'Private Office',
        meeting_room: 'Meeting Room',
    };
    return map[name] ?? name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

const today = new Date().toISOString().split('T')[0];

const WorkspaceDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const serviceType = queryParams.get('service');

    const [branch, setBranch] = useState<Branch | null>(null);
    const [selectedService, setSelectedService] = useState<VendorService | null>(null);
    const [loading, setLoading] = useState(true);

    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState(1);
    const [showAuth, setShowAuth] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await publicService.getBranchDetails(Number(id));
                setBranch(data);

                // Find the service that matches the type in the query param
                if (serviceType && data.vendorServices) {
                    const vs = data.vendorServices.find((s: any) => s.service.name === serviceType);
                    setSelectedService(vs || data.vendorServices[0]);
                } else if (data.vendorServices?.[0]) {
                    setSelectedService(data.vendorServices[0]);
                }
            } catch (err) {
                console.error("Failed to fetch branch details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, serviceType]);

    const handleBookClick = () => {
        const token = getToken();
        if (!token) {
            setShowAuth(true);
        } else {
            setShowPayment(true);
        }
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

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem' }}>
                    <div className="container">
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '3rem', marginTop: '2rem' }} className="workspace-details-grid">
                            <div>
                                <div className="skeleton-shimmer" style={{ height: '400px', borderRadius: '24px', background: 'var(--bg-input)', marginBottom: '2rem' }} />
                                <div className="skeleton-shimmer" style={{ height: '36px', width: '60%', borderRadius: '8px', background: 'var(--bg-input)', marginBottom: '1rem' }} />
                                <div className="skeleton-shimmer" style={{ height: '20px', width: '40%', borderRadius: '8px', background: 'var(--bg-input)', marginBottom: '2rem' }} />
                                <div className="skeleton-shimmer" style={{ height: '120px', borderRadius: '8px', background: 'var(--bg-input)', marginBottom: '2rem' }} />
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    {[1, 2, 3].map(i => <div key={i} className="skeleton-shimmer" style={{ height: '40px', borderRadius: '8px', background: 'var(--bg-input)' }} />)}
                                </div>
                            </div>
                            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
                                <div className="skeleton-shimmer" style={{ height: '28px', width: '50%', borderRadius: '8px', background: 'var(--bg-input)', marginBottom: '1.5rem' }} />
                                <div className="skeleton-shimmer" style={{ height: '48px', width: '70%', borderRadius: '8px', background: 'var(--bg-input)', marginBottom: '2rem' }} />
                                <div className="skeleton-shimmer" style={{ height: '52px', borderRadius: '12px', background: 'var(--bg-input)', marginBottom: '1rem' }} />
                                <div className="skeleton-shimmer" style={{ height: '52px', borderRadius: '12px', background: 'var(--bg-input)', marginBottom: '2rem' }} />
                                <div className="skeleton-shimmer" style={{ height: '52px', borderRadius: '12px', background: 'var(--bg-input)' }} />
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!branch || !selectedService) {
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
                                <img src={branch.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'} alt={branch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                    {formatServiceName(selectedService.service.name)}
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>{branch.name}</h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 600, fontSize: '1.1rem', background: 'rgba(251, 191, 36, 0.1)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
                                    <Star size={20} fill="currentColor" />
                                    {branch.rating || 4.8} <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.9rem' }}>({branch.reviewsCount || 42} reviews)</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                                <MapPin size={20} /> {branch.address || branch.city || 'Amman, Jordan'}
                            </div>

                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>About this space</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.1rem', marginBottom: '3rem' }}>
                                {branch.description}
                            </p>

                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Amenities</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                                {branch.branchFacilities?.map((bf: any) => (
                                    <div key={bf.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                        <CheckCircle2 color="var(--primary)" size={20} />
                                        {bf.facility.name}
                                    </div>
                                ))}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                    <Wifi color="var(--primary)" size={20} /> Fast Wi-Fi
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                    <Coffee color="var(--primary)" size={20} /> Coffee & Tea
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                    <Users color="var(--primary)" size={20} /> Capacity: {selectedService.maxCapacity}
                                </div>
                            </div>
                        </div>

                        {/* Booking Sidebar */}
                        <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '120px' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Reserve</h3>

                            {/* Service Type Switcher */}
                            {branch.vendorServices && branch.vendorServices.filter(s => s.isActive !== false).length > 1 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Space Type</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {branch.vendorServices.filter(s => s.isActive !== false).map(vs => (
                                            <button
                                                key={vs.id}
                                                onClick={() => setSelectedService(vs)}
                                                style={{
                                                    padding: '0.4rem 0.85rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    background: selectedService?.id === vs.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                                    color: selectedService?.id === vs.id ? 'white' : 'var(--text-secondary)',
                                                    border: `1px solid ${selectedService?.id === vs.id ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                                                    fontFamily: 'inherit'
                                                }}
                                            >
                                                {formatServiceName(vs.service.name)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>JOD {selectedService.pricePerUnit}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>/ hour</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Date</label>
                                    <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
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
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>JOD {selectedService.pricePerUnit * duration}</span>
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
                spaceName={`${branch.name} — ${formatServiceName(selectedService.service.name)}`}
                price={selectedService.pricePerUnit}
                date={date}
                startTime={startTime}
                duration={duration}
                branchId={branch.id}
                serviceId={selectedService.id}
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
