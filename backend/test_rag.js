import dotenv from 'dotenv';
dotenv.config();
import { queryRAG } from './rag/ragChain.js';

async function run() {
  console.log("=== RAG AI INTERACTIVE TEST ===");
  
  console.log("\n1. Testing query: 'hi'");
  const res1 = await queryRAG("hi");
  console.log("Answer:", res1.answer);
  console.log("Sources found:", res1.sources.length);

  console.log("\n2. Testing query: 'thank you'");
  const res2 = await queryRAG("thank you");
  console.log("Answer:", res2.answer);
  console.log("Sources found:", res2.sources.length);

  console.log("\n3. Testing query: 'thank you so much'");
  const res3 = await queryRAG("thank you so much");
  console.log("Answer:", res3.answer);
  console.log("Sources found:", res3.sources.length);

  console.log("\n4. Testing query: 'how are you'");
  const res4 = await queryRAG("how are you");
  console.log("Answer:", res4.answer);
  console.log("Sources found:", res4.sources.length);

  console.log("\n5. Testing query: 'can you tell abput yourself'");
  const res5 = await queryRAG("can you tell abput yourself");
  console.log("Answer:", res5.answer);
  console.log("Sources found:", res5.sources.length);

  console.log("\n6. Testing query: 'what is the capital of France?'");
  const res6 = await queryRAG("what is the capital of France?");
  console.log("Answer:", res6.answer);
  console.log("Sources found:", res6.sources.length);

  console.log("\n7. Testing query: 'ok'");
  const res7 = await queryRAG("ok");
  console.log("Answer:", res7.answer);
  console.log("Sources found:", res7.sources.length);
  
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
