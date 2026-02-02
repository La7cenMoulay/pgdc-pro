import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { Code, Palette, Users, Zap } from 'lucide-react';

// Map icon strings to components
const iconMap: Record<string, any> = {
    code: Code,
    palette: Palette,
    users: Users,
    zap: Zap
};

export function About() {
    const { state } = useStore();
    const { about } = state;
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        if (sectionRef.current) {
            const items = sectionRef.current.querySelectorAll('.bento-item');
            items.forEach(item => observer.observe(item));
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="about" ref={sectionRef} style={{ padding: '80px 0' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <h2 className="section-title animate-fade-in">{about.title}</h2>
                <p className="lead" style={{
                    maxWidth: '700px',
                    margin: '0 auto 60px',
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    color: 'var(--text-muted)'
                }}>
                    {about.description}
                </p>

                <div className="bento-grid">
                    {about.features.map((feature, i) => {
                        const Icon = iconMap[feature.icon] || Zap;
                        return (
                            <div
                                key={i}
                                className="glass-panel bento-item"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <Icon className="bento-icon" />
                                <h3>{feature.title}</h3>
                                <p>{feature.text}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
