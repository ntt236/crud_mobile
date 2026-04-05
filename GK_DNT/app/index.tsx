import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function Index() {
    const user = useAuthStore((state) => state.user);
    const loadAuthFromStorage = useAuthStore((state) => state.loadAuthFromStorage);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAuthFromStorage().finally(() => setLoading(false));
    }, []);

    if (loading) return null; // hoặc splash screen

    if (user?.role === 'admin') {
        return <Redirect href="/(admin)/products" />;
    }

    return <Redirect href="/(auth)/login" />;
}