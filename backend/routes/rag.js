import express from 'express';
import { ragChat, triggerReindex, ragStatus } from '../controllers/ragController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public: Check index status
router.get('/status', ragStatus);

// Protected: Chat with RAG
router.post('/chat', protect, ragChat);

// Protected: Trigger reindex (admin)
router.post('/index', protect, triggerReindex);

export default router;
