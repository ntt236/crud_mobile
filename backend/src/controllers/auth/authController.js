
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../../models/User.js';
import dotenv from 'dotenv'
dotenv.config();

//register
const registerUser = async (req, res) => {

    const { userName, email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.json({
                success: false,
                message: "Người dùng đã tồn tại",
            })
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName,
            email,
            password: hashPassword,
        })
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "Đăng ký thành công"
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Đăng ký thất bại"
        })

    }
}


//login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Thiếu email hoặc password",
        });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Người dùng không tồn tại",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu không đúng",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.json({
            success: true,
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                userName: user.userName,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Đăng nhập thất bại",
        });
    }
};

//logout

const logoutUser = (req, res) => {
    res.json({
        success: true,
        message: "Đăng xuất thành công"
    });
};

//auth middleware

const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ hoặc hết hạn"
        });
    }
};



export { registerUser, loginUser, logoutUser, authMiddleWare }