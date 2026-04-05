import axios from 'axios';


// services/authService.ts
const API_URL = 'https://5647-2001-ee1-db07-b4f0-9cea-af3b-11e7-5b7f.ngrok-free.app/api/auth';

export const loginApi = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: "Lỗi kết nối server" };
    }
};

export const registerApi = async (userName: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { userName, email, password });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { message: "Lỗi kết nối server" };
    }
};