import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadProductImage, updateProduct } from '../../../services/productService';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function EditProduct() {
    const params = useLocalSearchParams();
    const router = useRouter();

    // FIX: Dùng String() để ép tất cả params về kiểu string nguyên bản
    const [form, setForm] = useState({
        _id: String(params._id || ''),
        idsanpham: String(params.idsanpham || ''),
        tensp: String(params.tensp || ''),
        loaisp: String(params.loaisp || ''),
        gia: String(params.gia || ''),
        hinhanh: String(params.hinhanh || '')
    });

    const [isUploading, setIsUploading] = useState(false);

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setIsUploading(true);
            try {
                const uploadRes = await uploadProductImage(result.assets[0].uri);
                if (uploadRes.success) {
                    // Backend trả về uploadRes.url
                    setForm({ ...form, hinhanh: uploadRes.url });
                    Toast.show({ type: 'success', text1: 'Đã cập nhật ảnh mới' });
                }
            } catch (e) {
                Toast.show({ type: 'error', text1: 'Lỗi tải ảnh' });
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleUpdate = async () => {
        if (!form.tensp || !form.gia || !form.hinhanh) {
            return Toast.show({ type: 'error', text1: 'Vui lòng điền đủ thông tin' });
        }

        try {
            const res = await updateProduct(form._id, {
                ...form,
                gia: Number(form.gia),
                idsanpham: Number(form.idsanpham)
            });

            if (res.success) {
                Toast.show({ type: 'success', text1: 'Cập nhật thành công' });
                router.back();
            }
           
            
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Không thể cập nhật' });
        }
    };

    return (
        <ScrollView className="flex-1 p-6 bg-white">
            <Text className="mt-10 mb-6 text-3xl font-black text-slate-800">SỬA MÓN ĂN ✏️</Text>

            {/* FIX lỗi Image: source={{ uri: form.hinhanh }} giờ đã an toàn vì form.hinhanh là string */}
            <TouchableOpacity
                onPress={handlePickImage}
                className="items-center justify-center w-full mb-6 overflow-hidden border-2 border-dashed h-52 bg-slate-100 rounded-3xl border-slate-300"
            >
                {isUploading ? <ActivityIndicator color="#2563eb" /> :
                    form.hinhanh ? (
                        <Image source={{ uri: form.hinhanh }} className="w-full h-full" />
                    ) : (
                        <Text className="font-bold text-slate-400">CHỌN HÌNH ẢNH MỚI</Text>
                    )}
            </TouchableOpacity>

            {/* FIX lỗi TextInput: value={form.xxx} an toàn vì đã ép kiểu string ở useState */}
            <Text className="mb-1 ml-2 font-bold text-slate-500">Mã ID</Text>
            <TextInput
                className="p-4 mb-4 bg-slate-50 rounded-2xl"
                value={form.idsanpham}
                keyboardType="numeric"
                onChangeText={(v) => setForm({ ...form, idsanpham: v })}
            />

            <Text className="mb-1 ml-2 font-bold text-slate-500">Tên sản phẩm</Text>
            <TextInput
                className="p-4 mb-4 bg-slate-50 rounded-2xl"
                value={form.tensp}
                onChangeText={(v) => setForm({ ...form, tensp: v })}
            />

            <Text className="mb-1 ml-2 font-bold text-slate-500">Loại</Text>
            <TextInput
                className="p-4 mb-4 bg-slate-50 rounded-2xl"
                value={form.loaisp}
                onChangeText={(v) => setForm({ ...form, loaisp: v })}
            />

            <Text className="mb-1 ml-2 font-bold text-slate-500">Giá bán</Text>
            <TextInput
                className="p-4 mb-8 bg-slate-50 rounded-2xl"
                value={form.gia}
                keyboardType="numeric"
                onChangeText={(v) => setForm({ ...form, gia: v })}
            />

            <TouchableOpacity
                onPress={handleUpdate}
                className="items-center p-5 shadow-xl bg-amber-500 rounded-2xl shadow-amber-200"
            >
                <Text className="text-lg font-black text-white">LƯU THAY ĐỔI</Text>
            </TouchableOpacity>

            <View className="h-20" />
        </ScrollView>
    );
}