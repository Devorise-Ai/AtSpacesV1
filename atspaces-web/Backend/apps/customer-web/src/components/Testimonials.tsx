import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Product Manager at TechFlow",
        text: "AtSpaces completely transformed how our remote team collaborates. The booking process is seamless, and the venues are always top-notch.",
        avatar: "SJ"
    },
    {
        name: "Ahmed Al-Farsi",
        role: "Freelance Consultant",
        text: "I needed a quiet place for client meetings in Amman, and AtSpaces delivered. The professional atmosphere impressed my clients immediately.",
        avatar: "AF"
    },
    {
        name: "Jessica Li",
        role: "Creative Director",
        text: "The flexibility is unmatched. Whether I need a desk for an hour or a meeting room for a day, I can find exactly what I need in seconds.",
        avatar: "JL"
    },
];

const Testimonials = () => {
    return (
        <section style={{ padding: '8rem 0', background: 'rgba(255, 91, 4, 0.03)' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="section-title"
                    style={{ fontSize: '2.5rem', marginBottom: '4rem' }}
                >
                    Loved by <span style={{ color: 'var(--primary)' }}>Professionals</span>
                </motion.h2>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.2 }
                        }
                    }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}
                >
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            variants={{
                                hidden: { opacity: 0, scale: 0.9 },
                                show: { opacity: 1, scale: 1 }
                            }}
                            whileHover={{ y: -5 }}
                            className="glass-panel card-hover"
                            style={{ padding: '2.5rem', textAlign: 'left' }}
                        >
                            <div style={{ display: 'flex', gap: '4px', color: '#FACC15', marginBottom: '1.5rem' }}>
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <p style={{ fontStyle: 'italic', marginBottom: '2rem', color: 'var(--text-primary)', opacity: 0.8 }}>"{t.text}"</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'var(--primary)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.8rem'
                                }}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1rem' }}>{t.name}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
