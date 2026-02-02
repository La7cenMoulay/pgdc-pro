import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: number;
    text: string;
    sender: 'bot' | 'user';
}

const FAQ_DATA = [
    { q: "What is PGDC?", a: "PGDC stands for Programming & Graphic Design Club. We are a community dedicated to empowering students in Computer Science and Digital Arts." },
    { q: "How can I join?", a: "You can join by reaching out to us during our recruitment phase at the start of the academic year, or contact us via the form below!" },
    { q: "Is membership free?", a: "Yes! Membership is completely free for all students." },
    { q: "Do I need experience?", a: "Not at all! We welcome beginners and experts alike. We learn and grow together." },
    { q: "What do you teach?", a: "We cover Web Development, Software Engineering, UI/UX Design, Branding, and Digital Illustration." },
    { q: "Who is the President?", a: "Our current President is Sarah Ahmed." },
    { q: "I'm a designer, can I join?", a: "Absolutely! We hava a dedicated Design department led by Lina Othman." },
    { q: "Do you have coding workshops?", a: "Yes, we host regular workshops on React, Python, and more." },
    { q: "Where are you located?", a: "We are based at the university campus, typically meeting in the CS department labs." },
    { q: "Can I work on projects?", a: "Yes! Project-based learning is a core part of our activities." },
    { q: "What is the Anniversary Timeline?", a: "It's a feature celebrating our 5-year journey! You can toggle it in the Admin Dashboard." },
    { q: "Who leads the Tech team?", a: "Omar Khader is our Head of Tech." },
    { q: "Do you facilitate hackathons?", a: "Yes, we participate in and organize local hackathons annually." },
    { q: "How can I contact you?", a: "Use the 'Contact' section at the bottom of this page to send us an email." },
    { q: "What tools do designers use?", a: "We rely on industry standards like Figma, Adobe Illustrator, and Photoshop." },
    { q: "Is there a certificate?", a: "Active members receive a certificate of participation at the end of the year." },
    { q: "How often do you meet?", a: "We hold general meetings once a week and workshops bi-weekly." },
    { q: "Can I be a board member?", a: "Board elections are held annually. Active members are encouraged to run!" },
    { q: "What is your mission?", a: "To bridge the gap between academic theory and practical application in Tech and Design." },
    { q: "Do you collaborate with others?", a: "Yes, we often partner with other student clubs and local tech companies." },
];

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 0, text: "Hi there! 👋 I'm the PGDC Bot. Pick a question below to learn more about us!", sender: 'bot' }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleQuestionClick = (index: number) => {
        const question = FAQ_DATA[index];

        // Add User Message
        const userMsg: Message = { id: Date.now(), text: question.q, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);

        // Simulate Bot Delay
        setTimeout(() => {
            const botMsg: Message = { id: Date.now() + 1, text: question.a, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        }, 600);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed', bottom: '30px', right: '30px',
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: 'var(--primary)', color: 'white', border: 'none',
                    boxShadow: '0 4px 20px rgba(0, 191, 165, 0.4)',
                    cursor: 'pointer', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        style={{
                            position: 'fixed', bottom: '100px', right: '30px',
                            width: '380px', height: '600px', maxHeight: '80vh',
                            background: 'var(--bg-dark)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '20px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                            display: 'flex', flexDirection: 'column',
                            zIndex: 1000, overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '20px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Bot size={24} />
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>PGDC Assistant</h3>
                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Online</span>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    style={{
                                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                        color: msg.sender === 'user' ? 'black' : 'var(--text-main)',
                                        padding: '12px 16px',
                                        borderRadius: '16px',
                                        borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                                        borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '16px',
                                        maxWidth: '80%',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.4'
                                    }}
                                >
                                    {msg.text}
                                </div>
                            ))}

                            <div style={{ height: '20px' }} /> {/* Spacer */}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Questions Bank (Input Area) */}
                        <div style={{ padding: '15px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', marginTop: 0 }}>Suggested Questions:</p>
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                overflowX: 'auto',
                                paddingBottom: '8px',
                                scrollbarWidth: 'thin'
                            }}>
                                {FAQ_DATA.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuestionClick(index)}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid var(--primary)',
                                            color: 'var(--primary)',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = 'var(--primary)';
                                            e.currentTarget.style.color = 'black';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = 'var(--primary)';
                                        }}
                                    >
                                        {item.q}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
