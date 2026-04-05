import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadProductImage, addNewProduct } from '../../../services/productService';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function AddProduct() {
    const [form, setForm] = useState({ idsanpham: '', tensp: '', loaisp: '', gia: '', hinhanh: '' });
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

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
                    // Sửa lại đoạn này để khớp với Backend trả về ở bước 1
                    setForm({ ...form, hinhanh: uploadRes.url });
                    Toast.show({ type: 'success', text1: 'Đã tải ảnh lên Cloudinary' });
                } else {
                    Toast.show({ type: 'error', text1: 'Lỗi tải ảnh' });
                }
            } catch (e) {
                Toast.show({ type: 'error', text1: 'Lỗi tải ảnh' });
                console.log("🚀 Upload error:", e);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const submit = async () => {
        if (!form.tensp || !form.gia || !form.hinhanh) {
            return Toast.show({ type: 'error', text1: 'Vui lòng nhập đủ thông tin và ảnh' });
        }
        try {
            const res = await addNewProduct({ ...form, gia: Number(form.gia), idsanpham: Number(form.idsanpham) });
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Thêm thành công' });
                router.back();
            }
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Không thể thêm sản phẩm' });
        }
    };

    return (
        <ScrollView className="flex-1 p-6 bg-white">
            <Text className="mt-10 mb-6 text-3xl font-black text-slate-800">MÓN MỚI ➕</Text>

            <TouchableOpacity
                onPress={handlePickImage}
                className="items-center justify-center w-full mb-6 overflow-hidden border-2 border-dashed h-52 bg-slate-100 rounded-3xl border-slate-300"
            >
                {isUploading ? <ActivityIndicator color="#2563eb" /> :
                    form.hinhanh ? <Image source={{ uri: form.hinhanh }} className="w-full h-full" /> :
                        <Text className="font-bold text-slate-400">CHỌN HÌNH ẢNH</Text>}
            </TouchableOpacity>

            <TextInput className="p-4 mb-4 bg-slate-50 rounded-2xl" placeholder="Mã ID số" keyboardType="numeric" onChangeText={(v) => setForm({ ...form, idsanpham: v })} />
            <TextInput className="p-4 mb-4 bg-slate-50 rounded-2xl" placeholder="Tên sản phẩm" onChangeText={(v) => setForm({ ...form, tensp: v })} />
            <TextInput className="p-4 mb-4 bg-slate-50 rounded-2xl" placeholder="Loại (Ví dụ: Đồ uống)" onChangeText={(v) => setForm({ ...form, loaisp: v })} />
            <TextInput className="p-4 mb-8 bg-slate-50 rounded-2xl" placeholder="Giá bán" keyboardType="numeric" onChangeText={(v) => setForm({ ...form, gia: v })} />

            <TouchableOpacity onPress={submit} className="items-center p-5 bg-blue-600 shadow-xl rounded-2xl shadow-blue-300">
                <Text className="text-lg font-black text-white">XÁC NHẬN THÊM</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}