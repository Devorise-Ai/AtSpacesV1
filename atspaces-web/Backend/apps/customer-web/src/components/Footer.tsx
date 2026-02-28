import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Instagram, Mail, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border)', background: '#080C16' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem' }}>
                {/* Brand */}
                <div>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                            At<span style={{ color: 'var(--primary)' }}>Spaces</span>
                        </h3>
                    </Link>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        The freedom to find your own way. Discover and book professional workspaces anytime, anywhere.
                    </p>
                    <div style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={14} />
                            123 Innovation Blvd, Tech District, Amman
                        </div>
                        <a href="mailto:support@atspaces.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                            <Mail size={14} />
                            support@atspaces.com
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Explore</h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { label: 'Browse Workspaces', to: '/workspaces' },
                            { label: 'Pricing', to: '/#pricing' },
                            { label: 'AI Assistant', to: '/ai-assistant' },
                            { label: 'My Bookings', to: '/my-bookings' },
                        ].map(link => (
                            <li key={link.label}>
                                <Link
                                    to={link.to}
                                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s ease' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Legal</h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { label: 'Privacy Policy', href: '/privacy' },
                            { label: 'Terms of Service', href: '/terms' },
                            { label: 'Cookie Policy', href: '/cookies' },
                        ].map(link => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s ease' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Connect</h4>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {[
                            { icon: <Twitter size={18} />, href: 'https://twitter.com/atspaces', label: 'Twitter' },
                            { icon: <Github size={18} />, href: 'https://github.com/atspaces', label: 'GitHub' },
                            { icon: <Linkedin size={18} />, href: 'https://linkedin.com/company/atspaces', label: 'LinkedIn' },
                            { icon: <Instagram size={18} />, href: 'https://instagram.com/atspaces', label: 'Instagram' },
                        ].map(social => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255, 91, 4, 0.15)';
                                    e.currentTarget.style.color = 'var(--primary)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 91, 4, 0.3)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                }}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>
                    © 2026 AtSpaces. All rights reserved.
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>
                    Made with ❤️ in Amman, Jordan
                </span>
            </div>
        </footer>
    );
};

export default Footer;
