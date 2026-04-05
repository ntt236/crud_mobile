import mongoose from "mongoose";

export const ProductSchema = new mongoose.Schema({
    idsanpham: Number,
    tensp: String,
    loaisp: String,
    gia: Number,
    hinhanh: String
}, { timestamps: true })

export const Product = mongoose.model('Product', ProductSchema);
