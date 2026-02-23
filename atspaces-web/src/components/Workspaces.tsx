import { motion } from 'framer-motion';
import { Star, MapPin, Users, Wifi, Coffee, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { WORKSPACES } from '../data/workspaces';

const Workspaces = () => {
    return (
        <section id="workspaces" style={{ padding: '6rem 0' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                            Premium <span style={{ color: 'var(--primary)' }}>Workspaces</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>
                            Discover our top-rated spaces designed for productivity, collaboration, and focus.
                        </p>
                    </div>
                    {/* Desktop View All Link */}
                    <Link to="/workspaces" style={{
                        display: window.innerWidth > 768 ? 'flex' : 'none',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        textDecoration: 'none'
                    }}>
                        View All Spaces <ArrowRight size={18} />
                    </Link>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    {WORKSPACES.slice(0, 3).map((space, index) => (
                        <motion.div
                            key={space.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-panel"
                            style={{
                                borderRadius: '16px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}
                        >
                            {/* Image Container */}
                            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.4 }}
                                    src={space.image}
                                    alt={space.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'rgba(11, 17, 31, 0.8)',
                                    backdropFilter: 'blur(8px)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    {space.type}
                                </div>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{space.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontWeight: 600, fontSize: '0.9rem' }}>
                                        <Star size={16} fill="currentColor" />
                                        {space.rating}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                    <MapPin size={16} />
                                    {space.location}
                                </div>

                                {/* Amenities */}
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        <Users size={16} /> {space.capacity}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        <Wifi size={16} /> Yes
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        <Coffee size={16} /> Yes
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                    <div>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>JOD {space.price}</span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}> / hour</span>
                                    </div>
                                    <Link to={`/workspaces/${space.id}`} style={{ textDecoration: 'none' }}>
                                        <button style={{
                                            padding: '0.5rem 1rem',
                                            background: 'rgba(255, 91, 4, 0.1)',
                                            color: 'var(--primary)',
                                            border: '1px solid var(--primary)',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'var(--transition)'
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'var(--primary)';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 91, 4, 0.1)';
                                                e.currentTarget.style.color = 'var(--primary)';
                                            }}
                                        >
                                            Book Now
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile View All / Call to Action */}
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Link to="/workspaces" style={{ textDecoration: 'none' }}>
                        <motion.button
                            className="btn-primary"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                padding: '1rem 2.5rem',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                margin: '0 auto'
                            }}
                        >
                            Explore All Workspaces <ArrowRight size={20} />
                        </motion.button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Workspaces;
