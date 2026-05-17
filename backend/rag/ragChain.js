import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateEmbedding } from './embeddings.js';
import { querySimilar, indexSize } from './vectorStore.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a smart hyperlocal job assistant for HyperLocal Connect — a platform that connects local workers with job opportunities and helps find skilled people.

You ONLY answer using the provided job and user context from the database. If the context is insufficient or no matches, say so honestly.

When answering:
- Be conversational and helpful
- For job queries: Highlight the most relevant jobs first, mention key details like pay, location, urgency
- For user queries: Highlight relevant users with their skills, ratings, and availability
- Format responses clearly with titles bolded
- If the user asks about location, highlight addresses
- If asking about pay, compare amounts across options
- Always end with an encouraging call-to-action`;

/**
 * Main RAG query function
 * 1. Embed user query
 * 2. Find similar jobs via vector search
 * 3. Build context from retrieved jobs
 * 4. Send to Gemini LLM with structured prompt
 * 5. Return AI response + raw matches
 */
export const queryRAG = async (userQuery) => {
  const totalIndexed = indexSize();

  if (totalIndexed === 0) {
    return {
      answer: "The job index is empty. Please run the indexer first: `node rag/indexer.js`. Once jobs are indexed, I can help you find the perfect opportunity!",
      sources: [],
      totalIndexed: 0
    };
  }

  // Step 1: Embed the user's query
  let queryEmbedding;
  try {
    queryEmbedding = await generateEmbedding(userQuery);
  } catch (err) {
    throw new Error(`Embedding failed: ${err.message}. Check your GEMINI_API_KEY.`);
  }

  // Step 2: Vector search — find top-K similar jobs
  const topMatches = querySimilar(queryEmbedding, 8);

  if (topMatches.length === 0) {
    return {
      answer: `I searched through ${totalIndexed} jobs but couldn't find anything matching "${userQuery}". Try searching with different keywords like the category (Tutoring, Delivery, Cleaning), location, or pay range.`,
      sources: [],
      totalIndexed
    };
  }

  // Step 3: Build structured context from retrieved jobs and users
  const jobMatches = topMatches.filter(m => m.metadata.type === 'job');
  const userMatches = topMatches.filter(m => m.metadata.type === 'user');

  let contextBlock = '';

  if (jobMatches.length > 0) {
    contextBlock += 'JOBS:\n' + jobMatches.map((match, idx) => {
      const m = match.metadata;
      return `[Job ${idx + 1}]
Title: ${m.title}
Category: ${m.category}
Location: ${m.address}
Pay: ₹${m.paymentAmount} via ${m.paymentMode}
Urgency: ${m.urgency}
Status: ${m.status}
Posted by: ${m.postedBy} (Rating: ${m.rating > 0 ? m.rating.toFixed(1) + '★' : 'New'})
Description: ${m.description || 'No description'}
Relevance Score: ${(match.score * 100).toFixed(0)}%`;
    }).join('\n\n---\n\n') + '\n\n';
  }

  if (userMatches.length > 0) {
    contextBlock += 'USERS:\n' + userMatches.map((match, idx) => {
      const m = match.metadata;
      return `[User ${idx + 1}]
Name: ${m.name}
Role: ${m.role}
Skills: ${Array.isArray(m.skills) ? m.skills.join(', ') : m.skills}
Rating: ${m.rating} stars (${m.reviewsCount} reviews)
Location: ${m.address || 'Not specified'}
Available: ${m.availability ? 'Yes' : 'No'}
Bio: ${m.bio || 'No bio'}
Relevance Score: ${(match.score * 100).toFixed(0)}%`;
    }).join('\n\n---\n\n');
  }

  // Step 4: Build prompt and call Gemini
  const prompt = `${SYSTEM_PROMPT}

USER QUERY: "${userQuery}"

RETRIEVED CONTEXT (from database, sorted by relevance):
${contextBlock}

Please provide:
1. A direct answer to the user's query
2. The top 3 best matching jobs (if relevant)
3. The top 3 best matching users (if relevant)
4. Brief explanation of why each matches
5. Any alternatives if available
6. A helpful next step (like "Click Apply Now on the Jobs page" or "Contact this user")`;

  // Try models in order of preference
  const MODELS_TO_TRY = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro'];
  let answer = '';
  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`[RAG] Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      answer = result.response.text();
      console.log(`[RAG] Success with model: ${modelName}`);
      break;
    } catch (llmErr) {
      console.error(`[RAG] Model ${modelName} failed:`, llmErr.message);
      lastError = llmErr;
    }
  }

  if (!answer) {
    // Fallback: Format results directly without LLM
    console.log('[RAG] Using fallback formatter (no LLM)');
    const jobMatches = topMatches.filter(m => m.metadata.type === 'job');
    const userMatches = topMatches.filter(m => m.metadata.type === 'user');

    let fallback = `🔍 **Search Results for: "${userQuery}"**\n\n`;

    if (jobMatches.length > 0) {
      fallback += `**📋 Matching Jobs (${jobMatches.length} found):**\n\n`;
      jobMatches.slice(0, 5).forEach((m, i) => {
        const j = m.metadata;
        fallback += `**${i + 1}. ${j.title}**\n`;
        fallback += `📍 ${j.address}\n`;
        fallback += `💰 ₹${j.paymentAmount} (${j.paymentMode}) · ⚡ ${j.urgency} urgency\n`;
        fallback += `🏷️ ${j.category} · Posted by ${j.postedBy}\n`;
        if (j.description) fallback += `📝 ${j.description}\n`;
        fallback += `\n`;
      });
    }

    if (userMatches.length > 0) {
      fallback += `**👥 Matching Workers (${userMatches.length} found):**\n\n`;
      userMatches.slice(0, 3).forEach((m, i) => {
        const u = m.metadata;
        fallback += `**${i + 1}. ${u.name}** (${u.role})\n`;
        fallback += `⭐ ${u.rating} rating · ${u.availability ? '✅ Available' : '❌ Busy'}\n`;
        if (u.skills) fallback += `🛠️ Skills: ${Array.isArray(u.skills) ? u.skills.join(', ') : u.skills}\n`;
        fallback += `\n`;
      });
    }

    fallback += `👉 Go to the **Jobs page** to apply or post a job!`;
    answer = fallback;
  }

  return {
    answer,
    sources: topMatches.map(m => m.metadata),
    totalIndexed,
    queryProcessed: userQuery
  };
};
