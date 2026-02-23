import { Coffee, Monitor, Clock, Shield, Wifi, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    { icon: <Coffee />, title: "Premium Amenities", text: "Unlimited specialty coffee, tea, and snacks to keep you fueled throughout the day." },
    { icon: <Monitor />, title: "Tech-Enabled", text: "Smart screens, high-quality audio, and seamless connectivity for presentations." },
    { icon: <Clock />, title: "Flexible Booking", text: "Book by the hour or day with instant confirmation. No long-term contracts required." },
    { icon: <Zap />, title: "High-Speed Wi-Fi", text: "Blazing fast fiber internet ensures your video calls and downloads never lag." },
    { icon: <Shield />, title: "Secure Access", text: "Verified venues with secure entry systems and privacy-focused environments." },
    { icon: <Wifi />, title: "Premium Comfort", text: "Ergonomic chairs and spacious desks designed for long work sessions without fatigue." },
];

const WhyChoose = () => {
    return (
        <section style={{ padding: '8rem 0' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="section-title"
                    style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
                >
                    Why Choose <span style={{ color: 'var(--primary)' }}>AtSpaces</span>?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '2rem auto 4rem' }}
                >
                    We curate only the best professional environments so you can focus on what matters most—your work.
                </motion.p>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0 }
                            }}
                            className="glass-panel card-hover"
                            style={{ padding: '2.5rem', textAlign: 'left' }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'rgba(255, 91, 4, 0.1)',
                                color: 'var(--primary)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                {f.icon}
                            </div>
                            <h3 style={{ marginBottom: '0.75rem' }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{f.text}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChoose;
