import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { loginApi } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const setAuth = useAuthStore((state) => state.setAuth);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Vui lòng nhập đủ email và mật khẩu' });
            return;
        }

        setLoading(true);
        try {
            const res = await loginApi(email.trim(), password);

            if (res.success) {
                // Lưu thông tin vào Zustand Store
                setAuth(res.user, res.token);

                Toast.show({ type: 'success', text1: 'Thành công', text2: res.message });

                // Chuyển hướng dựa trên role
                if (res.user.role === 'admin') {
                    router.replace('/(admin)/products');
                } else {
                    router.replace('/');
                }
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Đăng nhập thất bại',
                text2: error.message || 'Có lỗi xảy ra'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="justify-center flex-1 p-6 bg-slate-50">
            <View className="p-8 bg-white shadow-sm rounded-3xl">
                <Text className="items-center mb-2 text-3xl font-extrabold text-center text-slate-800"> Đăng nhập </Text>
                <View className="space-y-4">
                    <TextInput
                        className="p-4 bg-slate-100 rounded-xl text-slate-800"
                        placeholder="Email của bạn"
                        placeholderTextColor="#94a3b8"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        className="p-4 mt-4 bg-slate-100 rounded-xl text-slate-800"
                        placeholder="Mật khẩu"
                        placeholderTextColor="#94a3b8"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    className={`mt-8 p-4 rounded-xl items-center ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-lg font-bold text-white">Đăng nhập</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push('/(auth)/register' as any)}
                    className="mt-6"
                >
                    <Text className="text-center text-slate-600">
                        Chưa có tài khoản? <Text className="font-bold text-blue-600">Đăng ký ngay</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}