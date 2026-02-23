import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Star, Users, Wifi, Coffee, LayoutGrid, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatAssistant from '../components/ChatAssistant';
import MapView from '../components/MapView';
import { WORKSPACES } from '../data/workspaces';

const CATEGORIES = ['All', 'Hot Desk', 'Dedicated Desk', 'Private Office', 'Meeting Room'];

const WorkspacesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    // Filter logic
    const filteredWorkspaces = WORKSPACES.filter(space => {
        const matchesSearch = space.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            space.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || space.type === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, paddingTop: '100px' }}>
                {/* Header Section */}
                <section style={{ padding: '4rem 0 2rem 0', background: 'linear-gradient(to bottom, rgba(255, 91, 4, 0.05), transparent)' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                                Find Your Perfect <span style={{ color: 'var(--primary)' }}>Workspace</span>
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                                Browse our curated selection of premium workspaces across the city. Filter by type, location, or amenities to match your exact needs.
                            </p>
                        </div>

                        {/* Search and Filters */}
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <div className="glass-panel" style={{
                                padding: '1rem',
                                borderRadius: '16px',
                                display: 'flex',
                                gap: '1rem',
                                flexWrap: 'wrap',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    flex: 1,
                                    minWidth: '250px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <Search size={20} color="var(--text-secondary)" />
                                    <input
                                        type="text"
                                        placeholder="Search by location or name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'white',
                                            width: '100%',
                                            outline: 'none',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
                                    <Filter size={18} /> Filters
                                </button>
                            </div>

                            {/* Category Chips */}
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem', justifyContent: 'center' }}>
                                {CATEGORIES.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '20px',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            background: selectedCategory === category ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                            color: selectedCategory === category ? 'white' : 'var(--text-secondary)',
                                            border: `1px solid ${selectedCategory === category ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedCategory !== category) {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedCategory !== category) {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                            }
                                        }}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                <section style={{ padding: '4rem 0 6rem 0' }}>
                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Showing {filteredWorkspaces.length} workspaces</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => setViewMode('list')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: viewMode === 'list' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                        color: viewMode === 'list' ? 'white' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        fontWeight: 500,
                                        fontSize: '0.85rem',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <LayoutGrid size={16} /> List
                                </button>
                                <button
                                    onClick={() => setViewMode('map')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: viewMode === 'map' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                        color: viewMode === 'map' ? 'white' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        fontWeight: 500,
                                        fontSize: '0.85rem',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Map size={16} /> Map
                                </button>
                            </div>
                        </div>

                        {viewMode === 'map' ? (
                            <MapView workspaces={filteredWorkspaces} />
                        ) : filteredWorkspaces.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '2rem'
                            }}>
                                {filteredWorkspaces.map((space, index) => (
                                    <motion.div
                                        key={space.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
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
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                                <MapPin size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>No workspaces found</h3>
                                <p>Try adjusting your search or filters to find what you're looking for.</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                                    style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
            <ChatAssistant />
        </div>
    );
};

export default WorkspacesPage;
