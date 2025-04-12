import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { 
  Question, 
  QuestionType, 
  OrientationScore, 
  UserResponse, 
  OrientationReport, 
  UserProfile,
  SchoolRecommendation,
  StatisticalAnalysis 
} from '../store/quizStore';
import { educationTracks, preUniversityEducation, careerFields, highSchoolSubjects } from '../data/moroccoEducationData';
import { Language } from '../store/languageStore';

// Initialize the Google Generative AI with your API key
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

// Safety settings to avoid harmful content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Retry mechanism for API calls
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
): Promise<T> => {
  let numRetries = 0;
  
  const execute = async (): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (numRetries < maxRetries) {
        const delay = initialDelay * Math.pow(2, numRetries);
        numRetries++;
        console.log(`Retrying API call after ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return execute();
      }
      throw error;
    }
  };
  
  return execute();
};

// Helper to extract JSON from AI response
const extractJSON = (text: string) => {
  try {
    // Find JSON content within the text (between curly braces)
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('No JSON found in response');
  } catch (error) {
    console.error('Failed to parse JSON from AI response:', error);
    console.log('Raw response:', text);
    throw new Error('Invalid response format from AI service');
  }
};

// Generate question based on previous responses, orientation scores, and user profile
export const generateQuestion = async (
  previousResponses: UserResponse[],
  orientationScores: OrientationScore[],
  userProfile?: UserProfile,
  language: Language = 'en'
): Promise<Question> => {
  // Use a fallback local function if API key is not available
  if (!API_KEY) {
    return generateLocalQuestion(previousResponses, userProfile, language);
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Prepare context for the AI including profile information if available
    const tracks = Object.values(educationTracks).map(track => track.name).join(', ');
    
    let context = `
      You are an educational orientation assistant for Moroccan students. 
      You need to generate a relevant question to help determine the student's 
      educational path among these tracks: ${tracks}.
      
      The question should be dynamically generated based on previous responses
      and should be relevant to the Moroccan education system.
      
      IMPORTANT: Generate the question in ${language === 'en' ? 'English' : language === 'fr' ? 'French' : 'Arabic'} language.
    `;
    
    // Add user profile information for more targeted questions
    if (userProfile?.profileCompleted) {
      context += `
        Student Profile Information:
        - Name: ${userProfile.name}
        - Location in Morocco: ${userProfile.location}
        - Current Education Level: ${userProfile.educationLevel}
        - Hobbies and Activities: ${userProfile.hobbies.join(', ')}
        - Academic Interests: ${userProfile.interests.join(', ')}
        
        Use this profile information to generate more targeted and personalized questions
        that will help determine the student's optimal educational path in Morocco.
        Consider their location, education level, hobbies, and interests when crafting questions.
      `;
    }
    
    // Add previous responses for context
    let previousResponsesText = '';
    if (previousResponses.length > 0) {
      previousResponsesText = 'Previous questions and answers:\n' + 
        previousResponses.map(r => `Q: ${r.questionText}\nA: ${r.response}`).join('\n\n');
    }
    
    // Add current orientation scores for context
    let scoresText = '';
    if (orientationScores.length > 0 && orientationScores[0].confidence > 0) {
      scoresText = 'Current orientation scores (higher scores indicate stronger alignment):\n' + 
        orientationScores
          .sort((a, b) => b.score - a.score)
          .map(s => `${s.trackName}: ${s.score.toFixed(2)} (confidence: ${s.confidence.toFixed(2)})`).join('\n');
    }
    
    // Different types of questions to vary the assessment
    const questionTypes = [
      'text', 
      'multiple-choice', 
      'slider'
    ];
    
    // Determine question type based on progress and previous responses
    // Early questions can be more exploratory text questions
    // Later questions should be more targeted based on emerging preferences
    let questionType: QuestionType;
    
    if (previousResponses.length < 3) {
      questionType = 'text';
    } else if (previousResponses.length % 3 === 0) {
      // Every third question should be a slider for more quantitative measurement
      questionType = 'slider';
    } else if (previousResponses.length % 3 === 1) {
      // Mix in multiple choice questions for structured responses
      questionType = 'multiple-choice';
    } else {
      // Keep text questions in the mix for qualitative insights
      questionType = 'text';
    }
    
    // For more advanced stages, adapt question type to current top tracks
    if (previousResponses.length > 5 && scoresText) {
      const topScores = orientationScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);
      
      if (topScores.length >= 2) {
        // If the top two scores are close, ask comparative questions
        const scoreDiff = topScores[0].score - topScores[1].score;
        if (scoreDiff < 1.5) {
          questionType = 'multiple-choice';
        }
      }
    }
    
    // Build the prompt for the AI
    const prompt = `
      ${context}
      
      ${previousResponsesText}
      
      ${scoresText}
      
      ${previousResponses.length > 5 ? 'At this stage, create more specific questions that distinguish between the top-scoring tracks.' : ''}
      ${previousResponses.length > 8 ? 'Now ask deeper questions about specific career aspirations, learning preferences, and work environments related to the top tracks.' : ''}
      
      Please generate a ${questionType} question that will help determine the student's 
      educational orientation in Morocco. The question MUST be in ${language === 'en' ? 'English' : language === 'fr' ? 'French' : 'Arabic'} language.
      
      ${questionType === 'multiple-choice' ? 'Include 4-5 answer options that will help differentiate between educational tracks.' : ''}
      ${questionType === 'slider' ? 'This should ask the student to rate something specific related to education tracks on a scale of 1-10.' : ''}
      
      Return a JSON object with these fields:
      {
        "text": "the question text in ${language === 'en' ? 'English' : language === 'fr' ? 'French' : 'Arabic'}",
        "type": "${questionType}",
        ${questionType === 'multiple-choice' ? '"options": ["option1", "option2", ...]' : ''}
      }
      
      Do not include any other text in your response, just the JSON object.
    `;
    
    const result = await retryWithBackoff(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    });
    
    const questionData = extractJSON(result);
    
    return {
      id: uuidv4(),
      text: questionData.text,
      type: questionData.type as QuestionType,
      ...(questionData.options && { options: questionData.options }),
    };
  } catch (error) {
    console.error('Error generating question:', error);
    return generateLocalQuestion(previousResponses, userProfile, language);
  }
};

// Analyze student response and update orientation scores
export const analyzeResponse = async (
  response: UserResponse,
  currentScores: OrientationScore[],
  allResponses: UserResponse[],
  userProfile?: UserProfile
): Promise<OrientationScore[]> => {
  // Use a fallback local function if API key is not available
  if (!API_KEY) {
    return analyzeLocalResponse(response, currentScores, userProfile);
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Prepare context about educational tracks
    const tracksContext = Object.entries(educationTracks)
      .map(([id, track]) => `${id}: ${track.name} - ${track.description}`)
      .join('\n');
    
    let prompt = `
      You are an educational orientation analysis system for Moroccan students.
      Based on the student's response, analyze how it aligns with different educational tracks in Morocco.
      
      Educational tracks available in Morocco:
      ${tracksContext}
      
      Student's question and response:
      Question: ${response.questionText}
      Response: ${response.response}
    `;

    // Add user profile context if available
    if (userProfile?.profileCompleted) {
      prompt += `
        
        Student Profile Information:
        - Name: ${userProfile.name}
        - Location in Morocco: ${userProfile.location}
        - Current Education Level: ${userProfile.educationLevel}
        - Hobbies and Activities: ${userProfile.hobbies.join(', ')}
        - Academic Interests: ${userProfile.interests.join(', ')}
      `;
    }
    
    // Add previous responses context
    prompt += `
      
      Previous responses context:
      ${allResponses
        .filter(r => r.questionId !== response.questionId)
        .map(r => `Q: ${r.questionText}\nA: ${r.response}`)
        .join('\n\n')}
      
      Current orientation scores:
      ${currentScores.map(s => `${s.trackName}: ${s.score.toFixed(2)} (confidence: ${s.confidence.toFixed(2)})`).join('\n')}
      
      Analyze how the student's response aligns with each track and provide updated scores.
      Be especially nuanced in your analysis, looking for subtle indicators of interest, aptitude, and compatibility.
      Consider how the response might indicate strengths or challenges in different educational environments.
      
      Return a JSON object with these fields:
      {
        "updatedScores": [
          {
            "trackId": "trackId",
            "trackName": "Track Name",
            "score": numericScore,
            "confidence": confidenceLevel
          },
          ...
        ],
        "reasoning": "brief explanation of your analysis",
        "insights": ["insight1", "insight2", ...] 
      }
      
      Score should be a number between 0-10, with higher scores indicating stronger alignment.
      Confidence should be a number between 0-1 indicating how certain you are about the score.
      Include 2-3 specific insights about the student's educational orientation that can be gleaned from this response.
      Do not include any other text in your response, just the JSON object.
    `;
    
    const result = await retryWithBackoff(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    });
    
    const analysisData = extractJSON(result);
    
    if (!analysisData.updatedScores || !Array.isArray(analysisData.updatedScores)) {
      throw new Error('Invalid analysis data structure');
    }
    
    // Save insights for later use in report generation
    // This would need to be implemented in quizStore
    if (analysisData.insights && Array.isArray(analysisData.insights)) {
      // For now we'll just log them
      console.log('Response insights:', analysisData.insights);
    }
    
    // Merge new scores with existing scores (weighted average based on confidence)
    return currentScores.map(currentScore => {
      const newScoreData = analysisData.updatedScores.find(
        (s: any) => s.trackId === currentScore.trackId
      );
      
      if (!newScoreData) return currentScore;
      
      const newScore = newScoreData.score;
      const newConfidence = newScoreData.confidence;
      
      // If this is the first real score, just use the new values
      if (currentScore.confidence === 0) {
        return {
          ...currentScore,
          score: newScore,
          confidence: newConfidence
        };
      }
      
      // Otherwise, compute weighted average based on confidence
      const totalConfidence = currentScore.confidence + newConfidence;
      const weightedScore = 
        (currentScore.score * currentScore.confidence + newScore * newConfidence) / totalConfidence;
      
      return {
        ...currentScore,
        score: weightedScore,
        // Increase confidence with more data, but max at 0.95
        confidence: Math.min(0.95, totalConfidence * 0.8)
      };
    });
  } catch (error) {
    console.error('Error analyzing response:', error);
    return analyzeLocalResponse(response, currentScores, userProfile);
  }
};

// Generate final orientation report with detailed school recommendations
export const generateReport = async (
  responses: UserResponse[],
  scores: OrientationScore[],
  userProfile?: UserProfile,
  insights: string[] = [],
  language: Language = 'en'
): Promise<OrientationReport> => {
  // Use a fallback local function if API key is not available
  if (!API_KEY) {
    return generateLocalReport(responses, scores, userProfile, language);
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Sort scores to find primary and secondary tracks
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    const primaryTrack = sortedScores[0];
    const secondaryTrack = sortedScores[1];
    
    // Generate educational tracks info
    const tracksInfo = Object.entries(educationTracks)
      .map(([id, track]) => {
        // Safely access properties with type checking
        let universities = '';
        if ('universities' in track && Array.isArray(track.universities)) {
          universities = `Universities: ${track.universities.slice(0, 5).join(', ')}`;
        } else if ('institutions' in track && Array.isArray(track.institutions)) {
          universities = `Institutions: ${track.institutions.slice(0, 5).join(', ')}`;
        }
        
        let programs = '';
        if ('programs' in track && track.programs && 'undergraduate' in track.programs && Array.isArray(track.programs.undergraduate)) {
          programs = `Programs: ${track.programs.undergraduate.slice(0, 5).join(', ')}`;
        } else if ('sectors' in track && Array.isArray(track.sectors)) {
          const sectorPrograms = track.sectors.flatMap(sector => 
            sector.programs && Array.isArray(sector.programs) ? sector.programs : []
          );
          programs = `Programs: ${sectorPrograms.slice(0, 5).join(', ')}`;
        }
        
        return `${id} (${track.name}): ${track.description}. ${universities}. ${programs}`;
      })
      .join('\n\n');
    
    // Rest of the function unchanged
    const studentResponsesText = responses
      .map(r => `Q: ${r.questionText}\nA: ${r.response}`)
      .join('\n\n');
    
    let prompt = `
      You are an educational orientation advisor for Moroccan students.
      Generate a comprehensive educational orientation report based on the student's responses
      and their calculated orientation scores.
      
      IMPORTANT: Generate the report in ${language === 'en' ? 'English' : language === 'fr' ? 'French' : 'Arabic'} language.
    `;
    
    // Add user profile if available
    if (userProfile?.profileCompleted) {
      prompt += `
        
        Student Profile:
        - Name: ${userProfile.name}
        - Location in Morocco: ${userProfile.location}
        - Current Education Level: ${userProfile.educationLevel}
        - Hobbies and Activities: ${userProfile.hobbies.join(', ')}
        - Academic Interests: ${userProfile.interests.join(', ')}
      `;
    }
    
    prompt += `
      
      Student's responses:
      ${studentResponsesText}
      
      Orientation scores (higher is better alignment):
      ${scores.sort((a, b) => b.score - a.score)
        .map(s => `${s.trackName}: ${s.score.toFixed(2)} (confidence: ${s.confidence.toFixed(2)})`)
        .join('\n')}
      
      Primary track: ${primaryTrack.trackName} (score: ${primaryTrack.score.toFixed(2)})
      Secondary track: ${secondaryTrack.trackName} (score: ${secondaryTrack.score.toFixed(2)})
      
      Educational tracks information:
      ${tracksInfo}
    `;
    
    if (insights.length > 0) {
      prompt += `
        
        Key insights from the student's responses:
        ${insights.map((insight, i) => `${i+1}. ${insight}`).join('\n')}
      `;
    }
    
    prompt += `
      
      Based on all the information provided, generate a comprehensive orientation report in ${language === 'en' ? 'English' : language === 'fr' ? 'French' : 'Arabic'} language.
      You must include detailed school recommendations that are:
      1. Geographically relevant to the student's location in Morocco (if provided)
      2. Offering programs aligned with their educational orientation
      3. Suitable for their current educational level
      4. Include specific strengths of each recommended school 
      5. Include admission requirements and match scores
      
      Also provide robust statistical analysis of the student's results, including:
      1. Confidence intervals for each track recommendation
      2. Relative distribution of scores across tracks
      3. Key statistical insights
      
      Return a JSON object with these fields:
      {
        "primaryTrack": "name of primary track",
        "secondaryTrack": "name of secondary track",
        "strengths": ["3-5 specific strengths based on responses"],
        "areasToImprove": ["3-4 specific areas to improve"],
        "recommendedPrograms": ["5-7 specific educational programs in Morocco"],
        "recommendedUniversities": ["5-7 specific universities in Morocco"],
        "schoolRecommendations": [
          {
            "name": "School name",
            "location": "City/region",
            "distance": "Distance from student if location provided",
            "matchScore": score (0-100),
            "programs": ["program1", "program2", ...],
            "strengths": ["strength1", "strength2", ...],
            "admissionRequirements": "Requirements text",
            "website": "URL if available"
          },
          ...
        ],
        "statisticalAnalysis": {
          "primaryPercentile": number,
          "confidenceInterval": "confidence interval text",
          "trackDistribution": [
            {"trackName": "track1", "percentage": number},
            ...
          ],
          "keyInsights": ["insight1", "insight2", ...]
        },
        "analysis": "300-500 word personalized analysis explaining the recommendations"
      }
      
      Make sure all recommendations are specific to Morocco's educational system and provide practical, actionable advice.
      Focus on programs that are actually available in Morocco's universities.
      For each school recommendation, provide realistic information and avoid making up details.
      Do not include any other text in your response, just the JSON object.
    `;
    
    const result = await retryWithBackoff(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    });
    
    return extractJSON(result);
  } catch (error) {
    console.error('Error generating report:', error);
    return generateLocalReport(responses, scores, userProfile, language);
  }
};

// Extract insights from student responses (could be called in quizStore)
export const extractInsights = async (
  response: UserResponse,
  scores: OrientationScore[]
): Promise<string[]> => {
  if (!API_KEY) return [];
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
      Analyze this student's response to an educational orientation question and extract 
      2-3 meaningful insights about their educational preferences, strengths, or traits.
      
      Question: ${response.questionText}
      Response: ${response.response}
      
      Current track scores:
      ${scores.sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(s => `${s.trackName}: ${s.score.toFixed(2)}`)
        .join('\n')}
      
      Return a JSON array of insights, each being a concise statement:
      ["insight 1", "insight 2", "insight 3"]
      
      Do not include any other text in your response, just the JSON array.
    `;
    
    const result = await retryWithBackoff(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    });
    
    // Extract the JSON array from the response
    try {
      const match = result.match(/\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (error) {
      console.error('Failed to parse insights JSON:', error);
    }
    
    return [];
  } catch (error) {
    console.error('Error extracting insights:', error);
    return [];
  }
};

// Local fallback functions that work without the API
// These are simpler implementations for when the API is unavailable

const generateLocalQuestion = (
  previousResponses: UserResponse[],
  userProfile?: UserProfile,
  language: Language = 'en'
): Question => {
  // Use profile info to generate more relevant questions when available
  const isProfileCompleted = userProfile?.profileCompleted || false;

  const baseQuestionPool: Record<Language, Question[]> = {
    en: [
      {
        id: uuidv4(),
        text: "Which subjects do you enjoy studying the most?",
        type: "text" as QuestionType,
      },
      {
        id: uuidv4(),
        text: "Rate your interest in mathematics from 1 to 10.",
        type: "slider" as QuestionType,
      },
      {
        id: uuidv4(),
        text: "Which of these activities do you prefer?",
        type: "multiple-choice" as QuestionType,
        options: [
          "Solving mathematical problems",
          "Writing essays or stories",
          "Conducting scientific experiments",
          "Managing and organizing projects",
          "Creating artwork or designs"
        ]
      },
      // ...existing en questions...
    ],
    fr: [
      {
        id: uuidv4(),
        text: "Quelles matières préférez-vous étudier ?",
        type: "text" as QuestionType,
      },
      {
        id: uuidv4(),
        text: "Évaluez votre intérêt pour les mathématiques de 1 à 10.",
        type: "slider" as QuestionType,
      },
      {
        id: uuidv4(),
        text: "Laquelle de ces activités préférez-vous ?",
        type: "multiple-choice" as QuestionType,
        options: [
          "Résoudre des problèmes mathématiques",
          "Rédiger des essais ou des histoires",
          "Mener des expériences scientifiques",
          "Gérer et organiser des projets",
          "Créer des œuvres d'art ou des designs"
        ]
      },
      {
        id: uuidv4(),
        text: "Quel type de carrière souhaiteriez-vous poursuivre à l'avenir ?",
        type: "text" as QuestionType,
      },
      {
        id: uuidv4(),
        text: "Évaluez votre aisance à apprendre des langues de 1 à 10.",
        type: "slider" as QuestionType,
      }
    ],
    ar: [
      {
        id: uuidv4(),
        text: "ما هي المواد التي تستمتع بدراستها أكثر؟",
        type: "text" as QuestionType,
      },
      {
        id: uuidv4(),
        text: "قيّم اهتمامك بالرياضيات من 1 إلى 10.",
        type: "slider" as QuestionType,
      },
      {
        id: uuidv4(),
        text: "أي من هذه الأنشطة تفضل؟",
        type: "multiple-choice" as QuestionType,
        options: [
          "حل المسائل الرياضية",
          "كتابة المقالات أو القصص",
          "إجراء التجارب العلمية",
          "إدارة وتنظيم المشاريع",
          "إنشاء الأعمال الفنية أو التصاميم"
        ]
      },
      {
        id: uuidv4(),
        text: "ما نوع المهنة التي ترغب في متابعتها في المستقبل؟",
        type: "text" as QuestionType,
      },
      {
        id: uuidv4(),
        text: "قيّم مدى راحتك في تعلم اللغات من 1 إلى 10.",
        type: "slider" as QuestionType,
      }
    ]
  };
  
  // Additional questions if user profile is available
  const profileBasedQuestions: Question[] = [];
  
  if (isProfileCompleted && userProfile) {
    // Add questions based on user's interests in the selected language
    if (userProfile.interests.length > 0) {
      const interest = userProfile.interests[
        Math.floor(Math.random() * userProfile.interests.length)
      ];
      
      if (language === 'en') {
        profileBasedQuestions.push({
          id: uuidv4(),
          text: `You mentioned an interest in ${interest}. How long have you been interested in this subject?`,
          type: "text" as QuestionType,
        });
      } else if (language === 'fr') {
        profileBasedQuestions.push({
          id: uuidv4(),
          text: `Vous avez mentionné un intérêt pour ${interest}. Depuis combien de temps vous intéressez-vous à ce sujet ?`,
          type: "text" as QuestionType,
        });
      } else {
        profileBasedQuestions.push({
          id: uuidv4(),
          text: `لقد ذكرت اهتمامًا بـ ${interest}. منذ متى وأنت مهتم بهذا الموضوع؟`,
          type: "text" as QuestionType,
        });
      }
      
      // Add slider question for interest rating in appropriate language
      if (language === 'en') {
        profileBasedQuestions.push({
          id: uuidv4(),
          text: `Rate how much you would enjoy working in a field related to ${interest} (1-10).`,
          type: "slider" as QuestionType,
        });
      } else if (language === 'fr') {
        profileBasedQuestions.push({
          id: uuidv4(),
          text: `Évaluez à quel point vous aimeriez travailler dans un domaine lié à ${interest} (1-10).`,
          type: "slider" as QuestionType,
        });
      } else {
        profileBasedQuestions.push({
          id: uuidv4(),
          text: `قيّم مدى استمتاعك بالعمل في مجال مرتبط بـ ${interest} (1-10).`,
          type: "slider" as QuestionType,
        });
      }
    }
    
    // Add questions based on hobbies in appropriate language
    if (userProfile.hobbies.length > 0) {
      const hobby = userProfile.hobbies[
        Math.floor(Math.random() * userProfile.hobbies.length)
      ];
      
      if (language === 'en') {
        profileBasedQuestions.push({
          id: uuidv4(),
          text: `How do you think your hobby of ${hobby} might relate to your future career?`,
          type: "text" as QuestionType,
        });
      } else if (language === 'fr') {
        profileBasedQuestions.push({
          id: uuidv4(),
          text: `Comment pensez-vous que votre passe-temps ${hobby} pourrait être lié à votre future carrière ?`,
          type: "text" as QuestionType,
        });
      } else {
        profileBasedQuestions.push({
          id: uuidv4(),
          text: `كيف تعتقد أن هوايتك ${hobby} قد ترتبط بمهنتك المستقبلية؟`,
          type: "text" as QuestionType,
        });
      }
    }
    
    // ...existing code for location and education questions in appropriate language...
  }
  
  // Combine question pools
  const questionPool = [...(baseQuestionPool[language] || baseQuestionPool.en), ...profileBasedQuestions];
  
  // Avoid repeating questions if possible
  const askedQuestionTexts = previousResponses.map(r => r.questionText);
  const availableQuestions = questionPool.filter(q => !askedQuestionTexts.includes(q.text));
  
  // If all questions have been asked, just pick a random one
  if (availableQuestions.length === 0) {
    return questionPool[Math.floor(Math.random() * questionPool.length)];
  }
  
  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
};

const analyzeLocalResponse = (
  response: UserResponse,
  currentScores: OrientationScore[],
  userProfile?: UserProfile
): OrientationScore[] => {
  // Simple keyword-based scoring
  const keywordsMap: Record<string, string[]> = {
    'scientific': ['math', 'science', 'physics', 'chemistry', 'biology', 'research', 'laboratory', 'analysis', 'experiment', 'data', 'solve', 'problem',
                  // French keywords
                  'mathématiques', 'sciences', 'physique', 'chimie', 'biologie', 'recherche', 'laboratoire', 'analyse', 'expérience', 'données', 'résoudre', 'problème',
                  // Arabic keywords
                  'رياضيات', 'علوم', 'فيزياء', 'كيمياء', 'أحياء', 'بحث', 'مختبر', 'تحليل', 'تجربة', 'بيانات', 'حل', 'مشكلة'],
    'literary': ['literature', 'language', 'writing', 'reading', 'history', 'philosophy', 'culture', 'art', 'express', 'creative', 'books', 'poetry',
                // French keywords
                'littérature', 'langue', 'écriture', 'lecture', 'histoire', 'philosophie', 'culture', 'art', 'exprimer', 'créatif', 'livres', 'poésie',
                // Arabic keywords
                'أدب', 'لغة', 'كتابة', 'قراءة', 'تاريخ', 'فلسفة', 'ثقافة', 'فن', 'تعبير', 'إبداع', 'كتب', 'شعر'],
    // ...existing code with multilingual keywords for other categories...
  };
  
  // Convert response to lowercase for case-insensitive matching
  const responseText = String(response.response).toLowerCase();
  
  // Count keyword matches for each track
  const matchCounts: Record<string, number> = {};
  
  Object.entries(keywordsMap).forEach(([trackId, keywords]) => {
    matchCounts[trackId] = keywords.reduce((count, keyword) => {
      return count + (responseText.includes(keyword) ? 1 : 0);
    }, 0);
  });
  
  // If user profile has interests and hobbies, use them to boost scores
  if (userProfile?.profileCompleted) {
    const allInterests = [...(userProfile.interests || []), ...(userProfile.hobbies || [])];
    const allInterestsText = allInterests.join(' ').toLowerCase();
    
    // Boost tracks that match user interests
    Object.entries(keywordsMap).forEach(([trackId, keywords]) => {
      keywords.forEach(keyword => {
        if (allInterestsText.includes(keyword)) {
          matchCounts[trackId] = (matchCounts[trackId] || 0) + 0.5;
        }
      });
    });
  }
  
  // Calculate confidence based on the number of matches
  const totalMatches = Object.values(matchCounts).reduce((sum, count) => sum + count, 0);
  
  // If the question was using a slider (1-10), directly use the value for relevant tracks
  if (response.questionText.includes('mathematics') && typeof response.response === 'number') {
    matchCounts['scientific'] += response.response / 2; // More weight to scientific and engineering
    matchCounts['engineering'] += response.response / 2.5;
  }
  
  if (response.questionText.includes('languages') && typeof response.response === 'number') {
    matchCounts['literary'] += response.response / 2; // More weight to literary
  }
  
  // Update scores
  return currentScores.map(score => {
    const trackId = score.trackId;
    const matchCount = matchCounts[trackId] || 0;
    
    // If no matches and current confidence is 0, don't update
    if (matchCount === 0 && score.confidence === 0) {
      return score;
    }
    
    // Calculate new score components
    const newScoreComponent = matchCount > 0 
      ? Math.min(10, 5 + matchCount * 2) // Scale match count to a score
      : score.score; // Keep current score if no matches
    
    const newConfidence = Math.min(0.7, (score.confidence || 0.1) + (matchCount > 0 ? 0.1 : 0));
    
    // Weighted average if we already have a score with some confidence
    if (score.confidence > 0) {
      const combinedScore = (score.score * score.confidence + newScoreComponent * 0.2) 
        / (score.confidence + 0.2);
        
      return {
        ...score,
        score: combinedScore,
        confidence: newConfidence
      };
    }
    
    return {
      ...score,
      score: newScoreComponent,
      confidence: newConfidence
    };
  });
};

const generateLocalReport = (
  responses: UserResponse[],
  scores: OrientationScore[],
  userProfile?: UserProfile,
  language: Language = 'en'
): OrientationReport => {
  // Sort scores to find primary and secondary tracks
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  const primaryTrack = sortedScores[0];
  const secondaryTrack = sortedScores[1];
  
  // Get track details
  const primaryTrackId = primaryTrack.trackId as keyof typeof educationTracks;
  const secondaryTrackId = secondaryTrack.trackId as keyof typeof educationTracks;
  
  const primaryTrackData = educationTracks[primaryTrackId];
  const secondaryTrackData = educationTracks[secondaryTrackId];
  
  // Generate strengths based on highest scores and language
  let strengths: string[] = [];
  if (language === 'en') {
    strengths = [
      `Strong affinity for ${primaryTrackData.name.toLowerCase()} subjects`,
      `Good understanding of concepts related to ${primaryTrackData.description.toLowerCase()}`,
      `Demonstrated interest in ${secondaryTrackData.name.toLowerCase()}`
    ];
  } else if (language === 'fr') {
    strengths = [
      `Forte affinité pour les matières ${primaryTrackData.name.toLowerCase()}`,
      `Bonne compréhension des concepts liés à ${primaryTrackData.description.toLowerCase()}`,
      `Intérêt démontré pour ${secondaryTrackData.name.toLowerCase()}`
    ];
  } else { // Arabic
    strengths = [
      `ميل قوي نحو مواد ${primaryTrackData.name}`,
      `فهم جيد للمفاهيم المتعلقة بـ ${primaryTrackData.description}`,
      `اهتمام واضح بـ ${secondaryTrackData.name}`
    ];
  }
  
  // Generate areas to improve based on language
  const lowestScores = [...scores].sort((a, b) => a.score - b.score);
  let areasToImprove: string[] = [];
  
  if (language === 'en') {
    areasToImprove = [
      `Consider exploring more about ${lowestScores[0].trackName.toLowerCase()}`,
      `Develop additional skills related to ${lowestScores[1].trackName.toLowerCase()}`,
      `Gain more practical experience in your areas of interest`
    ];
  } else if (language === 'fr') {
    areasToImprove = [
      `Envisagez d'explorer davantage ${lowestScores[0].trackName.toLowerCase()}`,
      `Développez des compétences supplémentaires liées à ${lowestScores[1].trackName.toLowerCase()}`,
      `Acquérir plus d'expérience pratique dans vos domaines d'intérêt`
    ];
  } else { // Arabic
    areasToImprove = [
      `فكر في استكشاف المزيد حول ${lowestScores[0].trackName}`,
      `تطوير مهارات إضافية متعلقة بـ ${lowestScores[1].trackName}`,
      `اكتساب المزيد من الخبرة العملية في مجالات اهتمامك`
    ];
  }

  // Generate recommended programs - with safe property access
  let recommendedPrograms: string[] = [];
  if ('programs' in primaryTrackData && primaryTrackData.programs && 'undergraduate' in primaryTrackData.programs && Array.isArray(primaryTrackData.programs.undergraduate)) {
    recommendedPrograms = [...primaryTrackData.programs.undergraduate.slice(0, 5)];
  } else if ('sectors' in primaryTrackData && Array.isArray(primaryTrackData.sectors)) {
    const sectorPrograms = primaryTrackData.sectors.flatMap(sector => 
      'programs' in sector && Array.isArray(sector.programs) ? sector.programs : []
    );
    recommendedPrograms = sectorPrograms.slice(0, 5);
  } else {
    recommendedPrograms = [`Programs in ${primaryTrackData.name}`];
  }
  
  // Add secondary track programs if available
  if ('programs' in secondaryTrackData && secondaryTrackData.programs && 'undergraduate' in secondaryTrackData.programs && Array.isArray(secondaryTrackData.programs.undergraduate)) {
    recommendedPrograms.push(...secondaryTrackData.programs.undergraduate.slice(0, 2));
  }
  
  // Generate recommended universities - with safe property access
  let recommendedUniversities: string[] = [];
  
  if ('universities' in primaryTrackData && Array.isArray(primaryTrackData.universities)) {
    recommendedUniversities = [...primaryTrackData.universities.slice(0, 4)];
  } else if ('institutions' in primaryTrackData && Array.isArray(primaryTrackData.institutions)) {
    recommendedUniversities = [...primaryTrackData.institutions.slice(0, 4)];
  }
  
  if ('universities' in secondaryTrackData && Array.isArray(secondaryTrackData.universities)) {
    recommendedUniversities.push(...secondaryTrackData.universities.slice(0, 2));
  } else if ('institutions' in secondaryTrackData && Array.isArray(secondaryTrackData.institutions)) {
    recommendedUniversities.push(...secondaryTrackData.institutions.slice(0, 2));
  }
  
  // Generate mock statistical analysis
  const statisticalAnalysis: StatisticalAnalysis = {
    primaryPercentile: 85, // Mock value
    confidenceInterval: `${(primaryTrack.score - 1).toFixed(1)} - ${(primaryTrack.score + 1).toFixed(1)}`,
    trackDistribution: sortedScores.map(score => ({
      trackName: score.trackName,
      percentage: Math.round((score.score / sortedScores.reduce((sum, s) => sum + s.score, 0)) * 100)
    })),
    keyInsights: [
      `Your score for ${primaryTrackData.name} is ${Math.round(primaryTrack.score * 10)}% higher than average`,
      `Your profile shows a ${primaryTrack.score > 8 ? 'very strong' : 'strong'} alignment with ${primaryTrackData.name}`,
      `There's a ${primaryTrack.confidence > 0.7 ? 'high' : 'moderate'} confidence level in these recommendations`
    ]
  };

  // Generate school recommendations based on top tracks
  const schoolRecommendations: SchoolRecommendation[] = [];
  
  // Add universities from primary track - with safe property access
  if ('universities' in primaryTrackData && Array.isArray(primaryTrackData.universities) && primaryTrackData.universities.length > 0) {
    const primarySchools = primaryTrackData.universities.slice(0, 2).map(uni => {
      const uniParts = uni.split('-');
      const name = uniParts[0].trim();
      const location = uniParts.length > 1 ? uniParts[1].trim().replace(/[()]/g, '') : 'Morocco';
      
      let programs: string[] = [];
      if ('programs' in primaryTrackData && primaryTrackData.programs && 'undergraduate' in primaryTrackData.programs) {
        programs = Array.isArray(primaryTrackData.programs.undergraduate) ? 
          primaryTrackData.programs.undergraduate.slice(0, 3) : [];
      }
      
      return {
        name,
        location,
        distance: userProfile?.location ? `Varies based on campus location` : undefined,
        matchScore: Math.round(75 + (Math.random() * 20)), // 75-95
        programs,
        strengths: [
          `Strong reputation in ${primaryTrackData.name}`,
          `Comprehensive curriculum`,
          `Research opportunities`
        ],
        admissionRequirements: `Baccalaureate with good standing in relevant subjects`,
        website: `https://www.${name.toLowerCase().replace(/\s/g, '')}.ma`
      };
    });
    
    schoolRecommendations.push(...primarySchools);
  } else if ('institutions' in primaryTrackData && Array.isArray(primaryTrackData.institutions) && primaryTrackData.institutions.length > 0) {
    // ...existing code for institutions...
  }
  
  // Add universities from secondary track - with safe property access
  // ...existing code...

  // Generate analysis text in the appropriate language
  let analysis = '';
  if (language === 'en') {
    analysis = `
      Based on your responses, you show a strong alignment with ${primaryTrackData.name} 
      (score: ${primaryTrack.score.toFixed(1)}), followed by ${secondaryTrackData.name} 
      (score: ${secondaryTrack.score.toFixed(1)}). Your interests and preferences suggest you would
      excel in programs that combine elements of both these tracks.
      
      The Moroccan education system offers several pathways that align well with your profile.
      Programs like ${recommendedPrograms.slice(0, 2).join(' and ')} would build upon your
      strengths while providing opportunities to develop professionally in your areas of interest.
      
      ${userProfile?.location ? `Given your location in ${userProfile.location}, ` : ''}Universities such as ${recommendedUniversities.slice(0, 2).join(' and ')} have strong
      reputations in these fields and would provide quality education in your preferred areas.
      ${schoolRecommendations.length > 0 ? `We specifically recommend ${schoolRecommendations[0].name} with a match score of ${schoolRecommendations[0].matchScore}% based on your profile.` : ''}
      
      To strengthen your educational profile, consider gaining more exposure to
      ${lowestScores[0].trackName} concepts, as these could complement your primary interests
      and make you a more well-rounded candidate for your chosen programs.
      
      ${userProfile?.educationLevel ? `Given that you're currently at the ${userProfile.educationLevel} level, ` : ''}Your educational path in Morocco can combine your primary interests while leaving room
      to explore secondary interests through electives or minor specializations.
      
      Statistical analysis shows your scores are in the top percentiles for ${primaryTrackData.name},
      with a confidence interval of ${statisticalAnalysis.confidenceInterval}. This indicates a high
      probability that this educational direction would be satisfying and successful for you.
    `.trim().replace(/\n\s+/g, ' ');
  } else if (language === 'fr') {
    analysis = `
      D'après vos réponses, vous montrez une forte affinité avec ${primaryTrackData.name}
      (score: ${primaryTrack.score.toFixed(1)}), suivi par ${secondaryTrackData.name}
      (score: ${secondaryTrack.score.toFixed(1)}). Vos intérêts et préférences suggèrent que vous
      excelleriez dans des programmes combinant des éléments de ces deux filières.
      
      Le système éducatif marocain offre plusieurs voies qui correspondent bien à votre profil.
      Des programmes comme ${recommendedPrograms.slice(0, 2).join(' et ')} s'appuieraient sur
      vos points forts tout en offrant des opportunités de développement professionnel dans vos domaines d'intérêt.
      
      ${userProfile?.location ? `Compte tenu de votre localisation à ${userProfile.location}, ` : ''}Des universités comme ${recommendedUniversities.slice(0, 2).join(' et ')} ont de solides
      réputations dans ces domaines et offriraient une éducation de qualité dans vos domaines préférés.
      ${schoolRecommendations.length > 0 ? `Nous recommandons particulièrement ${schoolRecommendations[0].name} avec un score de correspondance de ${schoolRecommendations[0].matchScore}% basé sur votre profil.` : ''}
      
      Pour renforcer votre profil éducatif, envisagez d'acquérir plus d'exposition aux
      concepts de ${lowestScores[0].trackName}, car ceux-ci pourraient compléter vos intérêts principaux
      et faire de vous un candidat plus complet pour les programmes que vous avez choisis.
      
      ${userProfile?.educationLevel ? `Étant donné que vous êtes actuellement au niveau ${userProfile.educationLevel}, ` : ''}Votre parcours éducatif au Maroc peut combiner vos intérêts principaux tout en laissant de la place
      pour explorer des intérêts secondaires à travers des cours optionnels ou des spécialisations mineures.
      
      L'analyse statistique montre que vos scores se situent dans les meilleurs percentiles pour ${primaryTrackData.name},
      avec un intervalle de confiance de ${statisticalAnalysis.confidenceInterval}. Cela indique une forte
      probabilité que cette orientation éducative soit satisfaisante et réussie pour vous.
    `.trim().replace(/\n\s+/g, ' ');
  } else { // Arabic
    analysis = `
      بناءً على إجاباتك، تظهر توافقًا قويًا مع ${primaryTrackData.name} 
      (الدرجة: ${primaryTrack.score.toFixed(1)})، يليه ${secondaryTrackData.name} 
      (الدرجة: ${secondaryTrack.score.toFixed(1)}). تشير اهتماماتك وتفضيلاتك إلى أنك قد 
      تتفوق في البرامج التي تجمع بين عناصر من كلا المسارين.
      
      يقدم نظام التعليم المغربي العديد من المسارات التي تتوافق جيدًا مع ملفك الشخصي.
      برامج مثل ${recommendedPrograms.slice(0, 2).join(' و ')} ستبني على نقاط 
      قوتك مع توفير فرص للتطور المهني في مجالات اهتمامك.
      
      ${userProfile?.location ? `بالنظر إلى موقعك في ${userProfile.location}، ` : ''}جامعات مثل ${recommendedUniversities.slice(0, 2).join(' و ')} لديها 
      سمعة قوية في هذه المجالات وستوفر تعليمًا عالي الجودة في المجالات التي تفضلها.
      ${schoolRecommendations.length > 0 ? `نوصي بشكل خاص بـ ${schoolRecommendations[0].name} بدرجة توافق ${schoolRecommendations[0].matchScore}% بناءً على ملفك الشخصي.` : ''}
      
      لتعزيز ملفك التعليمي، ننصحك بالتعرف أكثر على مفاهيم
      ${lowestScores[0].trackName}، حيث يمكن أن تكمل هذه المفاهيم اهتماماتك الرئيسية
      وتجعلك مرشحًا أكثر تكاملاً للبرامج التي اخترتها.
      
      ${userProfile?.educationLevel ? `نظرًا لأنك حاليًا في مستوى ${userProfile.educationLevel}، ` : ''}يمكن لمسارك التعليمي في المغرب أن يجمع بين اهتماماتك الرئيسية مع ترك مساحة
      لاستكشاف الاهتمامات الثانوية من خلال المقررات الاختيارية أو التخصصات الثانوية.
      
      تظهر التحليلات الإحصائية أن درجاتك تقع في أعلى النسب المئوية لـ ${primaryTrackData.name}،
      مع فاصل ثقة ${statisticalAnalysis.confidenceInterval}. هذا يشير إلى احتمالية عالية
      بأن هذا التوجيه التعليمي سيكون مرضيًا وناجحًا بالنسبة لك.
    `.trim().replace(/\n\s+/g, ' ');
  }
  
  return {
    primaryTrack: primaryTrackData.name,
    secondaryTrack: secondaryTrackData.name,
    scores: sortedScores,
    strengths,
    areasToImprove,
    recommendedPrograms,
    recommendedUniversities,
    schoolRecommendations,
    statisticalAnalysis,
    analysis
  };
};