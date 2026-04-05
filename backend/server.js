import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from "./src/routers/user.js"
import adminProductRouter from "./src/routers/product.js"
dotenv.config();
mongoose 
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

app.use(express.json())


app.listen(5000, '0.0.0.0', () => {
    console.log('Server running on port 5000');
});

app.use('/api/auth', authRouter)
app.use('/api/admin/products', adminProductRouter)
