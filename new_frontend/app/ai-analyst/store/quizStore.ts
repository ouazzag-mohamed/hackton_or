import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Add this import
import { v4 as uuidv4 } from 'uuid';
import { generateQuestion, analyzeResponse, generateReport, extractInsights } from '../utils/aiService';
import { educationTracks } from '../data/moroccoEducationData';
import { Language, useLanguageStore } from './languageStore';
import { translations } from '../translations';

export type QuestionType = 'text' | 'multiple-choice' | 'slider';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  previousResponses?: UserResponse[];
}

export interface UserResponse {
  questionId: string;
  questionText: string;
  response: string | number;
  timestamp: number;
}

export interface OrientationScore {
  trackId: string;
  trackName: string;
  score: number;
  confidence: number;
}

// New types for enhanced report
export interface SchoolRecommendation {
  name: string;
  location: string;
  distance?: string;
  matchScore: number;
  programs: string[];
  strengths: string[];
  admissionRequirements: string;
  website?: string;
}

export interface StatisticalAnalysis {
  primaryPercentile: number;
  confidenceInterval: string;
  trackDistribution: { trackName: string; percentage: number }[];
  keyInsights: string[];
}

export interface UserProfile {
  name: string;
  location: string;
  educationLevel: string;
  hobbies: string[];
  interests: string[];
  profileCompleted: boolean;
  age?: string; // Optional age property
  school?: string; // Optional school property
}

export interface OrientationReport {
  primaryTrack: string;
  secondaryTrack: string;
  scores: OrientationScore[];
  strengths: string[];
  areasToImprove: string[];
  recommendedPrograms: string[];
  recommendedUniversities: string[];
  analysis: string;
  schoolRecommendations?: SchoolRecommendation[];
  statisticalAnalysis?: StatisticalAnalysis;
  userProfile?: UserProfile; // Added missing property
  recommendations?: string[]; // Added missing property
}

interface QuizState {
  sessionId: string;
  currentQuestion: Question | null;
  responses: UserResponse[];
  orientationScores: OrientationScore[];
  isLoading: boolean;
  progress: number;
  totalQuestions: number;
  error: string | null;
  report: OrientationReport | null;
  initialized: boolean;
  
  // User profile
  userProfile: UserProfile;
  
  // Insights collection
  insights: string[];
  
  // Whether we're in the profile gathering phase or assessment phase
  inProfilePhase: boolean;
  
  // Current language
  getCurrentLanguage: () => Language;
  
  // Actions
  initQuiz: () => Promise<void>;
  answerQuestion: (response: string | number) => Promise<void>;
  generateReport: () => Promise<void>;
  resetQuiz: () => void;
}

// Initial user profile
const initialUserProfile: UserProfile = {
  name: '',
  location: '',
  educationLevel: '',
  hobbies: [],
  interests: [],
  profileCompleted: false
};

// Initial orientation scores
const initialOrientationScores = Object.keys(educationTracks).map(trackId => ({
  trackId,
  trackName: educationTracks[trackId as keyof typeof educationTracks].name,
  score: 0,
  confidence: 0,
}));

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      sessionId: '',
      currentQuestion: null,
      responses: [],
      orientationScores: initialOrientationScores,
      isLoading: false,
      progress: 0,
      totalQuestions: 13, // Increased to accommodate profile questions + more assessment
      error: null,
      report: null,
      initialized: false,
      
      // User profile
      userProfile: initialUserProfile,
      
      // Insights collection
      insights: [],
      
      // Start in profile phase
      inProfilePhase: true,

      // Get current language from the language store
      getCurrentLanguage: () => {
        // Access the language store outside of React components
        // Note: This is a workaround as we can't use hooks directly in the store
        // In a real implementation, you might use a different approach or pass the language as a parameter
        return (useLanguageStore.getState().language);
      },

      // Listen for language changes and update the current question
      listenToLanguageChanges: () => {
        // Early return if we're in a server environment or if already subscribed
        if (typeof window === 'undefined') return;
        
        // Get the unsubscribe function from the useLanguageStore
        const unsubscribe = useLanguageStore.subscribe(
          async (state) => {
            const quizStore = get();
            
            // Only update question if we have a current question and are in profile phase
            if (quizStore.currentQuestion && quizStore.inProfilePhase) {
              const language = state.language;
              const currentQuestion = quizStore.currentQuestion;
              const translationKey = language as keyof typeof translations;
              const t = translations[translationKey];
              
              // Map current question to equivalent in new language
              const profileQuestions = {
                [translations.en.quiz.profileQuestion.name]: t.quiz.profileQuestion.name,
                [translations.en.quiz.profileQuestion.location]: t.quiz.profileQuestion.location,
                [translations.en.quiz.profileQuestion.educationLevel]: t.quiz.profileQuestion.educationLevel,
                [translations.en.quiz.profileQuestion.hobbies]: t.quiz.profileQuestion.hobbies,
                [translations.en.quiz.profileQuestion.academicInterests]: t.quiz.profileQuestion.academicInterests,
                [translations.fr.quiz.profileQuestion.name]: t.quiz.profileQuestion.name,
                [translations.fr.quiz.profileQuestion.location]: t.quiz.profileQuestion.location,
                [translations.fr.quiz.profileQuestion.educationLevel]: t.quiz.profileQuestion.educationLevel,
                [translations.fr.quiz.profileQuestion.hobbies]: t.quiz.profileQuestion.hobbies,
                [translations.fr.quiz.profileQuestion.academicInterests]: t.quiz.profileQuestion.academicInterests,
                [translations.ar.quiz.profileQuestion.name]: t.quiz.profileQuestion.name,
                [translations.ar.quiz.profileQuestion.location]: t.quiz.profileQuestion.location,
                [translations.ar.quiz.profileQuestion.educationLevel]: t.quiz.profileQuestion.educationLevel,
                [translations.ar.quiz.profileQuestion.hobbies]: t.quiz.profileQuestion.hobbies,
                [translations.ar.quiz.profileQuestion.academicInterests]: t.quiz.profileQuestion.academicInterests,
              };
              
              // Find the translated question text
              const translatedText = profileQuestions[currentQuestion.text];
              
              if (translatedText) {
                // Update the question text
                set({
                  currentQuestion: {
                    ...currentQuestion,
                    text: translatedText,
                    // Update options if we have them and we're on the education level question
                    ...(currentQuestion.type === 'multiple-choice' && 
                       (currentQuestion.text === translations.en.quiz.profileQuestion.educationLevel ||
                        currentQuestion.text === translations.fr.quiz.profileQuestion.educationLevel ||
                        currentQuestion.text === translations.ar.quiz.profileQuestion.educationLevel) && {
                      options: Array.isArray(t.quiz.educationLevelOptions) 
                        ? t.quiz.educationLevelOptions 
                        : translations.en.quiz.educationLevelOptions
                    })
                  }
                });
              } else if (!quizStore.inProfilePhase) {
                // For non-profile questions, we need to generate a new question
                const updatedQuestion = await generateQuestion(
                  quizStore.responses,
                  quizStore.orientationScores,
                  quizStore.userProfile,
                  language
                );
                
                set({
                  currentQuestion: updatedQuestion
                });
              }
            }
          },
          (state) => state.language // Only trigger when language changes
        );
        
        // Return unsubscribe function (though we don't use it in this implementation)
        return unsubscribe;
      },

      initQuiz: async () => {
        set({ 
          isLoading: true, 
          error: null, 
          sessionId: uuidv4(), 
          initialized: true,
          inProfilePhase: true 
        });
        
        try {
          const language = get().getCurrentLanguage();
          
          // Listen for language changes 
          get().listenToLanguageChanges();
          
          // First question is always about name - use translation
          const firstQuestionText = language === 'en' 
            ? translations.en.quiz.profileQuestion.name
            : language === 'fr'
              ? translations.fr.quiz.profileQuestion.name
              : translations.ar.quiz.profileQuestion.name;
          
          const firstQuestion: Question = {
            id: uuidv4(),
            text: firstQuestionText,
            type: "text"
          };
          
          set({ 
            currentQuestion: firstQuestion, 
            isLoading: false, 
            progress: 0
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to initialize quiz', 
            isLoading: false 
          });
        }
      },

      answerQuestion: async (response: string | number) => {
        const { 
          currentQuestion, 
          responses, 
          orientationScores, 
          progress, 
          totalQuestions,
          userProfile,
          insights,
          inProfilePhase
        } = get();
        
        if (!currentQuestion) return;
        
        set({ isLoading: true, error: null });

        try {
          // Record the response
          const newResponse: UserResponse = {
            questionId: currentQuestion.id,
            questionText: currentQuestion.text,
            response,
            timestamp: Date.now(),
          };
          
          const updatedResponses = [...responses, newResponse];
          const language = get().getCurrentLanguage();
          
          // Process profile questions if in profile phase
          if (inProfilePhase) {
            // Create updated user profile
            const updatedProfile = { ...userProfile };
            
            // Get translations for the current language
            const translationKey = language as keyof typeof translations;
            const t = translations[translationKey];
            
            // Process the response based on the question text comparison with translated strings
            if (currentQuestion.text === t.quiz.profileQuestion.name) {
              updatedProfile.name = String(response);
              
              // Next question about location
              const nextQuestion: Question = {
                id: uuidv4(),
                text: t.quiz.profileQuestion.location,
                type: "text"
              };
              
              set({
                currentQuestion: nextQuestion,
                responses: updatedResponses,
                userProfile: updatedProfile,
                progress: progress + 1,
                isLoading: false
              });
              return;
              
            } else if (currentQuestion.text === t.quiz.profileQuestion.location) {
              updatedProfile.location = String(response);
              
              // Next question about education level
              const nextQuestion: Question = {
                id: uuidv4(),
                text: t.quiz.profileQuestion.educationLevel,
                type: "multiple-choice",
                options: Array.isArray(t.quiz.educationLevelOptions) 
                  ? t.quiz.educationLevelOptions 
                  : translations.en.quiz.educationLevelOptions  // Fallback
              };
              
              set({
                currentQuestion: nextQuestion,
                responses: updatedResponses,
                userProfile: updatedProfile,
                progress: progress + 1,
                isLoading: false
              });
              return;
              
            } else if (currentQuestion.text === t.quiz.profileQuestion.educationLevel) {
              updatedProfile.educationLevel = String(response);
              
              // Next question about hobbies
              const nextQuestion: Question = {
                id: uuidv4(),
                text: t.quiz.profileQuestion.hobbies,
                type: "text"
              };
              
              set({
                currentQuestion: nextQuestion,
                responses: updatedResponses,
                userProfile: updatedProfile,
                progress: progress + 1,
                isLoading: false
              });
              return;
              
            } else if (currentQuestion.text === t.quiz.profileQuestion.hobbies) {
              // Parse comma-separated hobbies
              const hobbiesList = String(response)
                .split(',')
                .map(hobby => hobby.trim())
                .filter(hobby => hobby.length > 0);
                
              updatedProfile.hobbies = hobbiesList;
              
              // Final profile question about academic interests
              const nextQuestion: Question = {
                id: uuidv4(),
                text: t.quiz.profileQuestion.academicInterests,
                type: "text"
              };
              
              set({
                currentQuestion: nextQuestion,
                responses: updatedResponses,
                userProfile: updatedProfile,
                progress: progress + 1,
                isLoading: false
              });
              return;
              
            } else if (currentQuestion.text === t.quiz.profileQuestion.academicInterests) {
              // Parse comma-separated interests
              const interestsList = String(response)
                .split(',')
                .map(interest => interest.trim())
                .filter(interest => interest.length > 0);
                
              updatedProfile.interests = interestsList;
              updatedProfile.profileCompleted = true;
              
              // Now exit profile phase and start the actual assessment
              // Generate the first assessment question using profile data
              const assessmentQuestion = await generateQuestion(
                updatedResponses, 
                orientationScores, 
                updatedProfile,
                language
              );
              
              set({
                currentQuestion: assessmentQuestion,
                responses: updatedResponses,
                userProfile: updatedProfile,
                progress: progress + 1,
                isLoading: false,
                inProfilePhase: false // Exit profile phase
              });
              return;
            }
          }
          
          // From here, we're in the assessment phase
          
          // Update orientation scores based on the response
          const newScores = await analyzeResponse(
            newResponse, 
            orientationScores, 
            updatedResponses,
            get().userProfile,
            language
          );
          
          // Extract insights from the response
          const newInsights = await extractInsights(newResponse, newScores, language);
          const updatedInsights = [...insights, ...newInsights];
          
          const newProgress = progress + 1;
          
          if (newProgress >= totalQuestions) {
            // We've reached the end of the quiz
            set({
              responses: updatedResponses,
              orientationScores: newScores,
              insights: updatedInsights,
              progress: newProgress,
              isLoading: false,
              currentQuestion: null,
            });
            
            // Generate report automatically
            await get().generateReport();
          } else {
            // Generate next question
            const nextQuestion = await generateQuestion(
              updatedResponses, 
              newScores,
              get().userProfile,
              language
            );
            
            set({
              currentQuestion: nextQuestion,
              responses: updatedResponses,
              orientationScores: newScores,
              insights: updatedInsights,
              progress: newProgress,
              isLoading: false,
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to process your response', 
            isLoading: false 
          });
        }
      },

      generateReport: async () => {
        const { responses, orientationScores, userProfile, insights } = get();
        const language = get().getCurrentLanguage();
        
        set({ isLoading: true, error: null });
        
        try {
          const report = await generateReport(responses, orientationScores, userProfile, insights, language);
          set({ report, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to generate report', 
            isLoading: false 
          });
        }
      },

      resetQuiz: () => {
        set({
          sessionId: uuidv4(),
          currentQuestion: null,
          responses: [],
          orientationScores: initialOrientationScores,
          isLoading: false,
          progress: 0,
          error: null,
          report: null,
          initialized: false,
          userProfile: initialUserProfile,
          insights: [],
          inProfilePhase: true
        });
      }
    }),
    {
      name: 'quiz-store',
      // ...existing persistence options...
    }
  )
);