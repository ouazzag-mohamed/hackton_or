// Import necessary modules
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

// Check for API key
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is missing in .env file');
  process.exit(1);
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Language configuration
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'ar', name: 'Arabic' }
];

// Main research topics
const researchTopics = [
  'Academic guidance system in Moroccan primary education',
  'School counseling methods in Moroccan middle schools',
  'Educational guidance services in Moroccan high schools',
  'Career counseling in Moroccan universities',
  'Role of counselors in Moroccan education system',
  'Challenges in academic guidance in Morocco',
  'Evolution of academic counseling in Morocco',
  'Best practices in educational guidance in Morocco compared to international standards',
  'Top colleges and universities in Morocco with admission requirements',
  'Best schools in Morocco (primary and secondary) with registration procedures'
];

// Function to search the web for information
async function searchWeb(query) {
  try {
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    const $ = cheerio.load(response.data);
    
    const links = [];
    $('a').each((i, element) => {
      const href = $(element).attr('href');
      if (href && href.startsWith('/url?q=') && !href.includes('google.com')) {
        const url = href.replace('/url?q=', '').split('&')[0];
        if (!links.includes(url)) {
          links.push(url);
        }
      }
    });

    return links.slice(0, 5);
  } catch (error) {
    console.error('Error searching the web:', error.message);
    return [];
  }
}

// Function to get content from a webpage
async function getWebContent(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    let content = '';
    $('p, h1, h2, h3').each((i, el) => {
      content += $(el).text() + '\n';
    });
    
    return {
      url,
      content: content.slice(0, 5000)
    };
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error.message);
    return { url, content: '' };
  }
}

// Function to generate research content using Google Gemini
async function generateResearchContent(topic, webContents, language = 'en') {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    let prompt;
    
    if (topic.includes('Top colleges') || topic.includes('Best schools')) {
      if (language === 'fr') {
        prompt = `Recherchez et fournissez des informations complètes sur le sujet suivant: "${topic}".
        
        Voici quelques sources pertinentes à considérer dans votre analyse:
        
        ${webContents.map((item, index) => `Source ${index + 1} (${item.url}):\n${item.content}\n`).join('\n')}
        
        Veuillez créer un rapport détaillé qui comprend:
        
        1. Une liste classée des meilleures institutions
        2. Pour chaque établissement, fournissez:
           - Brève description et histoire
           - Réputation académique et atouts uniques
           - Exigences complètes d'admission/d'inscription
           - Délais et processus de candidature
           - Documentation requise
           - Examens d'entrée ou qualifications nécessaires
           - Frais de scolarité et opportunités de bourses
        3. Comparaison des exigences d'entrée entre les institutions
        4. Conseils pour une candidature réussie
        
        Présentez l'information dans un format bien structuré qui serait utile pour les futurs étudiants et leurs parents.`;
      } 
      else if (language === 'ar') {
        prompt = `ابحث وقدم معلومات شاملة حول الموضوع التالي: "${topic}".
        
        فيما يلي بعض المصادر ذات الصلة للنظر فيها في تحليلك:
        
        ${webContents.map((item, index) => `المصدر ${index + 1} (${item.url}):\n${item.content}\n`).join('\n')}
        
        يرجى إنشاء تقرير مفصل يتضمن:
        
        1. قائمة مرتبة بأفضل المؤسسات
        2. لكل مؤسسة، قدم:
           - وصف موجز وتاريخ
           - السمعة الأكاديمية والقوة الفريدة
           - متطلبات القبول/التسجيل الكاملة
           - مواعيد وإجراءات التقديم
           - الوثائق المطلوبة
           - اختبارات القبول أو المؤهلات اللازمة
           - الرسوم الدراسية وفرص المنح الدراسية
        3. مقارنة متطلبات الدخول بين المؤسسات
        4. نصائح للتقديم الناجح
        
        قدم المعلومات بتنسيق منظم جيدًا يكون مفيدًا للطلاب المحتملين وأولياء أمورهم.`;
      }
      else {
        prompt = `Research and provide comprehensive information on the following topic: "${topic}".
        
        Here are some relevant sources to consider in your analysis:
        
        ${webContents.map((item, index) => `Source ${index + 1} (${item.url}):\n${item.content}\n`).join('\n')}
        
        Please create a detailed report that includes:
        
        1. A ranked list of the top institutions
        2. For each institution provide:
           - Brief description and history
           - Academic reputation and unique strengths
           - Complete admission/registration requirements
           - Application deadlines and processes
           - Required documentation
           - Entry exams or qualifications needed
           - Tuition fees and scholarship opportunities
        3. Comparison of entry requirements across institutions
        4. Tips for successful application
        
        Present the information in a well-structured format that would be useful for prospective students and their parents.`;
      }
    } else {
      if (language === 'fr') {
        prompt = `Menez une analyse de recherche approfondie sur le sujet suivant lié à l'orientation et au conseil académiques au Maroc: "${topic}".
        
        Voici quelques sources pertinentes à considérer dans votre analyse:
        
        ${webContents.map((item, index) => `Source ${index + 1} (${item.url}):\n${item.content}\n`).join('\n')}
        
        Veuillez fournir un rapport complet et bien structuré sur ce sujet qui comprend:
        1. État actuel et pratiques
        2. Développement historique et évolution
        3. Principaux défis et limites
        4. Comparaison avec les normes et meilleures pratiques internationales
        5. Recommandations d'amélioration
        
        Le rapport doit être d'un ton académique, factuel et basé sur les sources fournies.`;
      } 
      else if (language === 'ar') {
        prompt = `قم بإجراء تحليل بحثي متعمق حول الموضوع التالي المتعلق بالتوجيه والإرشاد الأكاديمي في المغرب: "${topic}".
        
        فيما يلي بعض المصادر ذات الصلة للنظر فيها في تحليلك:
        
        ${webContents.map((item, index) => `المصدر ${index + 1} (${item.url}):\n${item.content}\n`).join('\n')}
        
        يرجى تقديم تقرير شامل ومنظم جيدًا حول هذا الموضوع يتضمن:
        1. الوضع الحالي والممارسات
        2. التطور التاريخي والتطور
        3. التحديات والقيود الرئيسية
        4. مقارنة مع المعايير والممارسات الدولية الأفضل
        5. توصيات للتحسين
        
        يجب أن يكون التقرير بنبرة أكاديمية وواقعية ويستند إلى المصادر المقدمة.`;
      }
      else {
        prompt = `Conduct an in-depth research analysis on the following topic related to academic guidance and counseling in Morocco: "${topic}".
        
        Here are some relevant sources to consider in your analysis:
        
        ${webContents.map((item, index) => `Source ${index + 1} (${item.url}):\n${item.content}\n`).join('\n')}
        
        Please provide a comprehensive, well-structured report on this topic that includes:
        1. Current state and practices
        2. Historical development and evolution
        3. Key challenges and limitations
        4. Comparison with international standards or best practices
        5. Recommendations for improvement
        
        The report should be academic in tone, factual, and based on the provided sources.`;
      }
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    return `Error generating content for topic "${topic}": ${error.message}`;
  }
}

// Function to get the title text based on language
function getTitleText(language) {
  switch(language) {
    case 'fr':
      return 'L\'Orientation et le Conseil Académique au Maroc';
    case 'ar':
      return 'التوجيه والإرشاد الأكاديمي في المغرب';
    case 'en':
    default:
      return 'Academic Guidance and Counseling in Morocco';
  }
}

// Function to get the introduction text based on language
function getIntroductionText(language) {
  switch(language) {
    case 'fr':
      return 'Ce rapport fournit une analyse complète des systèmes d\'orientation et de conseil académiques au Maroc, de l\'enseignement primaire à l\'enseignement supérieur. Il examine les pratiques actuelles, les défis et les recommandations basées sur une recherche multi-sources.';
    case 'ar':
      return 'يقدم هذا التقرير تحليلاً شاملاً لأنظمة التوجيه والإرشاد الأكاديمي في المغرب من التعليم الابتدائي إلى التعليم العالي. يدرس الممارسات الحالية والتحديات والتوصيات بناءً على بحث متعدد المصادر.';
    case 'en':
    default:
      return 'This report provides a comprehensive analysis of academic guidance and counseling systems in Morocco from primary education through higher education. It examines current practices, challenges, and recommendations based on multi-source research.';
  }
}

// Function to translate the research topics based on the language
function getLocalizedResearchTopics(language) {
  if (language === 'en') {
    return researchTopics;
  }
  
  if (language === 'fr') {
    return [
      'Système d\'orientation académique dans l\'enseignement primaire marocain',
      'Méthodes de conseil scolaire dans les collèges marocains',
      'Services d\'orientation éducative dans les lycées marocains',
      'Conseil en orientation professionnelle dans les universités marocaines',
      'Rôle des conseillers dans le système éducatif marocain',
      'Défis de l\'orientation académique au Maroc',
      'Évolution du conseil académique au Maroc',
      'Meilleures pratiques en matière d\'orientation éducative au Maroc par rapport aux normes internationales',
      'Meilleures universités et établissements d\'enseignement supérieur au Maroc avec conditions d\'admission',
      'Meilleures écoles au Maroc (primaires et secondaires) avec procédures d\'inscription'
    ];
  }
  
  if (language === 'ar') {
    return [
      'نظام التوجيه الأكاديمي في التعليم الابتدائي المغربي',
      'أساليب الإرشاد المدرسي في المدارس الإعدادية المغربية',
      'خدمات التوجيه التربوي في المدارس الثانوية المغربية',
      'الإرشاد المهني في الجامعات المغربية',
      'دور المرشدين في النظام التعليمي المغربي',
      'تحديات التوجيه الأكاديمي في المغرب',
      'تطور الإرشاد الأكاديمي في المغرب',
      'أفضل الممارسات في التوجيه التربوي في المغرب مقارنة بالمعايير الدولية',
      'أفضل الكليات والجامعات في المغرب مع متطلبات القبول',
      'أفضل المدارس في المغرب (الابتدائية والثانوية) مع إجراءات التسجيل'
    ];
  }
  
  return researchTopics;
}

// Function to get conclusion prompt based on language
function getConclusionPrompt(language) {
  switch(language) {
    case 'fr':
      return `Sur la base de toutes les recherches sur l'orientation et le conseil académiques au Maroc, du primaire à l'enseignement supérieur, fournissez une conclusion significative qui synthétise les principales conclusions, identifie les tendances majeures et offre une perspective sur l'avenir de l'orientation académique au Maroc. Restez concis (300-500 mots) mais perspicace.`;
    case 'ar':
      return `بناءً على جميع الأبحاث حول التوجيه والإرشاد الأكاديمي في المغرب من المرحلة الابتدائية إلى التعليم العالي، قدم خاتمة هادفة تلخص النتائج الرئيسية، وتحدد الاتجاهات الكبرى، وتقدم منظورًا حول مستقبل التوجيه الأكاديمي في المغرب. يجب أن تكون موجزة (300-500 كلمة) ولكن عميقة.`;
    case 'en':
    default:
      return `Based on all the research on academic guidance and counseling in Morocco from primary to higher education, provide a meaningful conclusion that synthesizes the key findings, identifies major trends, and offers perspective on the future of academic guidance in Morocco. Keep it concise (300-500 words) but insightful.`;
  }
}

// Function to get output file path based on language
function getOutputPath(language) {
  const baseName = 'academic_guidance_morocco_report';
  if (language === 'en') {
    return `./${baseName}.json`;
  } else {
    return `./${baseName}_${language}.json`;
  }
}

// Function to create a JSON structure for the report
function createJsonReport(title, introduction, sections = [], conclusion = '') {
  return {
    title,
    introduction,
    sections,
    conclusion,
    generatedDate: new Date().toISOString(),
  };
}

// Main function to orchestrate the research and JSON generation for a specific language
async function generateComprehensiveReport(language) {
  console.log(`Starting research on academic guidance and counseling in Morocco in ${language}...`);
  
  const outputPath = getOutputPath(language);
  
  const reportTitle = getTitleText(language);
  const reportIntro = getIntroductionText(language);
  const reportSections = [];
  
  const localizedTopics = getLocalizedResearchTopics(language);
  
  for (const [index, topic] of localizedTopics.entries()) {
    console.log(`Researching topic ${index + 1}/${localizedTopics.length}: ${topic}`);
    
    console.log('Searching web for information...');
    const searchResults = await searchWeb(`${topic} Morocco academic guidance education`);
    
    console.log('Gathering content from search results...');
    const contents = [];
    for (const url of searchResults) {
      console.log(`Extracting content from: ${url}`);
      const content = await getWebContent(url);
      if (content.content.trim()) {
        contents.push(content);
      }
    }
    
    console.log(`Generating research content with Google Gemini in ${language}...`);
    const researchContent = await generateResearchContent(topic, contents, language);
    
    reportSections.push({
      title: topic,
      content: researchContent
    });
  }
  
  console.log(`Generating conclusion in ${language}...`);
  let conclusion = '';
  try {
    const conclusionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const conclusionPrompt = getConclusionPrompt(language);
    const conclusionResult = await conclusionModel.generateContent(conclusionPrompt);
    const conclusionResponse = await conclusionResult.response;
    conclusion = conclusionResponse.text();
  } catch (error) {
    console.error('Error generating conclusion:', error);
    conclusion = 'Error generating conclusion.';
  }
  
  const finalReport = createJsonReport(reportTitle, reportIntro, reportSections, conclusion);
  
  await fs.writeJson(outputPath, finalReport, { spaces: 2 });
  
  console.log(`Report in ${language} successfully generated and saved to ${outputPath}`);
  return outputPath;
}

// Main function to orchestrate the research and JSON generation for all languages
async function generateAllReports() {
  console.log('Starting comprehensive research on academic guidance and counseling in Morocco in multiple languages...');
  
  const generatedReports = [];
  
  for (const lang of LANGUAGES) {
    console.log(`\n========== Starting ${lang.name} Report Generation ==========\n`);
    const reportPath = await generateComprehensiveReport(lang.code);
    generatedReports.push({ language: lang.name, path: reportPath });
  }
  
  console.log('\nAll reports have been successfully generated!');
  console.log('Generated reports:');
  generatedReports.forEach(report => {
    console.log(`- ${report.language}: ${report.path}`);
  });
}

generateAllReports().catch(error => {
  console.error('An error occurred:', error);
});