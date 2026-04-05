import express from 'express'


import { handleImageUpload, addNewProduct, fetchAllProduct, editProduct, deleteProduct } from '../controllers/products/productController.js'

import { upload, imageUploadUtils } from '../helpers/cloudinary.js';

const router = express.Router();

router.post('/upload-image', upload.single('image'), handleImageUpload);

router.get('/getall', fetchAllProduct);

router.post('/add', addNewProduct);

router.put('/edit/:id', editProduct);

router.delete('/delete/:id', deleteProduct);



export default router