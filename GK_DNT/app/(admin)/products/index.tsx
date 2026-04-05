import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { fetchAllProducts, deleteProduct } from '../../../services/productService';
import { useFocusEffect, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../../store/authStore';

export default function ProductAdminList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout); // <-- lấy logout

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetchAllProducts();
            if (res.success) setProducts(res.data);
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Không thể tải dữ liệu' });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const confirmDelete = (id: string) => {
        Alert.alert("Xác nhận", "Xóa sản phẩm này?", [
            { text: "Hủy" },
            {
                text: "Xóa", onPress: async () => {
                    const res = await deleteProduct(id);
                    if (res.success) {
                        Toast.show({ type: 'success', text1: 'Đã xóa thành công' });
                        loadData();
                    }
                }
            }
        ]);
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    return (
        <View className="flex-1 p-4 bg-slate-50">
            <View className="flex-row items-center justify-between mt-12 mb-6">
                <Text className="text-2xl font-black text-slate-800">DANH SÁCH SP</Text>

                <View className="flex-row">
                    <TouchableOpacity
                        onPress={() => router.push('/(admin)/products/add')}
                        className="px-4 py-2 mr-2 bg-blue-600 rounded-full shadow-lg"
                    >
                        <Text className="font-bold text-white">+ Thêm</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleLogout}
                        className="px-4 py-2 bg-red-600 rounded-full shadow-lg"
                    >
                        <Text className="font-bold text-white">Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={products}
                keyExtractor={(item: any) => item._id}
                onRefresh={loadData}
                refreshing={loading}
                renderItem={({ item }) => (
                    <View className="flex-row items-center p-4 mb-4 bg-white shadow-sm rounded-3xl">
                        <Image source={{ uri: item.hinhanh }} className="w-20 h-20 rounded-2xl bg-slate-100" />
                        <View className="flex-1 ml-4">
                            <Text className="text-slate-400 text-[10px] font-bold uppercase">{item.loaisp}</Text>
                            <Text className="text-lg font-bold text-slate-800" numberOfLines={1}>{item.tensp}</Text>
                            <Text className="font-black text-blue-600">{item.gia.toLocaleString()} VNĐ</Text>

                            <View className="flex-row mt-2">
                                <TouchableOpacity
                                    className="mr-4"
                                    onPress={() => router.push({ pathname: '/(admin)/products/edit', params: item })}
                                >
                                    <Text className="font-bold text-amber-500">Sửa</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => confirmDelete(item._id)}>
                                    <Text className="font-bold text-red-500">Xóa</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}