/**
 * RAG Indexer Script
 * Run this once to index all jobs into the vector store.
 * Also run whenever the database changes significantly.
 *
 * Usage: node rag/indexer.js
 */

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import sequelize from '../config/db.js';
import { Job, User } from '../models/index.js';
import { generateEmbedding, jobToEmbedText, userToEmbedText } from './embeddings.js';
import { batchUpsert, clearIndex, indexSize } from './vectorStore.js';

const BATCH_SIZE = 10;
const DELAY_MS = 300; // Respect Google API rate limits

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const indexAllData = async (forceReindex = false) => {
  console.log('\n🚀 HyperLocal Connect — RAG Indexer');
  console.log('====================================');

  await sequelize.authenticate();
  console.log('✅ Database connected');

  if (forceReindex) {
    clearIndex();
    console.log('🗑️  Cleared existing index');
  }

  // Index Jobs
  const jobs = await Job.findAll({
    include: [{ model: User, as: 'postedBy', attributes: ['name', 'rating'] }]
  });

  console.log(`📋 Found ${jobs.length} jobs to index`);

  const items = [];
  let processed = 0;

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i].toJSON();
    const text = jobToEmbedText(job);

    try {
      const embedding = await generateEmbedding(text);

      items.push({
        metadata: {
          id: job.id,
          type: 'job',
          title: job.title,
          category: job.category,
          address: job.address,
          paymentAmount: job.paymentAmount,
          paymentMode: job.paymentMode,
          urgency: job.urgency,
          status: job.status,
          postedBy: job.postedBy?.name || 'Unknown',
          rating: job.postedBy?.rating || 0,
          description: job.description?.slice(0, 200),
          lat: job.lat,
          lng: job.lng,
          indexedAt: new Date().toISOString()
        },
        embedding
      });

      processed++;
      process.stdout.write(`\r   Indexed ${processed} jobs...`);

      // Rate limit pause
      if ((i + 1) % BATCH_SIZE === 0) {
        await sleep(DELAY_MS * 2);
      } else {
        await sleep(DELAY_MS);
      }
    } catch (err) {
      console.error(`\n❌ Failed to embed job ${job.id} (${job.title}):`, err.message);
    }
  }

  // Index Users
  const users = await User.findAll();
  console.log(`\n📋 Found ${users.length} users to index`);

  for (let i = 0; i < users.length; i++) {
    const user = users[i].toJSON();
    const text = userToEmbedText(user);

    try {
      const embedding = await generateEmbedding(text);

      items.push({
        metadata: {
          id: user.id,
          type: 'user',
          name: user.name,
          role: user.role,
          skills: user.skills,
          rating: user.rating,
          reviewsCount: user.reviewsCount,
          address: user.address,
          availability: user.availability,
          bio: user.bio?.slice(0, 200),
          lat: user.lat,
          lng: user.lng,
          indexedAt: new Date().toISOString()
        },
        embedding
      });

      processed++;
      process.stdout.write(`\r   Indexed ${processed} items...`);

      // Rate limit pause
      await sleep(DELAY_MS);
    } catch (err) {
      console.error(`\n❌ Failed to embed user ${user.id} (${user.name}):`, err.message);
    }
  }

  const total = batchUpsert(items);
  console.log(`\n\n✅ Indexing complete! ${total} items in vector store (${jobs.length} jobs, ${users.length} users).`);
  console.log(`📁 Index saved to: backend/rag_index/index.json`);
  console.log('\nYou can now use the RAG chat endpoint at: POST /api/rag/chat\n');

  process.exit(0);
};

// Allow --force flag to clear and reindex
const forceReindex = process.argv.includes('--force');
indexAllData(forceReindex).catch(err => {
  console.error('Indexer failed:', err);
  process.exit(1);
});
