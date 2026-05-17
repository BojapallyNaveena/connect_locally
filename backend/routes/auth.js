import express from 'express';
import { register, login, getProfile, updateProfile, getPublicProfile, sendOTP, verifyOTP } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.get('/profile/:id', protect, getPublicProfile);
router.put('/profile', protect, updateProfile);
router.post('/send-otp', protect, sendOTP);
router.post('/verify-otp', protect, verifyOTP);

export default router;
