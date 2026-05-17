import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
try {
  const result = await genAI.listModels();
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error('ERROR', err.toString());
}
