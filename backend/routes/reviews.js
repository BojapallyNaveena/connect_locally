import express from 'express';
import { addReview, getUserReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:userId', getUserReviews);
router.post('/', protect, addReview);

export default router;
