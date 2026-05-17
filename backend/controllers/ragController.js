import { queryRAG } from '../rag/ragChain.js';
import { indexSize } from '../rag/vectorStore.js';
import { generateEmbedding, jobToEmbedText, userToEmbedText } from '../rag/embeddings.js';
import { batchUpsert } from '../rag/vectorStore.js';
import { Job, User } from '../models/index.js';

/**
 * POST /api/rag/chat
 * Main RAG chat endpoint — accepts user query and returns AI response
 */
export const ragChat = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: 'Query is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        message: 'GEMINI_API_KEY not configured. Add it to your backend .env file.',
        answer: '⚠️ AI features require a Gemini API key. Ask the admin to configure it.'
      });
    }

    const result = await queryRAG(query.trim());
    res.status(200).json(result);

  } catch (error) {
    console.error('[RAG] Chat error:', error.message);
    res.status(500).json({ 
      message: 'RAG query failed',
      answer: `❌ AI Error: ${error.message}`,
      error: error.message
    });
  }
};

/**
 * POST /api/rag/index
 * Trigger re-indexing from the API (admin use)
 */
export const triggerReindex = async (req, res) => {
  try {
    // Index Jobs
    const jobs = await Job.findAll({
      include: [{ model: User, as: 'postedBy', attributes: ['name', 'rating'] }]
    });

    const items = [];
    for (const jobDoc of jobs) {
      const job = jobDoc.toJSON();
      try {
        const text = jobToEmbedText(job);
        const embedding = await generateEmbedding(text);
        items.push({
          metadata: {
            id: job.id, type: 'job', title: job.title, category: job.category,
            address: job.address, paymentAmount: job.paymentAmount, paymentMode: job.paymentMode,
            urgency: job.urgency, status: job.status,
            postedBy: job.postedBy?.name || 'Unknown', rating: job.postedBy?.rating || 0,
            description: job.description?.slice(0, 200), lat: job.lat, lng: job.lng,
          },
          embedding
        });
      } catch (e) {
        console.error(`[RAG] Skipping job ${job.id}:`, e.message);
      }
    }

    // Index Users
    const users = await User.findAll();
    for (const userDoc of users) {
      const user = userDoc.toJSON();
      try {
        const text = userToEmbedText(user);
        const embedding = await generateEmbedding(text);
        items.push({
          metadata: {
            id: user.id, type: 'user', name: user.name, role: user.role,
            skills: user.skills, rating: user.rating, reviewsCount: user.reviewsCount,
            address: user.address, availability: user.availability,
            bio: user.bio?.slice(0, 200), lat: user.lat, lng: user.lng,
          },
          embedding
        });
      } catch (e) {
        console.error(`[RAG] Skipping user ${user.id}:`, e.message);
      }
    }

    const total = batchUpsert(items);
    res.status(200).json({ message: 'Indexing complete', total, jobsProcessed: jobs.length, usersProcessed: users.length });

  } catch (error) {
    console.error('[RAG] Reindex error:', error);
    res.status(500).json({ message: 'Indexing failed', error: error.message });
  }
};

/**
 * GET /api/rag/status
 * Check how many items are indexed
 */
export const ragStatus = async (req, res) => {
  try {
    const total = indexSize();
    res.status(200).json({
      status: total > 0 ? 'ready' : 'empty',
      totalIndexed: total,
      message: total > 0 
        ? `RAG index has ${total} items. Ready for queries!`
        : 'Index is empty. Run the indexer: node rag/indexer.js'
    });
  } catch (error) {
    res.status(500).json({ message: 'Status check failed' });
  }
};
