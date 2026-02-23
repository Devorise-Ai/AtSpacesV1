const Footer = () => {
    return (
        <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border)', background: '#080C16' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>At<span style={{ color: 'var(--primary)' }}>Spaces</span></h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        The freedom to find your own way. Discover and book professional workspaces anytime, anywhere.
                    </p>
                    <div style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        123 Innovation Blvd, Tech District<br />
                        support@atspaces.com
                    </div>
                </div>
                <div>
                    <h4 style={{ marginBottom: '1.5rem' }}>Legal</h4>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li>Privacy Policy</li>
                        <li>Terms of Service</li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ marginBottom: '1.5rem' }}>Connect</h4>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li>Twitter</li>
                        <li>GitHub</li>
                        <li>LinkedIn</li>
                        <li>Instagram</li>
                    </ul>
                </div>
            </div>
            <div className="container" style={{ marginTop: '4rem', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>
                © 2026 AtSpaces. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
