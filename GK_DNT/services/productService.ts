import { Platform } from 'react-native'; // Thêm ở đây
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://5647-2001-ee1-db07-b4f0-9cea-af3b-11e7-5b7f.ngrok-free.app/api/admin/products';

const getHeader = async (isMultipart = false) => {
    const token = await AsyncStorage.getItem('user_token');

    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
    };

    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }

    return { headers };
};

export const uploadProductImage = async (imageUri: string) => {
    const formData = new FormData();

    // Bây giờ Platform đã được import nên sẽ không còn lỗi nữa
    const uri = Platform.OS === 'android' ? imageUri : imageUri.replace('file://', '');

    formData.append('image', {
        uri: uri,
        type: 'image/jpeg',
        name: 'upload.jpg',
    } as any);

    const header = await getHeader(true);

    const res = await axios.post(`${BASE_URL}/upload-image`, formData, {
        headers: {
            ...header.headers,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data) => {
            return data;
        },
    });

    return res.data;
};
// 2. Lấy danh sách
export const fetchAllProducts = async () => {
    const res = await axios.get(`${BASE_URL}/getall`, await getHeader());
    return res.data;
};

// 3. Thêm mới
export const addNewProduct = async (data: any) => {
    const res = await axios.post(`${BASE_URL}/add`, data, await getHeader());
    return res.data;
};

// 4. Sửa (Dùng _id của MongoDB)
export const updateProduct = async (id: string, data: any) => {
    const res = await axios.put(`${BASE_URL}/edit/${id}`, data, await getHeader());
    return res.data;
};

// 5. Xóa
export const deleteProduct = async (id: string) => {
    const res = await axios.delete(`${BASE_URL}/delete/${id}`, await getHeader());
    return res.data;
};