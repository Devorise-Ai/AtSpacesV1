import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import PaymentModal from '../components/PaymentModal';
import type { BookingDetails } from '../components/PaymentModal';
import { Star, MapPin, Users, Wifi, Coffee, ArrowLeft, CheckCircle2, Calendar, ChevronRight } from 'lucide-react';
import { publicService } from '../services/public.service';
import { bookingService } from '../services/booking.service';
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

    // Phase 3: Multi-step booking state
    const [bookingStep, setBookingStep] = useState(1);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [availabilityError, setAvailabilityError] = useState('');

    // Generate mock available slots (e.g., 9:00 AM to 6:00 PM)
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

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

    const handleNextStep = async () => {
        if (bookingStep === 1) {
            if (!date) {
                setAvailabilityError('Please select a date');
                return;
            }
            setBookingStep(2);
        } else if (bookingStep === 2) {
            if (!startTime) {
                setAvailabilityError('Please select a start time');
                return;
            }

            // Check real availability at the end of Step 2
            try {
                setCheckingAvailability(true);
                setAvailabilityError('');

                // Construct end time
                const startDateTime = new Date(`${date}T${startTime}`);
                const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000);

                const isAvailable = await bookingService.checkAvailability(
                    selectedService!.id,
                    startDateTime.toISOString(),
                    endDateTime.toISOString()
                );

                if (isAvailable) {
                    setBookingStep(3);
                } else {
                    setAvailabilityError('This slot is unfortunately fully booked. Please try another time.');
                }
            } catch (err) {
                setAvailabilityError('Failed to verify availability. Please try again.');
            } finally {
                setCheckingAvailability(false);
            }
        }
    };

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
                        <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '120px', minHeight: '450px', display: 'flex', flexDirection: 'column' }}>

                            {/* Stepper Header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                {[1, 2, 3].map((s) => (
                                    <div key={s} style={{ display: 'flex', alignItems: 'center', flex: s === 3 ? '0 0 auto' : 1 }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: bookingStep >= s ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                            color: bookingStep >= s ? 'white' : 'var(--text-secondary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.9rem',
                                            fontWeight: 700,
                                            border: `1px solid ${bookingStep >= s ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                                            transition: 'all 0.3s ease'
                                        }}>
                                            {bookingStep > s ? <CheckCircle2 size={18} /> : s}
                                        </div>
                                        {s < 3 && (
                                            <div style={{
                                                height: '2px',
                                                flex: 1,
                                                background: bookingStep > s ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                                margin: '0 8px'
                                            }} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Step Container */}
                            <div style={{ flex: 1 }}>
                                {bookingStep === 1 && (
                                    <div style={{ animation: 'fadeIn 0.4s ease' }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select space type</h3>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>What kind of space do you need?</p>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                                            {branch.vendorServices?.filter(s => s.isActive !== false).map(vs => (
                                                <button
                                                    key={vs.id}
                                                    onClick={() => setSelectedService(vs)}
                                                    style={{
                                                        padding: '1rem',
                                                        borderRadius: '16px',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        background: selectedService?.id === vs.id ? 'rgba(255, 91, 4, 0.1)' : 'rgba(255,255,255,0.03)',
                                                        border: `2px solid ${selectedService?.id === vs.id ? 'var(--primary)' : 'transparent'}`,
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: selectedService?.id === vs.id ? 'var(--primary)' : 'var(--text-primary)' }}>
                                                            {formatServiceName(vs.service.name)}
                                                        </div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Capacity: {vs.maxCapacity} persons</div>
                                                    </div>
                                                    <div style={{ fontWeight: 700 }}>JOD {vs.pricePerUnit}</div>
                                                </button>
                                            ))}
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.75rem' }}>Pick a Date</label>
                                            <div style={{ position: 'relative' }}>
                                                <Calendar style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                                                <input type="date" value={date} min={today} onChange={(e) => { setDate(e.target.value); setAvailabilityError(''); }} style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {bookingStep === 2 && (
                                    <div style={{ animation: 'fadeIn 0.4s ease' }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select time slot</h3>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Choose your start time and duration</p>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Available Slots</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                                {timeSlots.map(time => (
                                                    <button
                                                        key={time}
                                                        onClick={() => { setStartTime(time); setAvailabilityError(''); }}
                                                        style={{
                                                            padding: '0.6rem',
                                                            borderRadius: '10px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            background: startTime === time ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                                            color: startTime === time ? 'white' : 'var(--text-primary)',
                                                            border: `1px solid ${startTime === time ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                                                            fontFamily: 'inherit'
                                                        }}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Duration</label>
                                            <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontFamily: 'inherit', appearance: 'none' }}>
                                                <option value="1">1 Hour</option>
                                                <option value="2">2 Hours</option>
                                                <option value="3">3 Hours</option>
                                                <option value="4">4 Hours</option>
                                                <option value="8">Full Day (8 Hrs)</option>
                                            </select>
                                        </div>

                                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Selected Date</span>
                                                <span style={{ fontWeight: 600 }}>{date}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Hourly Rate</span>
                                                <span style={{ fontWeight: 600 }}>JOD {selectedService?.pricePerUnit}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {bookingStep === 3 && (
                                    <div style={{ animation: 'fadeIn 0.4s ease' }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Review & Confirm</h3>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Finalize your reservation details</p>

                                        <div style={{
                                            padding: '1.5rem',
                                            borderRadius: '20px',
                                            background: 'rgba(255, 91, 4, 0.05)',
                                            border: '1px solid rgba(255, 91, 4, 0.15)',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Space</div>
                                                    <div style={{ fontWeight: 600 }}>{formatServiceName(selectedService!.service.name)}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</div>
                                                    <div style={{ fontWeight: 600 }}>{date}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>From</div>
                                                    <div style={{ fontWeight: 600 }}>{startTime}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</div>
                                                    <div style={{ fontWeight: 600 }}>{duration} Hours</div>
                                                </div>
                                            </div>
                                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total Price</span>
                                                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>JOD {selectedService!.pricePerUnit * duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                                {availabilityError && (
                                    <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                        {availabilityError}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {bookingStep > 1 && (
                                        <button
                                            onClick={() => setBookingStep(prev => prev - 1)}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '12px',
                                                border: '1px solid var(--border)',
                                                background: 'transparent',
                                                color: 'var(--text-primary)',
                                                cursor: 'pointer',
                                                fontFamily: 'inherit'
                                            }}
                                        >
                                            <ArrowLeft size={20} />
                                        </button>
                                    )}
                                    {bookingStep < 3 ? (
                                        <button
                                            className="btn-primary"
                                            onClick={handleNextStep}
                                            disabled={checkingAvailability}
                                            style={{ flex: 1, justifyContent: 'center', padding: '1rem', fontSize: '1.1rem' }}
                                        >
                                            {checkingAvailability ? 'Checking...' : 'Next Step'} <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-primary"
                                            onClick={handleBookClick}
                                            style={{ flex: 1, justifyContent: 'center', padding: '1rem', fontSize: '1.1rem', background: 'var(--primary)', boxShadow: '0 8px 25px rgba(255, 91, 4, 0.3)' }}
                                        >
                                            Confirm & Pay <CheckCircle2 size={20} style={{ marginLeft: '0.5rem' }} />
                                        </button>
                                    )}
                                </div>

                                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
                                    {bookingStep === 3 ? 'Safe & Encrypted payment' : 'Secure booking process'}
                                </p>
                            </div>
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
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default WorkspaceDetails;
