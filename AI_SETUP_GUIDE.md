# HyperLocal Connect - AI Setup Guide

## 🚀 Getting Your Gemini API Key

To enable full AI-powered job and talent search, you need a Google Gemini API key:

### Step 1: Visit Google AI Studio
Go to: https://aistudio.google.com/app/apikey

### Step 2: Create API Key
1. Click "Create API Key"
2. Choose your Google account
3. Copy the generated API key

### Step 3: Add to Backend
1. Open `backend/.env` file
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=AIzaSyD_your_actual_key_here
   ```

### Step 4: Restart Backend
```bash
# Stop the current backend (Ctrl+C)
# Then restart
cd backend
node server.js
```

### Step 5: Index Your Data
```bash
cd backend
node rag/indexer.js
```

## ✨ What You'll Get

Once configured, the AI assistant can:
- Understand natural language queries
- Search through jobs AND user profiles
- Provide intelligent recommendations
- Match skills with opportunities
- Give personalized responses

## 🎯 Demo Mode

Without the API key, you'll see demo responses that showcase the functionality. The interface works perfectly - you just get sample data instead of real AI-powered search.

## 🔧 Troubleshooting

- **"API key not valid"**: Double-check your API key in `.env`
- **Database errors**: Ensure MySQL is running and credentials are correct
- **Port issues**: Make sure ports 5000 (backend) and 5174 (frontend) are free

Happy coding! 🤖✨