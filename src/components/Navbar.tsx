import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Sun, Moon, Menu, X } from 'lucide-react';

export function Navbar() {
    const { state, dispatch } = useStore();
    const { theme } = state;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <a href="#" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={closeMenu}>
                    <img src="./logo.jpg" alt="PGDC Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                    <span>PGDC</span>
                </a>

                <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <a href="#" className="nav-link" onClick={closeMenu}>Home</a>
                    <a href="#about" className="nav-link" onClick={closeMenu}>About</a>
                    <a href="#members" className="nav-link" onClick={closeMenu}>Members</a>
                    <a href="#contact" className="nav-link" onClick={closeMenu}>Contact</a>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button
                            className="btn btn-outline"
                            style={{ padding: '8px', borderRadius: '50%', display: 'flex' }}
                            onClick={() => {
                                dispatch({ type: 'TOGGLE_THEME' });
                                if (window.innerWidth <= 768) closeMenu();
                            }}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
