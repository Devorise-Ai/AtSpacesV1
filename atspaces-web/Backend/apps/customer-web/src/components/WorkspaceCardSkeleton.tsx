/**
 * Skeleton placeholder for a workspace card while data is loading.
 * Matches the layout of the real workspace card.
 */
const WorkspaceCardSkeleton = () => {
    return (
        <div
            className="glass-panel"
            style={{
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Image skeleton */}
            <div
                className="skeleton-shimmer"
                style={{ height: '220px', background: 'var(--bg-input)' }}
            />

            {/* Content skeleton */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Title row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="skeleton-shimmer" style={{ height: '20px', width: '60%', borderRadius: '6px', background: 'var(--bg-input)' }} />
                    <div className="skeleton-shimmer" style={{ height: '20px', width: '15%', borderRadius: '6px', background: 'var(--bg-input)' }} />
                </div>

                {/* Location */}
                <div className="skeleton-shimmer" style={{ height: '16px', width: '45%', borderRadius: '6px', background: 'var(--bg-input)' }} />

                {/* Amenities row */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton-shimmer" style={{ height: '14px', width: '50px', borderRadius: '6px', background: 'var(--bg-input)' }} />
                    ))}
                </div>

                {/* Price + button row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
                    <div className="skeleton-shimmer" style={{ height: '24px', width: '30%', borderRadius: '6px', background: 'var(--bg-input)' }} />
                    <div className="skeleton-shimmer" style={{ height: '36px', width: '100px', borderRadius: '8px', background: 'var(--bg-input)' }} />
                </div>
            </div>
        </div>
    );
};

export default WorkspaceCardSkeleton;
