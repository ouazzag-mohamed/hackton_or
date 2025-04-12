// Import necessary modules
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs-extra');
const readline = require('readline');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Check for API key
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is missing in .env file');
  process.exit(1);
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Path for conversation history
const CONVERSATION_HISTORY_PATH = './conversation_history.json';

// JSON file paths configuration - add your JSON files here with their language codes
const JSON_FILES = [
  { 
    path: './academic_guidance_morocco_report.json', 
    language: 'en',
    description: 'English report on academic guidance in Morocco'
  },
  { 
    path: './academic_guidance_morocco_report_fr.json', 
    language: 'fr',
    description: 'French report on academic guidance in Morocco'
  },
  { 
    path: './academic_guidance_morocco_report_ar.json', 
    language: 'ar',
    description: 'Arabic report on academic guidance in Morocco'
  },
  // Adding counseling skills JSON file
  { 
    path: './counseling_skills_ar.json', 
    language: 'ar',
    description: 'Counseling and psychological guidance skills for educational advisors'
  },
  // Adding new educational pathway JSON files
  { 
    path: './دليل السنة الثانية بكالوريا علمية 2025.json', 
    language: 'ar',
    description: 'Scientific Baccalaureate guide 2025'
  },
  { 
    path: './البكالوريا الأدبية 2025.json', 
    language: 'ar',
    description: 'Literary Baccalaureate guide 2025'
  },
  { 
    path: './علوم الاقتصاد والتدبير 2025 (1).json', 
    language: 'ar',
    description: 'Economics and Management Sciences guide 2025'
  },
  { 
    path: './العلوم التجريبية - العلوم الرياضية.json', 
    language: 'ar',
    description: 'Experimental Sciences and Mathematical Sciences guide'
  },
  { 
    path: './بكالوريا علوم وتكنولوجيات 2025 (1).json', 
    language: 'ar',
    description: 'Sciences and Technology Baccalaureate guide 2025'
  },
  { 
    path: './دليل الجذعين المشتركين الادبي والتعليم الأصيل.json', 
    language: 'ar',
    description: 'Guide for Literary and Original Education streams'
  },
  { 
    path: './دليل تلميذ السنة الثالثة اعدادي-2025.json', 
    language: 'ar',
    description: 'Guide for third year middle school students 2025'
  },
  { 
    path: './---2_1.PDF.json', 
    language: 'ar',
    description: 'Additional educational guidance information'
  },
  // Adding educational websites JSON file
  {
    path: './educational_websites.json',
    language: 'en',
    description: 'Educational services and institutions for international study options'
  }
];

// Configure supported languages
const supportedLanguages = {
  'en': 'English',
  'fr': 'French',
  'ar': 'Arabic',
  'es': 'Spanish'
};

// Create readline interface for console interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to load conversation history from JSON file
async function loadConversationHistory() {
  try {
    if (await fileExists(CONVERSATION_HISTORY_PATH)) {
      console.log('Loading previous conversation history...');
      const data = await fs.readFile(CONVERSATION_HISTORY_PATH, 'utf8');
      const history = JSON.parse(data);
      console.log(`Loaded ${history.conversations.length} previous conversation(s).`);
      return history;
    } else {
      // If file doesn't exist, create a new history structure
      return {
        conversations: [],
        lastUpdated: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error loading conversation history:', error.message);
    // Return empty history on error
    return {
      conversations: [],
      lastUpdated: new Date().toISOString()
    };
  }
}

// Function to save conversation history to JSON file
async function saveConversationHistory(history, serverMode = false) {
  // Set lastUpdated timestamp
  history.lastUpdated = new Date().toISOString();
  
  // If in server mode, don't write to file
  if (serverMode) {
    return true;
  }
  
  // Only write to file in cli mode
  try {
    await fs.writeJson(CONVERSATION_HISTORY_PATH, history, { spaces: 2 });
    return true;
  } catch (error) {
    console.error('Error saving conversation history:', error.message);
    return false;
  }
}

// Function to add a conversation exchange to history
async function addToConversationHistory(history, query, response, language, serverMode = false) {
  const currentTime = new Date().toISOString();
  
  // Find if there's a conversation from today
  const today = new Date().toISOString().split('T')[0]; // Get just the date part
  let todayConversation = history.conversations.find(
    conv => conv.date.startsWith(today)
  );
  
  // If no conversation from today, create a new one
  if (!todayConversation) {
    todayConversation = {
      date: currentTime,
      language: language,
      exchanges: []
    };
    history.conversations.push(todayConversation);
  }
  
  // Add the exchange
  todayConversation.exchanges.push({
    timestamp: currentTime,
    query: query,
    response: response
  });
  
  // Keep only the latest 10 conversations
  if (history.conversations.length > 10) {
    history.conversations = history.conversations.slice(-10);
  }
  
  // Save the updated history (pass serverMode to avoid file writing in server mode)
  await saveConversationHistory(history, serverMode);
  return history;
}

// Function to get recent conversation summary for context
function getRecentConversationContext(history, maxExchanges = 5) {
  if (!history || !history.conversations || history.conversations.length === 0) {
    return '';
  }
  
  let context = 'Here are some recent exchanges from our conversation that may provide context:\n\n';
  
  // Get the most recent conversation
  const recentConversations = [...history.conversations].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  
  // Gather exchanges from most recent conversations, up to maxExchanges
  let exchangeCount = 0;
  for (const conversation of recentConversations) {
    if (exchangeCount >= maxExchanges) break;
    
    // Get the most recent exchanges from this conversation
    const recentExchanges = [...conversation.exchanges]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, maxExchanges - exchangeCount);
    
    for (const exchange of recentExchanges) {
      context += `User: ${exchange.query}\nAgent: ${exchange.response}\n\n`;
      exchangeCount++;
    }
  }
  
  return context;
}

// Function to load data from JSON file
async function loadJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    // Extract the content as text
    let contentText = '';
    
    // Handle educational_websites.json specially
    if (path.basename(filePath) === 'educational_websites.json') {
      contentText += '# International Study Options for Moroccan Students\n\n';
      
      if (jsonData.educational_services && Array.isArray(jsonData.educational_services)) {
        // Group services by category
        const categorizedServices = {};
        
        jsonData.educational_services.forEach(service => {
          if (!categorizedServices[service.category]) {
            categorizedServices[service.category] = [];
          }
          categorizedServices[service.category].push(service);
        });
        
        // Create formatted content from categorized services
        Object.keys(categorizedServices).forEach(category => {
          contentText += `## ${category}\n\n`;
          
          categorizedServices[category].forEach(service => {
            contentText += `### ${service.name}\n\n`;
            contentText += `- **Website:** ${service.website}\n`;
            contentText += `- **Location:** ${service.country}\n`;
            contentText += `- **Languages:** ${service.languages.join(', ')}\n`;
            contentText += `- **Description:** ${service.description}\n\n`;
          });
        });
      }
    }
    // Check if this is a PDF-extracted JSON file (has 'pages' field)
    else if (jsonData.pages) {
      // This is a PDF-extracted JSON file
      const filename = jsonData.filename || path.basename(filePath);
      contentText += `# ${filename}\n\n`;
      
      // Process each page
      if (Array.isArray(jsonData.pages)) {
        jsonData.pages.forEach(page => {
          if (page.content && page.content !== "[No text content found on this page]") {
            contentText += `## Page ${page.page_number}\n\n`;
            contentText += `${page.content}\n\n`;
          }
        });
      }
    } 
    // This is a report-style JSON file
    else {
      // Process the title and introduction
      contentText += `# ${jsonData.title}\n\n`;
      contentText += `${jsonData.introduction || ''}\n\n`;
      
      // Process sections
      if (jsonData.sections && Array.isArray(jsonData.sections)) {
        jsonData.sections.forEach(section => {
          contentText += `## ${section.title}\n\n`;
          contentText += `${section.content}\n\n`;
        });
      }
      
      // Process conclusion if available
      if (jsonData.conclusion) {
        contentText += `## Conclusion\n\n${jsonData.conclusion}\n\n`;
      }
    }
    
    return contentText;
  } catch (error) {
    console.error(`Error loading JSON file (${filePath}):`, error.message);
    return null;
  }
}

// Function to check if a file exists
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

// Function to initialize the agent with knowledge from multiple JSON files
async function initializeAgent() {
  console.log('Initializing Academic Guidance Agent...');
  console.log('Loading knowledge from JSON reports...');

  const knowledgeBase = {};
  
  // Process configured JSON files
  for (const fileConfig of JSON_FILES) {
    const exists = await fileExists(fileConfig.path);
    
    if (exists) {
      console.log(`Loading ${fileConfig.description} (${fileConfig.path})...`);
      const contentText = await loadJsonFile(fileConfig.path);
      
      if (contentText) {
        knowledgeBase[fileConfig.language] = {
          text: contentText,
          description: fileConfig.description
        };
        console.log(`Successfully loaded ${fileConfig.description}`);
      } else {
        console.error(`Failed to extract content from ${fileConfig.path}`);
      }
    } else {
      console.error(`JSON file not found: ${fileConfig.path}`);
    }
  }
  
  // Check if at least one file was loaded
  const loadedLanguages = Object.keys(knowledgeBase);
  if (loadedLanguages.length === 0) {
    console.error('No JSON files could be loaded. Make sure at least one report has been generated.');
    process.exit(1);
  }
  
  // Load conversation history
  const conversationHistory = await loadConversationHistory();
  
  console.log(`Knowledge base loaded successfully in ${loadedLanguages.length} language(s): ${loadedLanguages.map(lang => supportedLanguages[lang] || lang).join(', ')}`);
  
  // Return both knowledge base and conversation history
  return {
    knowledgeBase,
    conversationHistory
  };
}

// Function to detect language of user input
function detectLanguage(text) {
  const arabicPattern = /[\u0600-\u06FF]/;
  const frenchPattern = /[àâçéèêëîïôûùüÿœæ]/i;
  const spanishPattern = /[áéíóúüñ¿¡]/i;
  
  if (arabicPattern.test(text)) return 'ar';
  if (frenchPattern.test(text)) return 'fr';
  if (spanishPattern.test(text)) return 'es';
  
  return 'en'; // Default to English
}

// Function to create agent greeting based on language
function getAgentGreeting(language) {
  switch(language) {
    case 'fr':
      return 'Bonjour! Je suis votre conseiller expert en orientation académique au Maroc. Comment puis-je vous aider aujourd\'hui?';
    case 'ar':
      return 'مرحبا! أنا مستشارك الخبير في التوجيه الأكاديمي في المغرب. كيف يمكنني مساعدتك اليوم؟';
    case 'es':
      return '¡Hola! Soy su consejero experto en orientación académica en Marruecos. ¿Cómo puedo ayudarte hoy?';
    case 'en':
    default:
      return 'Hello! I am your expert academic guidance counselor for Morocco. How can I help you today?';
  }
}

// Function to process user query and generate response
async function processUserQuery(query, knowledgeBase, conversationHistory) {
  // Detect language
  const detectedLanguage = detectLanguage(query);
  
  try {
    // Initialize model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });
    
    // Check if this is a question that might need web search 
    // 1. Specific school or institution query
    const specificInstitutionQuery = query.match(/(?:about|information|tell me about|what is|where is|how is|details|specifics about)\s+(?:school|college|university|institution|academy|lycée|college|faculty|institute)\s+(.+?)(?:\?|$)/i) ||
                          query.match(/(?:school|college|university|institution|academy|lycée|college|faculty|institute)\s+(?:called|named|known as)\s+(.+?)(?:\?|$)/i);
    
    // 2. General question that might need web search (when we may not have info in our knowledge base)
    const generalInfoQuery = !specificInstitutionQuery && 
                             (query.includes("?") || 
                             /^(?:what|how|why|when|where|who|tell me|explain|information|details about|specifics on)/i.test(query));
    
    // Initially assume web search might be needed for any substantive query
    let needsWebSearch = specificInstitutionQuery || generalInfoQuery;
    
    // Check for international study related keywords
    const internationalKeywords = {
      en: ['abroad', 'international', 'foreign', 'overseas', 'outside morocco', 'study abroad', 'france', 'canada', 'usa', 'uk', 'spain', 'germany', 'turkey', 'china', 'russia'],
      fr: ['étranger', 'international', 'hors maroc', 'étudier à l\'étranger', 'france', 'canada', 'états-unis', 'royaume-uni', 'espagne', 'allemagne', 'turquie', 'chine', 'russie'],
      ar: ['الخارج', 'دولي', 'خارج المغرب', 'الدراسة في الخارج', 'فرنسا', 'كندا', 'الولايات المتحدة', 'المملكة المتحدة', 'إسبانيا', 'ألمانيا', 'تركيا', 'الصين', 'روسيا'],
      es: ['extranjero', 'internacional', 'fuera de marruecos', 'estudiar en el extranjero', 'francia', 'canadá', 'estados unidos', 'reino unido', 'españa', 'alemania', 'turquía', 'china', 'rusia']
    };

    // Check for psychological counseling related keywords
    const psychologicalKeywords = {
      en: ['stress', 'anxiety', 'fear', 'confidence', 'depressed', 'worried', 'overwhelmed', 'confused', 'struggle', 'pressure', 'mental health', 'emotions', 'feeling', 'motivation', 'panic'],
      fr: ['stress', 'anxiété', 'peur', 'confiance', 'déprimé', 'inquiet', 'débordé', 'confus', 'difficulté', 'pression', 'santé mentale', 'émotions', 'sentiment', 'motivation', 'panique'],
      ar: ['قلق', 'توتر', 'خوف', 'ثقة', 'اكتئاب', 'حزن', 'ضغط', 'ارتباك', 'صعوبة', 'ضغط نفسي', 'صحة نفسية', 'مشاعر', 'إحباط', 'تحفيز', 'هلع', 'انزعاج'],
      es: ['estrés', 'ansiedad', 'miedo', 'confianza', 'deprimido', 'preocupado', 'abrumado', 'confundido', 'dificultad', 'presión', 'salud mental', 'emociones', 'sentimiento', 'motivación', 'pánico']
    };
    
    // Determine if query is about international studies
    let isInternationalQuery = false;
    for (const lang in internationalKeywords) {
      if (internationalKeywords[lang].some(keyword => query.toLowerCase().includes(keyword.toLowerCase()))) {
        isInternationalQuery = true;
        break;
      }
    }

    // Determine if query is related to psychological support
    let isPsychologicalQuery = false;
    for (const lang in psychologicalKeywords) {
      if (psychologicalKeywords[lang].some(keyword => query.toLowerCase().includes(keyword.toLowerCase()))) {
        isPsychologicalQuery = true;
        break;
      }
    }
    
    // Get information about educational websites if query is related to international studies
    const educationalWebsites = isInternationalQuery ? await loadJsonFile('./educational_websites.json') : '';
    
    // Get counseling skills information if query is related to psychological support
    const counselingSkills = isPsychologicalQuery ? await loadJsonFile('./counseling_skills_ar.json') : '';
    
    // Determine which knowledge base to use
    let primaryKnowledge;
    let secondaryKnowledge = '';
    
    // First try to use knowledge in the same language as the query
    if (knowledgeBase[detectedLanguage]) {
      primaryKnowledge = knowledgeBase[detectedLanguage].text;
    } 
    // If not available, default to English
    else if (knowledgeBase['en']) {
      primaryKnowledge = knowledgeBase['en'].text;
      
      // Add note for the model about translation
      secondaryKnowledge = `Note: The primary information source is in English, but please respond in ${supportedLanguages[detectedLanguage] || detectedLanguage} as the user is communicating in this language.`;
    }
    // If no English either, use the first available language
    else {
      const firstAvailableLang = Object.keys(knowledgeBase)[0];
      primaryKnowledge = knowledgeBase[firstAvailableLang].text;
      
      // Add note for the model about translation
      secondaryKnowledge = `Note: The primary information source is in ${supportedLanguages[firstAvailableLang] || firstAvailableLang}, but please respond in ${supportedLanguages[detectedLanguage] || detectedLanguage} as the user is communicating in this language.`;
    }
    
    // Get conversation context from history
    const conversationContext = getRecentConversationContext(conversationHistory);
    
    // Create system prompt that defines the agent's behavior and knowledge
    const systemPrompt = `You are an expert academic guidance counselor specializing in the Moroccan education system from primary school through higher education. 
    You have comprehensive knowledge about academic guidance and counseling practices, educational institutions, admission requirements, and career pathways in Morocco.
    
    You must always respond in the same language as the user's query, which appears to be ${supportedLanguages[detectedLanguage] || detectedLanguage}.
    
    The following is your knowledge base about academic guidance and counseling in Morocco, top educational institutions, and their admission requirements:
    
    ${primaryKnowledge}
    
    ${secondaryKnowledge}
    
    ${isInternationalQuery ? `\n\nINTERNATIONAL STUDY OPTIONS FOR MOROCCAN STUDENTS:\n${educationalWebsites}` : ''}

    ${isPsychologicalQuery ? `\n\nCOUNSELING AND PSYCHOLOGICAL GUIDANCE SKILLS:\n${counselingSkills}` : ''}
    
    ${conversationContext ? `\n\nConversation history:\n${conversationContext}` : ''}
    
    Use this information to provide accurate, helpful guidance. If you don't know something specific, acknowledge that and provide general guidance based on what you do know.
    
    Always be supportive, professional, and considerate in your responses. Format your answers in a clear, structured way.
    
    ${isInternationalQuery ? 'Since the user is inquiring about international study options, include relevant options from the INTERNATIONAL STUDY OPTIONS section. Provide 2-3 specific recommendations with website links that match their interests.' : ''}

    ${isPsychologicalQuery ? 'Since the user seems to have psychological or emotional concerns, apply the counseling skills from your knowledge base. Specifically:\n1. Practice active listening and validate their feelings\n2. Use clear, simple language\n3. Be neutral and non-judgmental\n4. Focus on identifying their strengths and providing positive support\n5. Be flexible in your approach and adapt to their specific situation\n6. Maintain confidentiality and ethical standards\n7. Help build their confidence and prevent anxiety' : ''}
    
    If the user refers to previous conversations, use the conversation history provided above to maintain continuity.`;

    // Create the generative parts for the conversation
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 0.95,
      },
      history: [
        {
          role: "user",
          parts: [{ text: "Initialize yourself with the knowledge provided." }],
        },
        {
          role: "model",
          parts: [{ text: "I am now initialized as an expert academic guidance counselor specializing in the Moroccan education system. I will provide advice based on the comprehensive knowledge I have about academic guidance, counseling practices, educational institutions, admission requirements, and career pathways in Morocco. I also have psychological counseling skills to support students with emotional concerns." }],
        },
      ],
    });    // First check if the query is likely about information we don't have in our knowledge base
    // We'll use a preliminary Gemini check to determine this
    let webInformation = null;
    let searchQuery = "";
    let shouldSearchWeb = false;
    
    try {
      // Create a small model instance for quick classification
      const checkModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const checkPrompt = `
        Question: "${query}"
        
        Based solely on this question, determine if it's likely asking about specific information that might NOT be in a standard knowledge base about:
        1. The Moroccan education system
        2. Academic pathways in Morocco
        3. Moroccan schools and universities
        4. General career guidance
        5. Standard counseling practices
        
        If the question appears to be asking about:
        - A specific school, college, or institution by name
        - Current events or recent changes to education policy
        - Specific admission requirements for a particular program
        - Niche educational topics not covered in standard guides
        - Any other detailed information that likely requires up-to-date or specialized sources
        
        Then answer "Search needed: yes"
        
        If the question is about general academic guidance, standard educational pathways, or common career advice that would likely be in a comprehensive knowledge base, answer "Search needed: no"
        
        Reply with ONLY "Search needed: yes" or "Search needed: no" and nothing else.
      `;
      
      const checkResult = await checkModel.generateContent(checkPrompt);
      const checkResponse = checkResult.response.text().trim().toLowerCase();
      
      if (checkResponse.includes("search needed: yes")) {
        console.log("Initial check indicates this question might need web search");
        shouldSearchWeb = true;
      } else {
        console.log("Initial check indicates our knowledge base should have this information");
        needsWebSearch = false;
      }
    } catch (error) {
      console.error("Error performing initial search check:", error);
      // If the check fails, we'll fall back to our keyword-based determination
      shouldSearchWeb = needsWebSearch;
    }
    
    if (shouldSearchWeb || needsWebSearch) {      // Handle specific institution queries with language-aware search queries
      if (specificInstitutionQuery) {
        console.log("Query needs web search for specific institution information");
        const match = specificInstitutionQuery[1];
        if (match) {
          // Create language-specific search queries
          switch(detectedLanguage) {
            case 'fr':
              searchQuery = `Maroc ${match} école information inscription admission`;
              break;
            case 'ar':
              searchQuery = `المغرب ${match} مدرسة معلومات التسجيل القبول`;
              break;
            case 'es':
              searchQuery = `Marruecos ${match} escuela información inscripción requisitos`;
              break;
            case 'en':
            default:
              searchQuery = `Morocco ${match} school information admission requirements`;
          }
        }
      } 
      // Handle general queries (when our knowledge base might not have the information)
      else {
        console.log("General query that might need web search");
        
        // Get keywords from the query, with language-specific stopwords
        const commonStopwords = {
          en: ['what', 'when', 'where', 'which', 'how', 'about', 'tell', 'information', 'details', 'the', 'for', 'and', 'that', 'this'],
          fr: ['quoi', 'quand', 'où', 'quel', 'quelle', 'comment', 'pourquoi', 'sur', 'information', 'détails', 'le', 'la', 'les', 'des', 'pour', 'et', 'que', 'ce', 'cette'],
          ar: ['ماذا', 'متى', 'أين', 'كيف', 'لماذا', 'عن', 'معلومات', 'تفاصيل', 'ال', 'في', 'من', 'إلى', 'على', 'هذا', 'هذه', 'ذلك'],
          es: ['qué', 'cuándo', 'dónde', 'cuál', 'cómo', 'por qué', 'sobre', 'información', 'detalles', 'el', 'la', 'los', 'las', 'para', 'y', 'que', 'este', 'esta']
        };
        
        // Use language-specific stopwords based on detected language
        const stopwords = commonStopwords[detectedLanguage] || commonStopwords.en;
        
        // Extract keywords from query
        const keywords = query.toLowerCase()
          .replace(/[?.,;:!]/g, '')
          .split(' ')
          .filter(word => word.length > 2 && !stopwords.includes(word))
          .slice(0, 5)
          .join(' ');
        
        // Create language-specific education search terms
        switch(detectedLanguage) {
          case 'fr':
            searchQuery = `Maroc système éducation ${keywords}`;
            break;
          case 'ar':
            searchQuery = `المغرب نظام التعليم ${keywords}`;
            break;
          case 'es':
            searchQuery = `Marruecos sistema educativo ${keywords}`;
            break;
          case 'en':
          default:
            searchQuery = `Morocco education system ${keywords}`;
        }
      }
      
      if (searchQuery) {
        console.log(`Searching web for: ${searchQuery}`);
        webInformation = await getWebInformation(searchQuery, detectedLanguage);
      }
    }
    
    // Add web search information to system prompt if available
    let updatedSystemPrompt = systemPrompt;
    if (webInformation && webInformation.summary) {
      updatedSystemPrompt += `\n\nI found the following information from the web that might help answer your question about a specific institution:\n\n${webInformation.summary}\n\nSources:\n`;
      webInformation.sources.forEach((source, index) => {
        updatedSystemPrompt += `${index + 1}. ${source.title} - ${source.url}\n`;
      });
      updatedSystemPrompt += "\nPlease incorporate this information into your response when relevant.";
    }

    // Generate content with the user's query
    const result = await chat.sendMessage([
      { text: updatedSystemPrompt + "\n\nUser query: " + query }
    ]);
    const response = result.response;
    
    let responseText = response.text();
    
    // Add sources to the response if web search was performed
    if (webInformation && webInformation.sources && webInformation.sources.length > 0) {
      // Don't add sources if they're already included in the response
      if (!responseText.includes("Source") && !responseText.includes("source")) {
        responseText += "\n\nSources:";
        webInformation.sources.forEach((source, index) => {
          responseText += `\n${index + 1}. ${source.url}`;
        });
      }
    }
    
    return responseText;
  } catch (error) {
    console.error('Error processing query:', error);
    
    // Fallback responses in different languages
    if (detectedLanguage === 'fr') {
      return "Désolé, j'ai rencontré une erreur lors du traitement de votre demande. Veuillez réessayer.";
    } else if (detectedLanguage === 'ar') {
      return "عذرًا، واجهت خطأً أثناء معالجة استفسارك. يرجى المحاولة مرة أخرى.";
    } else if (detectedLanguage === 'es') {
      return "Lo siento, encontré un error al procesar tu consulta. Por favor, inténtalo de nuevo.";
    } else {
      return "Sorry, I encountered an error processing your query. Please try again.";
    }
  }
}

// Function to search the web for information
async function searchWeb(query) {
  try {
    console.log(`Searching web for: ${query}`);
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    const links = [];
    $('a').each((i, element) => {
      const href = $(element).attr('href');
      if (href && href.startsWith('/url?q=') && !href.includes('google.com')) {
        const url = href.replace('/url?q=', '').split('&')[0];
        if (!links.includes(url) && !url.includes('youtube.com') && !url.includes('facebook.com')) {
          links.push(url);
        }
      }
    });

    return links.slice(0, 3); // Limit to top 3 results for faster processing
  } catch (error) {
    console.error('Error searching the web:', error.message);
    return [];
  }
}

// Function to get content from a webpage
async function getWebContent(url) {
  try {
    console.log(`Fetching content from: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // Remove script and style elements
    $('script, style, iframe, nav, footer, header, .header, .footer, .nav, .sidebar').remove();
    
    let title = $('title').text() || '';
    let content = '';
    
    // Extract main content from common content containers
    const mainContent = $('main, article, .content, .main, #content, #main');
    if (mainContent.length > 0) {
      mainContent.find('p, h1, h2, h3, h4, h5, li').each((i, el) => {
        const text = $(el).text().trim();
        if (text) content += text + '\n\n';
      });
    } else {
      // Fallback to extracting from body
      $('p, h1, h2, h3, h4, h5, li').each((i, el) => {
        const text = $(el).text().trim();
        if (text) content += text + '\n\n';
      });
    }
    
    return {
      url,
      title,
      content: content.slice(0, 8000) // Limit content length
    };
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error.message);
    return { url, title: '', content: '' };
  }
}

// Function to search web and get summarized information
async function getWebInformation(query, targetLanguage) {
  try {
    // Search for the query
    const urls = await searchWeb(query);
    if (urls.length === 0) {
      return null;
    }
    
    // Get content from the top results
    const contentPromises = urls.map(url => getWebContent(url));
    const webContents = await Promise.all(contentPromises);
    
    // Filter out empty results
    const validContents = webContents.filter(item => item.content && item.content.length > 100);
    
    if (validContents.length === 0) {
      return null;
    }
    
    // Use Gemini to summarize the web content
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });
    
    let webInfoPrompt = `Please summarize the following web search results about: "${query}"\n\n`;
    validContents.forEach((item, index) => {
      webInfoPrompt += `Source ${index + 1} (${item.url}):\nTitle: ${item.title}\n${item.content.substring(0, 2000)}\n\n`;
    });
    
    webInfoPrompt += `Provide a concise, factual summary of this information in ${supportedLanguages[targetLanguage] || 'English'}.
    Focus on extracting the most relevant facts and details directly related to the query.
    Do not include any personal opinions or interpretations.
    Structure your response in a clear, organized manner.
    If the information appears contradictory between sources, note this fact.`;
    
    // Generate summary
    const result = await model.generateContent(webInfoPrompt);
    const summary = result.response.text();
    
    return {
      summary,
      sources: validContents.map(item => ({ title: item.title, url: item.url }))
    };
  } catch (error) {
    console.error('Error getting web information:', error);
    return null;
  }
}

// Main function to run the agent
async function runGuidanceAgent() {
  // Load knowledge from JSON files and conversation history
  const { knowledgeBase, conversationHistory } = await initializeAgent();
  
  // Get available languages
  const availableLanguages = Object.keys(knowledgeBase).map(lang => supportedLanguages[lang] || lang).join(', ');
  
  // Display welcome message in English (default)
  console.log('\n' + '='.repeat(60));
  console.log('ACADEMIC GUIDANCE AGENT FOR MOROCCO');
  console.log('='.repeat(60));
  console.log('\nThis agent is an expert in Moroccan academic guidance and educational systems.');
  console.log(`Knowledge base available in: ${availableLanguages}`);
  console.log('The agent can answer questions in multiple languages (English, French, Arabic, Spanish).');
  
  // Show memory status
  if (conversationHistory.conversations && conversationHistory.conversations.length > 0) {
    const conversationCount = conversationHistory.conversations.length;
    const lastConversationDate = new Date(conversationHistory.lastUpdated).toLocaleDateString();
    console.log(`Memory: ${conversationCount} previous conversation(s) available. Last updated: ${lastConversationDate}`);
  }
  
  console.log('\nCommands:');
  console.log('- Type "exit" or "quit" to end the session');
  console.log('- Type "clear memory" to reset conversation history');
  console.log('- Type "memory status" to check conversation history info\n');
  
  // Display initial greeting
  console.log(getAgentGreeting('en'));
  
  // Start conversation loop
  const askQuestion = () => {
    rl.question('\n> ', async (query) => {
      // Check for exit command
      if (query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit') {
        console.log('Thank you for using the Academic Guidance Agent. Goodbye!');
        rl.close();
        return;
      }
      
      // Check for memory management commands
      if (query.toLowerCase() === 'clear memory') {
        conversationHistory.conversations = [];
        await saveConversationHistory(conversationHistory);
        console.log('Memory cleared. All previous conversations have been forgotten.');
        askQuestion();
        return;
      }
      
      if (query.toLowerCase() === 'memory status') {
        if (conversationHistory.conversations && conversationHistory.conversations.length > 0) {
          console.log(`Memory status: ${conversationHistory.conversations.length} conversation(s) stored.`);
          console.log(`Last updated: ${new Date(conversationHistory.lastUpdated).toLocaleString()}`);
          
          // Count total exchanges
          const totalExchanges = conversationHistory.conversations.reduce(
            (sum, conv) => sum + (conv.exchanges ? conv.exchanges.length : 0), 0
          );
          
          console.log(`Total exchanges: ${totalExchanges}`);
          
          // Show dates of stored conversations
          console.log('Conversation dates:');
          conversationHistory.conversations.forEach(conv => {
            const dateStr = new Date(conv.date).toLocaleDateString();
            const exchangeCount = conv.exchanges ? conv.exchanges.length : 0;
            console.log(`- ${dateStr}: ${exchangeCount} exchange(s)`);
          });
        } else {
          console.log('Memory status: No conversation history stored.');
        }
        askQuestion();
        return;
      }
      
      // Process the query
      console.log('Processing your question...');
      const detectedLanguage = detectLanguage(query);
      const response = await processUserQuery(query, knowledgeBase, conversationHistory);
      
      // Add this exchange to conversation history
      await addToConversationHistory(conversationHistory, query, response, detectedLanguage);
      
      // Display the response
      console.log('\nAgent: ' + response + '\n');
      
      // Continue the conversation
      askQuestion();
    });
  };
  
  // Start the conversation
  askQuestion();
}

// Export functions for use in the server
module.exports = {
  initializeAgent,
  processUserQuery,
  detectLanguage,
  getRecentConversationContext,
  loadConversationHistory,
  saveConversationHistory,
  addToConversationHistory
};