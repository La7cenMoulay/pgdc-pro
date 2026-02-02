import { useState } from 'react';
import { useStore } from '../store';

export function Members() {
    const { state } = useStore();
    const { members } = state;
    const [filter, setFilter] = useState('All');

    const filteredMembers = filter === 'All'
        ? members
        : members.filter(m => m.category === filter);

    const categories = ['All', ...new Set(members.map(m => m.category))];

    return (
        <section id="members" style={{ padding: '80px 0' }}>
            <div className="container">
                <h2 className="section-title">Our Team</h2>

                <div className="filter-controls" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`btn btn-outline filter-btn ${cat === filter ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                            style={{ margin: '0 5px', padding: '8px 20px', borderRadius: '20px' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid-cols-4 members-grid">
                    {filteredMembers.map(member => (
                        <div
                            key={member.id}
                            className="glass-panel member-card animate-fade-in"
                            style={{ textAlign: 'center', padding: '30px' }}
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                style={{ objectFit: 'cover' }}
                            />
                            <h3 style={{ marginBottom: '5px' }}>{member.name}</h3>
                            <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                                {member.role}
                            </p>
                            {member.category && (
                                <span style={{
                                    fontSize: '0.75rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    padding: '2px 8px',
                                    borderRadius: '10px'
                                }}>
                                    {member.category}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
