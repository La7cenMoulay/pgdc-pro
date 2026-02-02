import React, { createContext, useContext, useReducer, useEffect } from 'react';

// --- Types ---
export type Theme = 'dark' | 'light';

export interface Member {
    id: number;
    name: string;
    role: string;
    category: 'Tech' | 'Design' | 'Board';
    image: string;
}

export interface Achievement {
    year: string;
    title: string;
    description: string;
}

export interface GalleryItem {
    id: number;
    title: string;
    date: string;
    image: string;
    images?: string[];
    category: 'Event' | 'Achievement' | 'Activity';
}

interface State {
    theme: Theme;
    hero: {
        title: string;
        subtitle: string;
        ctaText: string;
    };
    about: {
        title: string;
        description: string;
        features: Array<{ icon: string; title: string; text: string }>;
    };
    anniversary: {
        isVisible: boolean;
        title: string;
        achievements: Achievement[];
    };
    gallery: GalleryItem[];
    members: Member[];
}

// --- Initial State ---
const DEFAULT_STATE: State = {
    theme: 'dark',
    hero: {
        title: "Programming & Graphic Design Club",
        subtitle: "Where Creativity Meets Logic",
        ctaText: "Join Our Community",
    },
    about: {
        title: "About PGDC",
        description: "We are a community dedicated to empowering students in the fields of Computer Science and Digital Arts.",
        features: [
            { icon: "code", title: "Programming", text: "Master algorithms, web dev, and software engineering." },
            { icon: "palette", title: "Graphic Design", text: "Explore UI/UX, branding, and digital illustration." },
            { icon: "users", title: "Community", text: "Network with like-minded innovators." },
            { icon: "zap", title: "Innovation", text: "Turn ideas into reality with our tech stack." }
        ]
    },
    anniversary: {
        isVisible: false,
        title: "Our 5th Anniversary!",
        achievements: [
            { year: "2021", title: "Founded", description: "Started with 10 members." },
            { year: "2023", title: "National Award", description: "Best Student Club." },
        ]
    },
    gallery: [
        { id: 1, title: "Hackathon 2023", date: "2023-11-15", category: "Event", image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800" },
        { id: 2, title: "Best Design Award", date: "2023-09-20", category: "Achievement", image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800" }
    ],
    members: [
        { id: 1, name: "Sarah Ahmed", role: "President", category: "Board", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
        { id: 2, name: "Mohamed Ali", role: "Vice President", category: "Board", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed" },
        { id: 3, name: "Lina Othman", role: "Head of Design", category: "Design", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lina" },
        { id: 4, name: "Omar Khader", role: "Head of Tech", category: "Tech", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar" }
    ]
};

// --- Actions ---
type Action =
    | { type: 'TOGGLE_THEME' }
    | { type: 'TOGGLE_MEMORY'; payload: boolean }
    | { type: 'ADD_MEMBER'; payload: Member }
    | { type: 'DELETE_MEMBER'; payload: number }
    | { type: 'ADD_GALLERY_ITEM'; payload: GalleryItem }
    | { type: 'DELETE_GALLERY_ITEM'; payload: number };

// --- Reducer ---
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'TOGGLE_THEME':
            return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
        case 'TOGGLE_MEMORY':
            return { ...state, anniversary: { ...state.anniversary, isVisible: action.payload } };
        case 'ADD_MEMBER':
            return { ...state, members: [...state.members, action.payload] };
        case 'DELETE_MEMBER':
            return { ...state, members: state.members.filter(m => m.id !== action.payload) };
        case 'ADD_GALLERY_ITEM':
            return { ...state, gallery: [...state.gallery, action.payload] };
        case 'DELETE_GALLERY_ITEM':
            return { ...state, gallery: state.gallery.filter(item => item.id !== action.payload) };
        default:
            return state;
    }
}

// --- Context ---
const StoreContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    // Load from local storage if available
    const saved = localStorage.getItem('pgdc_pro_state');
    // deeply merge default state to ensure new keys (like gallery) exist if missing in saved state
    const parsed = saved ? JSON.parse(saved) : {};
    const initialState = { ...DEFAULT_STATE, ...parsed, gallery: parsed.gallery || DEFAULT_STATE.gallery };

    const [state, dispatch] = useReducer(reducer, initialState);

    // Sync with LocalStorage
    useEffect(() => {
        localStorage.setItem('pgdc_pro_state', JSON.stringify(state));
        document.documentElement.setAttribute('data-theme', state.theme);
    }, [state]);

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (!context) throw new Error("useStore must be used within StoreProvider");
    return context;
}
