import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const EMBEDDING_MODEL = 'gemini-embedding-001';

/**
 * Generate a single embedding vector for a text string
 */
export const generateEmbedding = async (text) => {
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  const result = await model.embedContent(text);
  return result.embedding.values;
};

/**
 * Generate embeddings for a batch of texts with rate-limit delay
 */
export const generateBatchEmbeddings = async (texts, delayMs = 200) => {
  const embeddings = [];
  for (const text of texts) {
    const emb = await generateEmbedding(text);
    embeddings.push(emb);
    if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));
  }
  return embeddings;
};

/**
 * Build a rich text string from a job record for embedding
 */
export const jobToEmbedText = (job) => {
  const parts = [
    job.title,
    job.description,
    job.category,
    job.address,
    `Payment: ₹${job.paymentAmount} via ${job.paymentMode}`,
    `Urgency: ${job.urgency}`,
    job.postedBy?.name ? `Posted by ${job.postedBy.name}` : ''
  ].filter(Boolean);
  return parts.join('. ');
};

/**
 * Build a rich text string from a user record for embedding
 */
export const userToEmbedText = (user) => {
  const skills = Array.isArray(user.skills) ? user.skills.join(', ') : user.skills;
  const parts = [
    user.name,
    user.bio,
    `Role: ${user.role}`,
    `Skills: ${skills}`,
    `Rating: ${user.rating} stars (${user.reviewsCount} reviews)`,
    user.address ? `Location: ${user.address}` : '',
    `Available: ${user.availability ? 'Yes' : 'No'}`
  ].filter(Boolean);
  return parts.join('. ');
};
