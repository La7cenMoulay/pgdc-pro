import React, { createContext, useContext, useReducer, useEffect } from 'react';
import initialData from './initialData.json';

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
const DEFAULT_STATE: State = initialData as State;

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
