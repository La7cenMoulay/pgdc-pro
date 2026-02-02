import { useStore } from '../store';

export function Timeline() {
    const { state } = useStore();
    const { isVisible, title, achievements } = state.anniversary;

    if (!isVisible) return null;

    return (
        <section className="anniversary-section" id="memory">
            <div className="container">
                <h2 className="section-title" style={{
                    color: 'var(--gold)',
                    textShadow: '0 0 20px rgba(255, 215, 0, 0.4)'
                }}>
                    {title}
                </h2>

                <div className="timeline">
                    {achievements.map((item, index) => (
                        <div
                            key={index}
                            className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                        >
                            <div className="timeline-content glass-panel">
                                <span className="year">{item.year}</span>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                            <div className="timeline-dot"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
