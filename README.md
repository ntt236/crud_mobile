# 📱 GK Đa Nền Tảng - Mobile + Backend

## Mô tả dự án

Dự án **GK Đa Nền Tảng** là một ứng dụng quản lý sản phẩm, bao gồm:

* **Frontend:** React Native (Expo)
* **Backend:** Node.js + Express + MongoDB
* **Chức năng chính:**

  * Đăng ký / Đăng nhập (JWT + AsyncStorage)
  * Quản lý sản phẩm (CRUD: thêm, sửa, xóa, xem danh sách)
  * Upload ảnh sản phẩm lên **Cloudinary**
  * Quản lý admin/user riêng biệt

---

## 📁 Cấu trúc dự án

```bash
GK Đa Nền Tảng/
├─ backend/                  # Backend Node.js + Express
│  ├─ src/
│  │  ├─ controllers/        # Controller cho auth & products
│  │  ├─ models/             # Mongoose models (User, Product)
│  │  ├─ routers/            # Route API
│  │  └─ helpers/            # Cloudinary & upload utils
│  ├─ package.json
│  └─ server.js
├─ GK_DNT/                   # Frontend React Native (Expo)
│  ├─ app/
│  ├─ services/              # API service
│  ├─ store/                 # Zustand state
│  └─ package.json
├─ .gitignore
└─ README.md
```

---

## ⚡ Backend

### Cài đặt

```bash
cd backend
npm install
```

### Cấu hình

Tạo file `.env` trong thư mục `backend/`:

```env
PORT=5000
MONGO_URI=<YOUR_MONGODB_URI>
JWT_SECRET=<YOUR_SECRET_KEY>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
```

### Chạy server

```bash
npm run dev
```

* Server chạy mặc định trên `http://localhost:5000`
* Endpoint chính:

  * `/api/auth` → login/register
  * `/api/admin/products` → CRUD sản phẩm

---

## ☁ Sử dụng ngrok để test từ app

1. Cài ngrok nếu chưa có:

```bash
npm install -g ngrok
```

2. Chạy ngrok để tạo public URL cho backend:

```bash
ngrok http 5000
```

3. Lấy URL hiển thị (ví dụ `https://abcd-1234.ngrok-free.app`) và thay vào `BASE_URL` trong file `GK_DNT/services/productService.ts`

---

## 📱 Frontend (React Native)

### Cài đặt

```bash
cd GK_DNT
npm install
```

### Chạy ứng dụng

```bash
npm start
```

* Mở trên **Android/iOS emulator** hoặc **Expo Go App** trên điện thoại
* API sẽ gọi đến backend thông qua **ngrok URL**

### Chức năng

* Đăng ký / đăng nhập
* Xem danh sách sản phẩm
* Thêm / sửa / xóa sản phẩm (Admin)
* Upload ảnh sản phẩm lên Cloudinary

---

## 🔐 Authentication

* JWT được lưu trong **AsyncStorage**
* Dùng **Zustand** để quản lý state user trên app
* Tự động điều hướng user/admin sau khi login

---

## 📤 Upload ảnh sản phẩm

1. Chọn ảnh từ gallery trên app
2. Gửi lên backend: `/api/admin/products/upload-image`
3. Backend upload lên **Cloudinary** và trả về URL
4. URL được lưu trong MongoDB

**Lưu ý:** Khi test bằng Postman/Thunder Client, chọn **Body → form-data**, key = `image` để upload ảnh.

---

## 🛠 Công nghệ sử dụng

* **Backend:** Node.js, Express, MongoDB, Mongoose, Cloudinary
* **Frontend:** React Native, Expo, Zustand, AsyncStorage
* **Tooling:** ngrok (remote backend testing), Toast messages, Image Picker

---

## 📌 Lưu ý

* Backend phải chạy trước khi mở app frontend
