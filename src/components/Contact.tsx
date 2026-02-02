import { useRef, useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

export function Contact() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !message) {
            toast.error("Please fill in all fields");
            return;
        }

        // Simulate API call
        toast.success("Message sent! We'll get back to you soon.");
        setEmail('');
        setMessage('');
    };

    return (
        <section id="contact" style={{ padding: '80px 0', background: 'linear-gradient(180deg, transparent, rgba(0, 191, 165, 0.05))' }}>
            <div className="container">
                <h2 className="section-title">Get in Touch</h2>

                <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    className="input"
                                    style={{ paddingLeft: '40px' }}
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Message</label>
                            <div style={{ position: 'relative' }}>
                                <MessageSquare size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                                <textarea
                                    className="input"
                                    style={{ paddingLeft: '40px', minHeight: '120px', resize: 'vertical' }}
                                    placeholder="What's on your mind?"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn" style={{ justifyContent: 'center' }}>
                            <Send size={18} /> Send Message
                        </button>

                    </form>
                </div>
            </div>
        </section>
    );
}
