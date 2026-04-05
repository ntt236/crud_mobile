import express from 'express'
import { registerUser, loginUser, logoutUser, authMiddleWare } from '../controllers/auth/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.get('/me', authMiddleWare, (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user: req.user
    });
});

export default router