import { useState } from 'react';
import { useStore } from '../store';
import { motion } from 'framer-motion';

export function Gallery() {
    const { state } = useStore();
    const { gallery } = state;
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Event', 'Achievement', 'Activity'];
    const filteredItems = selectedCategory === 'All'
        ? gallery
        : gallery.filter(item => item.category === selectedCategory);

    const [viewingItem, setViewingItem] = useState<typeof gallery[0] | null>(null);

    return (
        <section id="gallery" style={{ padding: '80px 0' }}>
            <div className="container">
                <h2 className="section-title">Our Gallery & Achievements</h2>

                <div className="filter-controls" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`btn btn-outline filter-btn ${cat === selectedCategory ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                            style={{ margin: '0 5px', padding: '8px 20px', borderRadius: '20px' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {filteredItems.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="glass-panel"
                            style={{ overflow: 'hidden', borderRadius: '16px', position: 'relative', cursor: 'pointer' }}
                            onClick={() => setViewingItem(item)}
                        >
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                                {item.images && item.images.length > 1 && (
                                    <div style={{
                                        position: 'absolute', top: '10px', right: '10px',
                                        background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem'
                                    }}>
                                        +{item.images.length} Photos
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{item.category}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.date}</span>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{item.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox / Modal */}
            {viewingItem && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(0,0,0,0.9)', zIndex: 2000,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'
                    }}
                    onClick={() => setViewingItem(null)}
                >
                    <button
                        style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}
                        onClick={() => setViewingItem(null)}
                    >
                        &times;
                    </button>

                    <div style={{ maxWidth: '1000px', width: '100%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ color: 'white', marginBottom: '20px' }}>{viewingItem.title}</h2>
                        <div style={{
                            display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px',
                            scrollSnapType: 'x mandatory', maxHeight: '70vh'
                        }}>
                            {/* Show Either Array of Images or Single Image */}
                            {(viewingItem.images && viewingItem.images.length > 0 ? viewingItem.images : [viewingItem.image]).map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    style={{
                                        height: '60vh',
                                        maxWidth: '100%',
                                        objectFit: 'contain',
                                        scrollSnapAlign: 'center',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                                    }}
                                />
                            ))}
                        </div>
                        <p style={{ color: '#ccc', marginTop: '10px' }}>
                            {viewingItem.images ? viewingItem.images.length : 1} photos • {viewingItem.date}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}
