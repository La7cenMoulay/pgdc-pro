import React, { useState } from 'react';
import { useStore, Member, GalleryItem } from '../store';
import { UploadCloud, Plus, Image as ImageIcon, Users } from 'lucide-react';
import { toast } from 'sonner';

// Image compression utility
const processImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_SIZE = 800; // Resize large images

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
};

export function AdminDashboard() {
    const { state, dispatch } = useStore();
    const { isVisible } = state.anniversary;

    const [activeTab, setActiveTab] = useState<'members' | 'gallery'>('gallery');

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'Lahcendeymoumoking2007') {
            setIsAuthenticated(true);
            toast.success('Access Granted');
        } else {
            toast.error('Invalid Password');
        }
    };

    // Member State
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [category, setCategory] = useState<Member['category']>('Tech');
    const [memberImage, setMemberImage] = useState<string | null>(null);

    // Gallery State
    const [galleryTitle, setGalleryTitle] = useState('');
    const [galleryDate, setGalleryDate] = useState('');
    const [galleryCategory, setGalleryCategory] = useState<GalleryItem['category']>('Event');
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    const [isDragOver, setIsDragOver] = useState(false);

    // Drag & Drop Handlers
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
    const handleDragLeave = () => setIsDragOver(false);

    const handleDrop = (e: React.DragEvent, type: 'member' | 'gallery') => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);

        if (type === 'member') {
            const file = files[0];
            if (file && file.type.startsWith('image/')) {
                processImage(file).then(setMemberImage);
            }
        } else {
            // Handle multiple gallery images
            const imageFiles = files.filter(f => f.type.startsWith('image/'));
            Promise.all(imageFiles.map(processImage)).then(activeImages => {
                setGalleryImages(prev => [...prev, ...activeImages]);
                toast.success(`${activeImages.length} images compressed & added!`);
            });
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'member' | 'gallery') => {
        if (!e.target.files?.length) return;

        if (type === 'member') {
            processImage(e.target.files[0]).then(setMemberImage);
        } else {
            const files = Array.from(e.target.files);
            Promise.all(files.map(processImage)).then(avgs => setGalleryImages(prev => [...prev, ...avgs]));
        }
    }

    const handleAddMember = () => {
        if (name && role) {
            dispatch({
                type: 'ADD_MEMBER',
                payload: {
                    id: Date.now(),
                    name,
                    role,
                    category,
                    image: memberImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
                }
            });
            setName(''); setRole(''); setMemberImage(null);
            toast.success("Member added!");
        } else toast.error("Fill all fields");
    };

    const handleAddGallery = () => {
        if (galleryTitle && galleryDate && galleryImages.length > 0) {
            dispatch({
                type: 'ADD_GALLERY_ITEM',
                payload: {
                    id: Date.now(),
                    title: galleryTitle,
                    date: galleryDate,
                    category: galleryCategory,
                    image: galleryImages[0], // Main thumbnail
                    images: galleryImages // All images
                }
            });
            setGalleryTitle(''); setGalleryDate(''); setGalleryImages([]);
            toast.success("Gallery item added!");
        } else toast.error("Fill all fields & add images");
    };

    if (!isAuthenticated) {
        return (
            <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '20px' }}>Admin Access</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            className="input"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px', marginBottom: '20px' }}
                            autoFocus
                        />
                        <button className="btn" style={{ width: '100%', justifyContent: 'center' }}>
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </section>
        );
    }

    return (
        <section className="admin-section" style={{ padding: '120px 0' }}>
            <div className="container">
                <h1 className="section-title">Admin Dashboard</h1>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', gap: '20px' }}>
                    <button
                        className={`btn ${activeTab === 'members' ? '' : 'btn-outline'}`}
                        onClick={() => setActiveTab('members')}
                    >
                        <Users size={18} /> Manage Members
                    </button>
                    <button
                        className={`btn ${activeTab === 'gallery' ? '' : 'btn-outline'}`}
                        onClick={() => setActiveTab('gallery')}
                    >
                        <ImageIcon size={18} /> Manage Gallery
                    </button>
                </div>

                <div className="grid-cols-3" style={{ alignItems: 'start' }}>

                    {/* Settings Panel */}
                    <div className="glass-panel" style={{ padding: '30px', gridColumn: 'span 1' }}>
                        <h3 style={{ marginBottom: '20px' }}>Settings</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Show Anniversary</span>
                            <input
                                type="checkbox"
                                checked={isVisible}
                                onChange={(e) => dispatch({ type: 'TOGGLE_MEMORY', payload: e.target.checked })}
                                style={{ width: '20px', height: '20px' }}
                            />
                        </div>
                    </div>

                    {/* Dynamic Content Panel */}
                    <div className="glass-panel" style={{ padding: '30px', gridColumn: 'span 2' }}>

                        {activeTab === 'members' ? (
                            <div>
                                <h3>Add New Member</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                                    <div>
                                        <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                                        <input className="input" placeholder="Role" value={role} onChange={e => setRole(e.target.value)} />
                                        <select className="input" value={category} onChange={e => setCategory(e.target.value as any)}>
                                            <option value="Tech">Tech</option>
                                            <option value="Design">Design</option>
                                            <option value="Board">Board</option>
                                        </select>
                                        <div
                                            className="drop-zone"
                                            onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, 'member')}
                                            onClick={() => document.getElementById('member-upload')?.click()}
                                        >
                                            <p>Drop Member Photo</p>
                                        </div>
                                        <input type="file" id="member-upload" hidden onChange={(e) => handleFileSelect(e, 'member')} />
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <img src={memberImage || 'https://via.placeholder.com/150'} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} />
                                        <button className="btn" style={{ width: '100%' }} onClick={handleAddMember}>Add Member</button>
                                    </div>
                                </div>

                                {/* Member List */}
                                <div style={{ marginTop: '40px', borderTop: '1px solid var(--glass-border)', paddingTop: '30px' }}>
                                    <h4 style={{ marginBottom: '20px' }}>Current Team ({state.members.length})</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                        {state.members.map(member => (
                                            <div key={member.id} style={{
                                                background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px',
                                                display: 'flex', alignItems: 'center', gap: '10px', position: 'relative'
                                            }}>
                                                <img src={member.image} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                                <div style={{ overflow: 'hidden' }}>
                                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{member.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.role}</div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Delete ' + member.name + '?')) {
                                                            dispatch({ type: 'DELETE_MEMBER', payload: member.id });
                                                            toast.success('Member removed');
                                                        }
                                                    }}
                                                    style={{
                                                        marginLeft: 'auto', background: 'rgba(255,0,0,0.2)', border: 'none', color: '#ff4444',
                                                        width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3>Add Gallery Item</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                                    <div>
                                        <input className="input" placeholder="Event Title" value={galleryTitle} onChange={e => setGalleryTitle(e.target.value)} />
                                        <input className="input" type="date" value={galleryDate} onChange={e => setGalleryDate(e.target.value)} />
                                        <select className="input" value={galleryCategory} onChange={e => setGalleryCategory(e.target.value as any)}>
                                            <option value="Event">Event</option>
                                            <option value="Achievement">Achievement</option>
                                            <option value="Activity">Activity</option>
                                        </select>
                                        <div
                                            className="drop-zone"
                                            onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, 'gallery')}
                                        >
                                            <p>Drop Event Image</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div
                                            className="drop-zone"
                                            onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, 'gallery')}
                                            onClick={() => document.getElementById('gallery-upload')?.click()}
                                            style={{ marginBottom: '10px', minHeight: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            {galleryImages.length > 0 ? (
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', width: '100%' }}>
                                                    {galleryImages.map((img, i) => (
                                                        <img key={i} src={img} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '4px' }} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <>
                                                    <ImageIcon size={40} style={{ opacity: 0.5, marginBottom: '10px' }} />
                                                    <span>Drop multiple images here</span>
                                                </>
                                            )}
                                        </div>
                                        <input type="file" id="gallery-upload" hidden multiple onChange={(e) => handleFileSelect(e, 'gallery')} />
                                        <button className="btn" style={{ width: '100%' }} onClick={handleAddGallery}>Add Album</button>
                                    </div>
                                </div>

                                {/* Gallery List */}
                                <div style={{ marginTop: '40px', borderTop: '1px solid var(--glass-border)', paddingTop: '30px' }}>
                                    <h4 style={{ marginBottom: '20px' }}>Gallery Items ({state.gallery.length})</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                        {state.gallery.map(item => (
                                            <div key={item.id} style={{
                                                background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px',
                                                display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative'
                                            }}>
                                                <img src={item.image} style={{ width: '100%', height: '100px', borderRadius: '8px', objectFit: 'cover' }} />
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.title}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.date} • {item.category}</div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Delete ' + item.title + '?')) {
                                                            dispatch({ type: 'DELETE_GALLERY_ITEM', payload: item.id });
                                                            toast.success('Item removed');
                                                        }
                                                    }}
                                                    style={{
                                                        position: 'absolute', top: '10px', right: '10px',
                                                        background: 'rgba(255,0,0,0.8)', border: 'none', color: 'white',
                                                        width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
}
