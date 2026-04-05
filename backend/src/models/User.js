import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    }
});

export const User = mongoose.model('User', UserSchema);
