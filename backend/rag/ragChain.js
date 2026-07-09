import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateEmbedding } from './embeddings.js';
import { querySimilar, indexSize } from './vectorStore.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a smart hyperlocal job assistant for HyperLocal Connect — a platform that connects local workers with job opportunities and helps find skilled people.

Your instructions are:
1. Prioritize answering the user's query directly and accurately.
2. If the user query is about finding jobs, workers, or service categories, search through the provided database context below and present the best matches clearly.
3. If the user asks a general question, platform support question (e.g. how to apply, how payments work, how to post a job, how to verify Aadhar), or general knowledge question, answer it directly and correctly using your general knowledge. Do not say "insufficient context" for general questions; answer them naturally and align your response with the platform's features (e.g. mentioning the Jobs page, Payments tab, Profile verification page, or Emergency Hub).

When listing jobs/users:
- Be conversational and helpful
- Highlight key details like pay, location, urgency
- Format responses clearly with bolding
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
  const queryClean = userQuery.trim().toLowerCase();
  
  // List of patterns that indicate conversational, greeting, gratitude, or identity queries
  const conversationalPatterns = [
    /\b(hi|hello|hey|yo|greetings|good\s*morning|good\s*afternoon|good\s*evening)\b/i,
    /\b(thanks|thank\s*you|thankyou)\b/i,
    /\b(bye|goodbye|see\s*you)\b/i,
    /\b(who\s*are\s*you|what\s*is\s*your\s*name|your\s*name|about\s*yourself|about\s*you|tell\s*me\s*about\s*you|tell\s*about\s*yourself|who\s*are\s*u|who\s*r\s*u)\b/i,
    /\b(how\s*are\s*you|how\s*is\s*it\s*going|how's\s*it\s*going|whats\s*up|what's\s*up|how\s*do\s*you\s*do|how\s*are\s*you\s*doing)\b/i,
    /\b(ok|okay|cool|fine|nice|great|awesome|sure|good|perfect|yes|no|yeah|yep|nope)\b/i,
    /\b(yourself|you)\b/i
  ];

  // Strong keywords that indicate a job/worker search query
  const searchKeywords = ['job', 'work', 'hire', 'post', 'find', 'search', 'apply', 'delivery', 'tutor', 'clean', 'plumb', 'electric', 'driver', 'cook', 'maid', 'helper', 'ngo', 'opportunity', 'skills', 'coordinates', 'address', 'payment', 'money', 'rupees'];

  const matchesConversational = conversationalPatterns.some(pattern => pattern.test(queryClean));
  const hasSearchKeyword = searchKeywords.some(keyword => queryClean.includes(keyword));

  // It is conversational if it matches a conversational pattern and does not contain job search terms
  const isConversational = matchesConversational && !hasSearchKeyword;
  
  if (isConversational) {
    const prompt = `You are a friendly hyperlocal job assistant for HyperLocal Connect.
The user said: "${userQuery}"
Provide a warm, polite, and brief response (e.g., greeting them back, saying "my pleasure!" / "you're welcome!", explaining how you can help them find local jobs or hire workers). Do not list or reference any jobs or database results.`;

    const MODELS_TO_TRY = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro'];
    let answer = '';

    if (process.env.GEMINI_API_KEY) {
      for (const modelName of MODELS_TO_TRY) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          answer = result.response.text();
          break;
        } catch (llmErr) {
          console.error(`[RAG] Conversational Model ${modelName} failed:`, llmErr.message);
        }
      }
    }

    if (!answer) {
      if (/thank/i.test(queryClean)) {
        answer = "My pleasure! Let me know if you need help finding jobs or posting a new opportunity. 😊";
      } else if (/bye/i.test(queryClean)) {
        answer = "Goodbye! Have a great day ahead. Feel free to return whenever you need to find local help or work. 👋";
      } else if (/who/i.test(queryClean) || /name/i.test(queryClean) || /yourself/i.test(queryClean) || /about\s*you/i.test(queryClean)) {
        answer = "I am the HyperLocal Connect AI Assistant. I'm here to help you search for jobs and find skilled workers in your local community! 🤖";
      } else if (/how\s*are\s*you/i.test(queryClean) || /how\s*is\s*it/i.test(queryClean) || /how's\s*it/i.test(queryClean) || /what\s*'s\s*up/i.test(queryClean) || /whats\s*up/i.test(queryClean) || /how\s*do\s*you\s*do/i.test(queryClean)) {
        answer = "I'm doing great, thank you for asking! 😊 I'm ready to help you find jobs or local professionals. What can I do for you today?";
      } else if (/\b(ok|okay|cool|fine|nice|great|awesome|sure|good|perfect|yes|no|yeah|yep|nope)\b/i.test(queryClean)) {
        answer = "Awesome! Let me know if you want to search for a specific job (like 'delivery' or 'tutor') or find local professionals. 👍";
      } else {
        answer = "Hello! 👋 How can I help you today? You can ask me to find specific jobs (like 'Tutoring' or 'Delivery'), or find workers with specific skills near you.";
      }
    }

    return {
      answer,
      sources: [],
      totalIndexed: indexSize(),
      queryProcessed: userQuery
    };
  }

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
    console.error('[RAG] Embedding failed, returning API key notice:', err.message);
    return {
      answer: `🤖 **HyperLocal Assistant**

I couldn't process your request: **"${userQuery}"**.

💡 *Tip: This query requires an AI model connection. Please configure a valid \`GEMINI_API_KEY\` in your backend \`.env\` file to enable semantic searches and general question-answering!*`,
      sources: [],
      totalIndexed,
      queryProcessed: userQuery
    };
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
    const bestScore = topMatches[0]?.score || 0;

    if (bestScore < 0.35) {
      let fallback = `🤖 **HyperLocal Assistant**\n\n`;
      fallback += `I couldn't find any jobs or workers matching your query: **"${userQuery}"**.\n\n`;
      fallback += `💡 *Tip: If you are asking a general question (e.g., platform help, account questions), please configure a valid \`GEMINI_API_KEY\` in the backend \`.env\` file. This will enable me to answer all your general questions directly!*`;
      answer = fallback;
    } else {
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
  }

  return {
    answer,
    sources: topMatches.map(m => m.metadata),
    totalIndexed,
    queryProcessed: userQuery
  };
};
