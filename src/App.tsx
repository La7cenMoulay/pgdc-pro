import { useEffect, useState } from 'react';
import { StoreProvider } from './store';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Timeline } from './components/Timeline';
import { Members } from './components/Members';
import { Gallery } from './components/Gallery';
import { AdminDashboard } from './components/Admin';
import { ChatWidget } from './components/ChatWidget';
import { Toaster } from 'sonner';

import { Contact } from './components/Contact';

function AppContent() {
    const [route, setRoute] = useState(window.location.hash || '#home');

    useEffect(() => {
        const handleHashChange = () => setRoute(window.location.hash || '#home');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (route === '#admin') {
        return (
            <div className="app">
                <Navbar />
                <AdminDashboard />
                <ChatWidget />
            </div>
        );
    }

    return (
        <div className="app">
            <Navbar />
            <Hero />
            <About />
            <Gallery />
            <Timeline />
            <Members />
            <Contact />

            <footer style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <div className="container">
                    <p>&copy; 2026 PGDC. Built with determination.</p>
                </div>
            </footer>
            <ChatWidget />
        </div>
    );
}

function App() {
    return (
        <StoreProvider>
            <Toaster position="top-center" richColors />
            <AppContent />
        </StoreProvider>
    );
}

export default App;
