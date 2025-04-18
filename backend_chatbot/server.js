// Express server for chatbot interface
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { initializeAgent, processUserQuery, detectLanguage } = require('./guidance_agent');

// Using JWT secret from environment or default
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// In-memory user storage (replace with DB later)
const users = new Map(); // username -> { username, passwordHash }

// Create Express server
const app = express();
const port = process.env.PORT || 3000;

// Add Vercel-specific settings
const isProduction = process.env.NODE_ENV === 'production';
const isPreviews = process.env.VERCEL_ENV === 'preview';
const isDevelopment = !isProduction && !isPreviews;

// Handle CORS more flexibly
const corsOptions = {
  origin: isDevelopment 
    ? ['http://localhost:3000', 'http://localhost:3001'] 
    : [process.env.FRONTEND_URL, 'https://*.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Use CORS with options
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

// Global variables to store agent state
let knowledgeBase = null;
// Store sessions in memory with key-value pairs (sessionId -> conversationHistory)
const sessions = new Map();

// Function to create a new session
function createSession() {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
    conversations: [],
    lastUpdated: new Date().toISOString()
  };
}

// Function to get or create a session
function getOrCreateSession(sessionId) {
  if (!sessionId || !sessions.has(sessionId)) {
    const newSession = createSession();
    sessions.set(newSession.id, newSession);
    return { session: newSession, isNew: true };
  }
  return { session: sessions.get(sessionId), isNew: false };
}

// Add conversation exchange to the session
function addExchangeToSession(sessionId, query, response, language) {
  const { session } = getOrCreateSession(sessionId);
  
  const currentTime = new Date().toISOString();
  const today = currentTime.split('T')[0];
  
  let todayConversation = session.conversations.find(
    conv => conv.date.startsWith(today)
  );
  
  if (!todayConversation) {
    todayConversation = {
      date: currentTime,
      language: language,
      exchanges: []
    };
    session.conversations.push(todayConversation);
  }
  
  todayConversation.exchanges.push({
    timestamp: currentTime,
    query: query,
    response: response
  });
  
  // Keep only the latest 10 conversations per session
  if (session.conversations.length > 10) {
    session.conversations = session.conversations.slice(-10);
  }
  
  session.lastUpdated = currentTime;
  return session;
}

// Initialize the agent
async function initialize() {
  try {
    console.log('Initializing agent...');
    const result = await initializeAgent();
    knowledgeBase = result.knowledgeBase;
    console.log('Agent initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize agent:', error);
  }
}

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (users.has(username)) {
    return res.status(409).json({ error: 'Username already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  users.set(username, { username, passwordHash });
  res.json({ success: true, message: 'User registered successfully' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.get(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// API endpoint for chat
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { query, language, sessionId } = req.body;
    
    if (!query) {
      return res.status(400).json({ response: 'Please provide a question or message.' });
    }
    
    // Make sure agent is initialized
    if (!knowledgeBase) {
      console.log('Knowledge base not initialized, initializing now...');
      await initialize();
      
      // Double check initialization
      if (!knowledgeBase) {
        return res.status(500).json({ 
          response: 'The system is still starting up. Please try again in a moment.' 
        });
      }
    }
    
    // Get or create a session for this user
    const { session, isNew } = getOrCreateSession(sessionId);
    
    console.log(`Processing query for session ${session.id}: "${query}" (language: ${language || 'not specified'})`);
    
    // Process the query
    const response = await processUserQuery(query, knowledgeBase, session);
    
    try {
      // Save conversation to session only, not to file
      const detectedLang = language || detectLanguage(query);
      // Using serverMode=true to avoid writing to file
      await addToConversationHistory(session, query, response, detectedLang, true);
      
      // Update the session in our Map
      addExchangeToSession(session.id, query, response, detectedLang);
    } catch (saveError) {
      console.error('Error saving conversation to session:', saveError);
      // Continue with response even if saving fails
    }
    
    // Return the response with session ID
    res.json({ 
      response,
      sessionId: session.id,
      isNewSession: isNew
    });
  } catch (error) {
    console.error('Error processing chat query:', error);
    res.status(500).json({ 
      response: 'Sorry, I encountered an error processing your request. Please try again in a moment.' 
    });
  }
});

// Endpoint for memory status
app.get('/api/memory', authenticateToken, (req, res) => {
  const { sessionId } = req.query;
  
  if (!sessionId || !sessions.has(sessionId)) {
    return res.json({ status: 'No conversation history available for this session' });
  }
  
  const session = sessions.get(sessionId);
  const conversationCount = session.conversations.length;
  const lastUpdated = session.lastUpdated;
  const totalExchanges = session.conversations.reduce(
    (sum, conv) => sum + (conv.exchanges ? conv.exchanges.length : 0), 0
  );
  
  res.json({
    conversationCount,
    lastUpdated,
    totalExchanges
  });
});

// Endpoint to clear memory
app.post('/api/memory/clear', authenticateToken, (req, res) => {
  const { sessionId } = req.body;
  
  if (sessionId && sessions.has(sessionId)) {
    const session = sessions.get(sessionId);
    session.conversations = [];
    session.lastUpdated = new Date().toISOString();
    
    res.json({ success: true, message: 'Memory cleared successfully for this session' });
  } else {
    res.json({ success: false, message: 'No session found to clear' });
  }
});

// Serve the chatbot interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chatbot.html'));
});

// Start the server
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  await initialize();
});