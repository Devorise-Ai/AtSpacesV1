import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Pricing = () => {
    return (
        <section id="pricing" style={{ padding: '6rem 0', position: 'relative' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-title"
                        style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
                    >
                        Simple, Transparent <span style={{ color: 'var(--primary)' }}>Pricing</span>
                    </motion.h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Choose the plan that fits your workspace needs. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    alignItems: 'center'
                }}>
                    {/* Starter Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                        className="glass-panel"
                        style={{ padding: '2.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '100%', transition: 'border-color 0.3s ease' }}
                    >
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Starter</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Free</div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            Perfect for trying out AtSpaces
                        </p>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {['Browse available spaces', 'Book up to 5 hours/month', 'Basic support'].map((feature, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 + (i * 0.1) }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                                >
                                    <Check size={18} color="var(--primary)" /> {feature}
                                </motion.li>
                            ))}
                        </ul>

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-primary)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Get Started
                        </motion.button>
                    </motion.div>

                    {/* Professional Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: window.innerWidth > 768 ? 1.05 : 1 }}
                        whileInView={{ opacity: 1, y: 0, scale: window.innerWidth > 768 ? 1.05 : 1 }}
                        whileHover={{ y: -10, scale: window.innerWidth > 768 ? 1.08 : 1.03, boxShadow: '0 25px 50px var(--primary-glow)' }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="glass-panel"
                        style={{
                            padding: '3rem 2.5rem',
                            borderRadius: '16px',
                            border: '1px solid var(--primary)',
                            boxShadow: '0 0 30px var(--primary-glow)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            zIndex: 1
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '-12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em'
                        }}>
                            MOST POPULAR
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Professional</h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>JOD</span>
                            <span style={{ fontSize: '3rem', fontWeight: 800 }}>49</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>/month</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            For professionals who need flexible workspaces
                        </p>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {[
                                'Unlimited bookings',
                                'Priority access to premium rooms',
                                'AI Assistant for smart booking',
                                'Calendar integrations',
                                'Priority support'
                            ].map((feature, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 + (i * 0.1) }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}
                                >
                                    <Check size={18} color="var(--primary)" /> {feature}
                                </motion.li>
                            ))}
                        </ul>

                        <motion.button
                            className="btn-primary"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{ width: '100%', padding: '0.75rem', fontWeight: 600, fontSize: '1rem', display: 'flex', justifyContent: 'center' }}
                        >
                            Start Free Trial
                        </motion.button>
                    </motion.div>

                    {/* Enterprise Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="glass-panel"
                        style={{ padding: '2.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '100%', transition: 'border-color 0.3s ease' }}
                    >
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Enterprise</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Custom</div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            For teams and organizations
                        </p>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {[
                                'Everything in Professional',
                                'Team management dashboard',
                                'Dedicated account manager',
                                'Custom integrations',
                                '24/7 support'
                            ].map((feature, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.4 + (i * 0.1) }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                                >
                                    <Check size={18} color="var(--primary)" /> {feature}
                                </motion.li>
                            ))}
                        </ul>

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-primary)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Contact Sales
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
