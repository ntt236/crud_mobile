import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../models/User';

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    loadAuthFromStorage: () => Promise<void>; // <-- mới
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    setAuth: async (user, token) => {
        await AsyncStorage.setItem('user_token', token);
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        set({ user, token });
    },
    logout: async () => {
        await AsyncStorage.removeItem('user_token');
        await AsyncStorage.removeItem('user_data');
        set({ user: null, token: null });
    },
    loadAuthFromStorage: async () => {
        const token = await AsyncStorage.getItem('user_token');
        const userData = await AsyncStorage.getItem('user_data');
        if (token && userData) {
            set({ token, user: JSON.parse(userData) });
        }
    },
}));