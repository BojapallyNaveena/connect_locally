import express from 'express';
import { createJob, getNearbyJobs, getJobs } from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public/Protected hybrid (depending on if you want guests to see nearby jobs)
router.get('/nearby', getNearbyJobs);
router.get('/', getJobs);

// Protected routes
router.post('/', protect, createJob);

export default router;
