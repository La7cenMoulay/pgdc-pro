import { useStore } from '../store';

export function Hero() {
    const { state } = useStore();
    const { hero } = state;

    return (
        <header className="hero" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '120px 20px 80px'
        }}>
            <div className="bg-mesh">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <h1 className="hero-title animate-fade-in">{hero.title}</h1>
                <p className="animate-fade-in hero-subtitle" style={{
                    fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                    color: 'var(--text-muted)',
                    margin: '20px 0 40px',
                    animationDelay: '0.2s',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    {hero.subtitle}
                </p>
                <a href="#about" className="btn animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <span>{hero.ctaText}</span>
                </a>
            </div>
        </header>
    );
}
