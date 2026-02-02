import { useEffect } from 'react';
import { useStore } from '../store';
import { Sun, Moon } from 'lucide-react';

export function Navbar() {
    const { state, dispatch } = useStore();
    const { theme } = state;

    // Scroll effect logic
    useEffect(() => {
        const handleScroll = () => {
            const nav = document.querySelector('.navbar');
            if (nav) {
                if (window.scrollY > 50) nav.classList.add('scrolled');
                else nav.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <a href="#" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src="/logo.jpg" alt="PGDC Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                    <span>PGDC</span>
                </a>
                <div className="nav-links">
                    <a href="#" className="nav-link">Home</a>
                    <a href="#about" className="nav-link">About</a>
                    <a href="#members" className="nav-link">Members</a>
                    <a href="#contact" className="nav-link">Contact</a>

                    <button
                        className="btn btn-outline"
                        style={{ padding: '8px', borderRadius: '50%', display: 'flex' }}
                        onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
