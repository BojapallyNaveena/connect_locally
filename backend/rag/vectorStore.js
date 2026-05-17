import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = path.join(__dirname, '../rag_index/index.json');

// Ensure directory exists
const ensureDir = () => {
  const dir = path.dirname(INDEX_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Load index from disk
const loadIndex = () => {
  try {
    if (fs.existsSync(INDEX_PATH)) {
      return JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
    }
  } catch (e) {
    console.error('[VectorStore] Failed to load index:', e.message);
  }
  return [];
};

// Save index to disk
const saveIndex = (index) => {
  ensureDir();
  fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2));
};

// Cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] ** 2;
    magB += vecB[i] ** 2;
  }
  const mag = Math.sqrt(magA) * Math.sqrt(magB);
  return mag === 0 ? 0 : dot / mag;
};

// Add item to vector store
export const addItem = (metadata, embedding) => {
  const index = loadIndex();
  // Remove duplicate if same id exists
  const filtered = index.filter(item => item.metadata.id !== metadata.id || item.metadata.type !== metadata.type);
  filtered.push({ metadata, embedding });
  saveIndex(filtered);
};

// Batch upsert items
export const batchUpsert = (items) => {
  ensureDir();
  const index = loadIndex();
  const map = new Map(index.map(i => [`${i.metadata.type}_${i.metadata.id}`, i]));
  for (const { metadata, embedding } of items) {
    map.set(`${metadata.type}_${metadata.id}`, { metadata, embedding });
  }
  saveIndex([...map.values()]);
  return map.size;
};

// Query top-K similar items
export const querySimilar = (queryEmbedding, topK = 7) => {
  const index = loadIndex();
  if (index.length === 0) return [];

  const scored = index.map(item => ({
    metadata: item.metadata,
    score: cosineSimilarity(queryEmbedding, item.embedding)
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).filter(s => s.score > 0.3); // Only return relevant results
};

// Check if index has data
export const indexSize = () => loadIndex().length;

// Clear index (for re-indexing)
export const clearIndex = () => {
  ensureDir();
  saveIndex([]);
};
