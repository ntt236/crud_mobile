
import { Product } from "../../models/Product.js";
import { imageUploadUtils } from '../../helpers/cloudinary.js';
const handleImageUpload = async (req, res) => {
    try {
        // chuyển đổi dữ liệu thô khi tải file ảnh lên sang dạng chuỗi base64
        const b64 = Buffer.from(req.file.buffer).toString('base64')
        const url = "data:" + req.file.mimetype + ";base64," + b64
        const result = await imageUploadUtils(url);
        res.json({
            success: true,
            url: result.secure_url || result.url
        })
    } catch (error) {
        console.log("🚀 ~ handleImageUpload ~ error:", error)
        res.json({
            success: false,
            message: "Error uploading image"
        })
    }
}

const addNewProduct = async (req, res) => {
    const { idsanpham, tensp, loaisp, gia, hinhanh } = req.body;

    if (!tensp || !gia) {
        return res.status(400).json({
            success: false,
            message: "Thiếu dữ liệu"
        });
    }

    try {
        const newProduct = new Product({
            idsanpham,
            tensp,
            loaisp,
            gia,
            hinhanh
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Thêm sản phẩm thành công",
            data: newProduct
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Không thể thêm sản phẩm"
        });
    }
};

const fetchAllProduct = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Không thể lấy sản phẩm"
        });
    }
};

const editProduct = async (req, res) => {
    const { id } = req.params;
    const { tensp, loaisp, gia, hinhanh } = req.body;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại"
            });
        }

        product.tensp = tensp || product.tensp;
        product.loaisp = loaisp || product.loaisp;
        product.gia = gia || product.gia;
        product.hinhanh = hinhanh || product.hinhanh;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Cập nhật thành công",
            data: product
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Không thể sửa sản phẩm"
        });
    }
};

const deleteProduct = async (req, res) => {
    const {id} = req.params;

    try {
        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại"
            })
        }
        res.status(200).json({
            success: true,
            message: "Xóa thành công"
        })
    } catch (error) {
        console.log("🚀 ~ deleteProduct ~ error:", error)
        res.status(500).json({
            message: "Không thể xóa sản phẩm",
            success: false
        })
    }
}

export { handleImageUpload, addNewProduct, fetchAllProduct, editProduct, deleteProduct }