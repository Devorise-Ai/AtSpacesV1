import { Search, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';

const Hero = () => {
    const [location, setLocation] = useState('');
    const [dateTime, setDateTime] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location.trim()) params.set('location', location.trim());
        if (dateTime) params.set('date', dateTime);
        navigate(`/workspaces${params.toString() ? '?' + params.toString() : ''}`);
    };

    return (
        <section className="hero-section" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            paddingTop: '100px'
        }}>
            {/* Background Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.3,
                zIndex: -1
            }} />
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at center, transparent, var(--bg-deep))',
                zIndex: -1
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ maxWidth: '800px', width: '100%' }}
                className="container"
            >
                <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                    <span
                        className="animate-pulse-orange"
                        style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary-glow)' }}
                    ></span>
                    New Spaces Added Daily in Amman
                </div>
                <h1 className="mobile-hide-br" style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                    Find Your Perfect <br />
                    <span style={{ color: 'var(--primary)' }}>Workspace</span> Instantly
                </h1>
                <p className="mobile-hide-br" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem' }}>
                    Book premium meeting rooms, private offices, and coworking desks <br />
                    designed for productivity and collaboration.
                </p>

                {/* Search Bar */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel mobile-stack"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px',
                        width: '100%',
                        maxWidth: '800px',
                        margin: '0 auto',
                        gap: '12px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }}
                >
                    <div className="mobile-border-bottom" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRight: '1px solid var(--border)' }}>
                        <MapPin size={20} color="var(--primary)" />
                        <Input
                            type="text"
                            placeholder="Where do you want to work?"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="bg-transparent border-none text-white w-full outline-none focus-visible:ring-0 shadow-none px-0"
                        />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px' }}>
                        <Calendar size={20} color="var(--primary)" />
                        <Input
                            type="datetime-local"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                            className={`bg-transparent border-none w-full outline-none focus-visible:ring-0 shadow-none px-0 ${dateTime ? 'text-white' : 'text-muted-foreground'}`}
                            style={{ colorScheme: 'dark', cursor: 'pointer' }}
                        />
                    </div>
                    <Button size="lg" onClick={handleSearch} className="h-full py-4 px-6 rounded-r-md rounded-l-none text-base">
                        <Search size={18} className="mr-2" />
                        Search
                    </Button>
                </motion.div>

                {/* Trusted By */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1, duration: 1 }}
                    style={{ marginTop: '4rem' }}
                >
                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>Trusted by Forward-Thinking Teams</p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        filter: 'grayscale(100%) brightness(200%)'
                    }}>
                        <motion.img whileHover={{ filter: 'grayscale(0%) brightness(100%)', scale: 1.1 }} transition={{ duration: 0.3 }} src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" style={{ height: '20px', cursor: 'pointer' }} />
                        <motion.img whileHover={{ filter: 'grayscale(0%) brightness(100%)', scale: 1.1 }} transition={{ duration: 0.3 }} src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" style={{ height: '20px', cursor: 'pointer' }} />
                        <motion.img whileHover={{ filter: 'grayscale(0%) brightness(100%)', scale: 1.1 }} transition={{ duration: 0.3 }} src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" style={{ height: '20px', cursor: 'pointer' }} />
                        <motion.img whileHover={{ filter: 'grayscale(0%) brightness(100%)', scale: 1.1 }} transition={{ duration: 0.3 }} src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" alt="Spotify" style={{ height: '20px', cursor: 'pointer' }} />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
