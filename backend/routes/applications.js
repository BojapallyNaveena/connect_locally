import express from 'express';
import { applyForJob, getMyApplications, updateApplicationStatus, submitWork } from '../controllers/applicationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, applyForJob);
router.get('/me', protect, getMyApplications);
router.put('/status-update', protect, updateApplicationStatus);
router.put('/submit-work', protect, submitWork);

export default router;
