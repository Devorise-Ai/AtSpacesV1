import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Star, Users, LayoutGrid, Map, X, ArrowUpDown, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatAssistant from '../components/ChatAssistant';
import MapView from '../components/MapView';
import WorkspaceCardSkeleton from '../components/WorkspaceCardSkeleton';
import { publicService } from '../services/public.service';
import type { WorkspaceCard } from '../types';

const CATEGORIES = ['All', 'Hot Desk', 'Dedicated Desk', 'Private Office', 'Meeting Room'];

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

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

const SORT_LABELS: Record<SortOption, string> = {
    'default': 'Default',
    'price-asc': 'Price: Low → High',
    'price-desc': 'Price: High → Low',
    'rating-desc': 'Highest Rated',
};

const WorkspacesPage = () => {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('location') || '');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [workspaces, setWorkspaces] = useState<WorkspaceCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [maxPrice, setMaxPrice] = useState<number>(200);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState<number | ''>('');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    // Unique branch pins for the map (one pin per branch, not per service)
    const [branchPins, setBranchPins] = useState<Array<{
        id: string; branchId: number; title: string; location: string;
        rating: number; price: number; type: string; image: string;
        lat: number; lng: number;
    }>>([]);

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                setLoading(true);
                const branches = await publicService.listBranches();

                // Flatten branches and their services into the UI format
                const flattened: WorkspaceCard[] = branches.flatMap((branch: any) =>
                    (branch.vendorServices || []).filter((vs: any) => vs.isActive !== false).map((vs: any) => ({
                        id: `${branch.id}-${vs.id}`,
                        branchId: branch.id,
                        serviceId: vs.id,
                        title: `${branch.name}`,
                        location: branch.address || branch.city || 'Amman, Jordan',
                        rating: branch.rating || 4.8,
                        reviews: branch.reviewsCount || 42,
                        price: vs.pricePerUnit,
                        capacity: String(vs.maxCapacity || '1'),
                        image: branch.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
                        amenities: branch.branchFacilities?.map((bf: any) => bf.facility.name) || [],
                        type: vs.service.name,
                        description: branch.description,
                        verified: branch.status === 'active',
                        lat: branch.latitude ?? null,
                        lng: branch.longitude ?? null,
                    }))
                );

                setWorkspaces(flattened);

                // Build unique branch pins for map — one per branch, spread across Jordan
                // if lat/lng is null assign evenly-spread fallback coords around Amman
                const seen = new Set<number>();
                const AMMAN_CENTER = { lat: 31.963, lng: 35.890 };
                const jitter = (i: number) => ({ // spread branches in a grid if no coords
                    lat: AMMAN_CENTER.lat + (Math.floor(i / 3) - 1) * 0.015 + (i % 2) * 0.008,
                    lng: AMMAN_CENTER.lng + (i % 3 - 1) * 0.015,
                });
                let pinIndex = 0;
                const pins: typeof branchPins = [];
                branches.forEach((branch: any) => {
                    if (seen.has(branch.id)) return;
                    seen.add(branch.id);
                    const vs = branch.vendorServices?.[0];
                    const hasCoords = branch.latitude != null && branch.longitude != null;
                    const fallback = jitter(pinIndex++);
                    pins.push({
                        id: String(branch.id),
                        branchId: branch.id,
                        title: branch.name,
                        location: branch.address || branch.city || 'Amman',
                        rating: branch.rating || 4.8,
                        price: vs?.pricePerUnit ?? 0,
                        type: vs?.service?.name ?? '',
                        image: branch.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
                        lat: hasCoords ? branch.latitude : fallback.lat,
                        lng: hasCoords ? branch.longitude : fallback.lng,
                    });
                });
                setBranchPins(pins);
            } catch (err) {
                console.error("Failed to fetch workspaces", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkspaces();
    }, []);

    // Filter logic
    const filteredWorkspaces = workspaces
        .filter(space => {
            const matchesSearch = space.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                space.location.toLowerCase().includes(searchTerm.toLowerCase());

            const categoryMap: Record<string, string> = {
                'Hot Desk': 'hot_desk',
                'Dedicated Desk': 'dedicated_desk',
                'Private Office': 'private_office',
                'Meeting Room': 'meeting_room'
            };

            const backendCategory = categoryMap[selectedCategory];
            const matchesCategory = selectedCategory === 'All' ||
                space.type === selectedCategory ||
                space.type === backendCategory;

            const matchesPrice = space.price <= maxPrice;
            const matchesVerified = !verifiedOnly || (space as any).verified;

            const matchesCapacity = guests === '' || Number(space.capacity) >= guests;
            const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every(a => space.amenities.includes(a));

            return matchesSearch && matchesCategory && matchesPrice && matchesVerified && matchesCapacity && matchesAmenities;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'rating-desc': return b.rating - a.rating;
                default: return 0;
            }
        });

    const maxPriceInData = workspaces.length > 0 ? Math.max(...workspaces.map(w => w.price)) : 200;

    // Extract unique amenities for the filter panel
    const allAmenities = Array.from(new Set(workspaces.flatMap(w => w.amenities))).sort();

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setSortBy('default');
        setMaxPrice(maxPriceInData);
        setVerifiedOnly(false);
        setDate('');
        setGuests('');
        setSelectedAmenities([]);
    };

    const hasActiveFilters = searchTerm || selectedCategory !== 'All' || sortBy !== 'default' || maxPrice < maxPriceInData || verifiedOnly || date || guests !== '' || selectedAmenities.length > 0;

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

                        {/* Premium Search and Filters Bar */}
                        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                            <div className="glass-panel" style={{
                                padding: '0.5rem',
                                borderRadius: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                flexWrap: 'nowrap',
                                overflowX: 'auto',
                                scrollbarWidth: 'none'
                            }}>
                                {/* Location input */}
                                <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRight: '1px solid rgba(255,255,255,0.1)', minWidth: '200px' }}>
                                    <MapPin size={20} color="var(--primary)" />
                                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</span>
                                        <input
                                            type="text"
                                            placeholder="Where to?"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem', fontWeight: 500, width: '100%' }}
                                        />
                                    </div>
                                    {searchTerm && <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0 }}><X size={14} /></button>}
                                </div>

                                {/* Date Input */}
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRight: '1px solid rgba(255,255,255,0.1)', minWidth: '150px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</span>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            style={{ background: 'transparent', border: 'none', color: date ? 'var(--text-primary)' : 'var(--text-secondary)', outline: 'none', fontSize: '0.95rem', fontWeight: 500, width: '100%', fontFamily: 'inherit', WebkitAppearance: 'none' }}
                                        />
                                    </div>
                                </div>

                                {/* Guests Input */}
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', minWidth: '120px' }}>
                                    <Users size={20} color="var(--text-secondary)" />
                                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Capacity</span>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Add guests"
                                            value={guests}
                                            onChange={(e) => setGuests(e.target.value === '' ? '' : parseInt(e.target.value) || 1)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem', fontWeight: 500, width: '100%' }}
                                        />
                                    </div>
                                </div>

                                {/* Actions: Search/Filters */}
                                <div style={{ display: 'flex', gap: '0.5rem', paddingRight: '0.4rem', paddingLeft: '0.5rem' }}>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1.25rem', borderRadius: '100px', background: showFilters ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: 'none', color: showFilters ? 'white' : 'var(--text-primary)', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s ease', fontFamily: 'inherit', fontSize: '0.9rem' }}
                                    >
                                        <Filter size={16} /> Filters {hasActiveFilters && <span style={{ background: showFilters ? 'white' : 'var(--primary)', color: showFilters ? 'var(--primary)' : 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>!</span>}
                                    </button>
                                    <button
                                        className="btn-primary"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', borderRadius: '50%', minWidth: '46px', minHeight: '46px' }}
                                    >
                                        <Search size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Filters Panel */}
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-panel"
                                    style={{ padding: '1.5rem', marginTop: '0.75rem', borderRadius: '16px' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <span style={{ fontWeight: 600 }}>Advanced Filters</span>
                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearFilters}
                                                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>

                                    {/* Price Range */}
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                                            Max Price: <strong style={{ color: 'var(--primary)' }}>JOD {maxPrice}/hr</strong>
                                        </label>
                                        <input
                                            type="range"
                                            min={1}
                                            max={maxPriceInData || 200}
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                                            style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                            <span>JOD 1</span>
                                            <span>JOD {maxPriceInData || 200}</span>
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    {allAmenities.length > 0 && (
                                        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.75rem' }}>Amenities</label>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {allAmenities.map(amenity => (
                                                    <button
                                                        key={amenity}
                                                        onClick={() => {
                                                            if (selectedAmenities.includes(amenity)) {
                                                                setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                                                            } else {
                                                                setSelectedAmenities([...selectedAmenities, amenity]);
                                                            }
                                                        }}
                                                        style={{
                                                            padding: '0.4rem 0.9rem',
                                                            borderRadius: '20px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 500,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            background: selectedAmenities.includes(amenity) ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                                            color: selectedAmenities.includes(amenity) ? 'white' : 'var(--text-secondary)',
                                                            border: `1px solid ${selectedAmenities.includes(amenity) ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                                                            fontFamily: 'inherit',
                                                            display: 'flex', alignItems: 'center', gap: '0.3rem'
                                                        }}
                                                    >
                                                        <CheckCircle2 size={12} style={{ opacity: selectedAmenities.includes(amenity) ? 1 : 0.3 }} /> {amenity}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sort By */}
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Sort By</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {(Object.keys(SORT_LABELS) as SortOption[]).map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => setSortBy(opt)}
                                                    style={{
                                                        padding: '0.4rem 0.9rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 500,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        background: sortBy === opt ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                                        color: sortBy === opt ? 'white' : 'var(--text-secondary)',
                                                        border: `1px solid ${sortBy === opt ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                                                        fontFamily: 'inherit'
                                                    }}
                                                >
                                                    {SORT_LABELS[opt]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Category Chips + Verified toggle */}
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
                                            border: `1px solid ${selectedCategory === category ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                                            fontFamily: 'inherit'
                                        }}
                                    >
                                        {category}
                                    </button>
                                ))}
                                {/* Verified Only toggle */}
                                <button
                                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        background: verifiedOnly ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                                        color: verifiedOnly ? '#10b981' : 'var(--text-secondary)',
                                        border: `1px solid ${verifiedOnly ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    <ShieldCheck size={14} /> Verified Only
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                <section style={{ padding: '4rem 0 6rem 0' }}>
                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>
                                {loading ? 'Loading workspaces...' : `Showing ${filteredWorkspaces.length} workspace${filteredWorkspaces.length !== 1 ? 's' : ''}`}
                            </span>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                {/* Sort quick-access */}
                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setShowSortMenu(!showSortMenu)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '10px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            background: sortBy !== 'default' ? 'rgba(255, 91, 4, 0.1)' : 'rgba(255,255,255,0.05)',
                                            color: sortBy !== 'default' ? 'var(--primary)' : 'var(--text-secondary)',
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
                                        <ArrowUpDown size={14} /> {SORT_LABELS[sortBy]}
                                    </button>
                                    {showSortMenu && (
                                        <>
                                            <div onClick={() => setShowSortMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="glass-panel"
                                                style={{
                                                    position: 'absolute',
                                                    top: 'calc(100% + 8px)',
                                                    right: 0,
                                                    zIndex: 20,
                                                    minWidth: '180px',
                                                    padding: '0.5rem',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.25rem'
                                                }}
                                            >
                                                {(Object.keys(SORT_LABELS) as SortOption[]).map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => { setSortBy(opt); setShowSortMenu(false); }}
                                                        style={{
                                                            padding: '0.5rem 0.75rem',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            background: sortBy === opt ? 'rgba(255, 91, 4, 0.15)' : 'transparent',
                                                            color: sortBy === opt ? 'var(--primary)' : 'var(--text-secondary)',
                                                            cursor: 'pointer',
                                                            textAlign: 'left',
                                                            fontSize: '0.85rem',
                                                            fontFamily: 'inherit',
                                                            fontWeight: sortBy === opt ? 600 : 400
                                                        }}
                                                    >
                                                        {SORT_LABELS[opt]}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </div>

                                {/* View mode toggle */}
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
                            <MapView workspaces={branchPins} />
                        ) : loading ? (
                            /* Skeleton loaders */
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '2rem'
                            }}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <WorkspaceCardSkeleton key={i} />
                                ))}
                            </div>
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
                                        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
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
                                                loading="lazy"
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
                                                {formatServiceName(space.type)}
                                            </div>
                                            {/* Verified badge */}
                                            {(space as any).verified && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '1rem',
                                                    left: '1rem',
                                                    background: 'rgba(16,185,129,0.85)',
                                                    backdropFilter: 'blur(8px)',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.72rem',
                                                    fontWeight: 700,
                                                    color: 'white',
                                                    display: 'flex', alignItems: 'center', gap: '0.3rem'
                                                }}>
                                                    <ShieldCheck size={11} /> Verified
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '1.1rem', margin: 0, lineHeight: 1.3 }}>{space.title}</h3>
                                                    <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, opacity: 0.85 }}>{formatServiceName(space.type)}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontWeight: 600, fontSize: '0.9rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                                                    <Star size={16} fill="currentColor" />
                                                    {space.rating}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                                <MapPin size={16} />
                                                {space.location}
                                            </div>

                                            {/* Real Amenities from DB */}
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                                    <Users size={14} /> {space.capacity} {Number(space.capacity) === 1 ? 'seat' : 'seats'}
                                                </div>
                                                {space.amenities.slice(0, 3).map((a, i) => (
                                                    <span key={i} style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                                        background: 'rgba(255, 91, 4, 0.08)',
                                                        border: '1px solid rgba(255, 91, 4, 0.2)',
                                                        borderRadius: '20px',
                                                        padding: '0.2rem 0.6rem',
                                                        fontSize: '0.75rem',
                                                        color: 'var(--text-secondary)'
                                                    }}>
                                                        <CheckCircle2 size={11} color="var(--primary)" />
                                                        {a}
                                                    </span>
                                                ))}
                                                {space.amenities.length > 3 && (
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', alignSelf: 'center', opacity: 0.7 }}>
                                                        +{space.amenities.length - 3} more
                                                    </span>
                                                )}
                                            </div>

                                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                                <div>
                                                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>JOD {space.price}</span>
                                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}> / hour</span>
                                                </div>
                                                <Link to={`/workspaces/${space.branchId}?service=${space.type}`} style={{ textDecoration: 'none' }}>
                                                    <button className="btn-outline-primary">
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
                                <MapPin size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto', display: 'block' }} />
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No workspaces found</h3>
                                <p>Try adjusting your search or filters to find what you're looking for.</p>
                                <button
                                    onClick={clearFilters}
                                    style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}
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
