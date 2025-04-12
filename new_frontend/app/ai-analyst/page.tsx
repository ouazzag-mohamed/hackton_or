'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuizStore } from './store/quizStore';
import QuestionCard from './components/QuestionCard';
import ProgressTracker from './components/ProgressTracker';
import ReportView from './components/ReportView';
import Link from 'next/link';
import { useTranslation } from './translations/useTranslation';
import { EnhancedLanguageSelector } from './components/EnhancedLanguageSelector';
import AutoFillButton from './components/AutoFillButton';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import { 
  ChevronRight, 
  BarChart3, 
  Lightbulb, 
  UserCircle,
  BookOpen, 
  RefreshCw, 
  Settings,
  Sparkles,
  ChevronLeft,
  Brain,
  Zap
} from 'lucide-react';

export default function Home() {
  const {
    initialized,
    currentQuestion,
    progress,
    totalQuestions,
    report,
    error,
    isLoading,
    inProfilePhase,
    initQuiz,
    answerQuestion,
    resetQuiz
  } = useQuizStore();

  const { t } = useTranslation();
  const [devMode, setDevMode] = useState(false);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initQuiz();
    }
    
    // Return cleanup function
    return () => {
      if (initialized) {
        resetQuiz();
      }
    };
  }, [initialized, initQuiz, resetQuiz]);

  // Randomly select tips to show
  const tips = useMemo(() => [
    "Répondez honnêtement pour des résultats plus précis",
    "Prenez votre temps pour réfléchir à chaque question",
    "L'analyse utilise l'IA pour adapter les résultats à votre profil unique",
    "Vos réponses aident à créer un parcours éducatif personnalisé",
    "Explorez toutes les options recommandées, pas seulement les plus évidentes"
  ], []);

  const randomTip = useMemo(() => tips[Math.floor(Math.random() * tips.length)], [tips]);

  const handleStartQuiz = () => {
    initQuiz();
  };

  const toggleDevMode = () => {
    setDevMode(!devMode);
  };

  // Extract response values for the AutoFillButton
  const previousAnswers = useMemo(() => {
    const responses = useQuizStore.getState().responses;
    return responses.map(response => response.response);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    },
    exit: { opacity: 0 }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: { y: -20, opacity: 0 }
  };

  // Animated background elements
  const BackgroundElements = () => (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Top left blob */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full bg-emerald-100/30 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        
        {/* Bottom right blob */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-100/30 translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        
        {/* Middle accent */}
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-amber-100/20 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        
        {/* Small decorative elements */}
        <div className="absolute top-[20%] right-[15%] w-4 h-4 rounded-full bg-emerald-400/30 animate-pulse"></div>
        <div className="absolute bottom-[30%] left-[10%] w-6 h-6 rounded-full bg-blue-400/30 animate-pulse"></div>
        <div className="absolute top-[70%] right-[25%] w-5 h-5 rounded-full bg-amber-400/30 animate-pulse"></div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      <BackgroundElements />
      <Navbar />
      
      {/* Developer Mode Toggle */}
      <div className="fixed top-20 right-3 z-10">
        <button
          onClick={toggleDevMode}
          className="text-xs bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded-md flex items-center"
        >
          <Settings className="w-3 h-3 mr-1" />
          {devMode ? "Hide Tools" : "Dev Tools"}
        </button>
        
        {devMode && (
          <Link href="/dev-test" className="ml-2 text-xs bg-purple-600 text-white hover:bg-purple-700 py-1 px-2 rounded-md flex items-center">
            <Settings className="w-3 h-3 mr-1" />
            Open Test Page
          </Link>
        )}
      </div>
      
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <div className="flex justify-between items-center w-full mb-8">
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href="/" className="mr-4 text-gray-700 hover:text-emerald-500 flex items-center">
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  <span>Retour</span>
                </Link>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  AI Analyst
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <EnhancedLanguageSelector />
              </motion.div>
            </div>

            {!initialized ? (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="bg-white shadow-xl rounded-2xl overflow-hidden max-w-3xl mx-auto border border-gray-100"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 md:p-10 text-white relative overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-3xl font-bold mb-2 flex items-center">
                      <Brain className="w-8 h-8 mr-3" />
                      Analyse d'Orientation Éducative
                    </h2>
                    <p className="text-emerald-50 max-w-2xl text-lg">
                      Découvrez le parcours éducatif qui vous correspond le mieux en fonction de vos intérêts, aptitudes et préférences
                    </p>
                  </motion.div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -right-28 -bottom-28">
                    <div className="w-56 h-56 rounded-full bg-white opacity-10"></div>
                  </div>
                  <div className="absolute -left-16 -top-16">
                    <div className="w-32 h-32 rounded-full bg-white opacity-10"></div>
                  </div>

                  {/* Floating particles */}
                  <div className="absolute top-10 right-10 w-3 h-3 rounded-full bg-white/30 animate-float"></div>
                  <div className="absolute top-20 right-24 w-2 h-2 rounded-full bg-white/20 animate-float-slow"></div>
                  <div className="absolute bottom-12 right-32 w-4 h-4 rounded-full bg-white/20 animate-float-reverse"></div>
                </div>

                <div className="p-8 md:p-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8 flex flex-col md:flex-row md:space-x-6 items-center"
                  >
                    <div className="hidden md:block w-48 h-48 relative flex-shrink-0 mb-4 md:mb-0">
                      <Image 
                        src="/illustrations.svg" 
                        alt="Illustration" 
                        fill 
                        className="object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Découvrez votre voie</h3>
                      <p className="text-gray-600">
                        Notre système d'analyse, alimenté par l'intelligence artificielle, examinera 
                        vos réponses pour générer des recommandations personnalisées alignées sur vos 
                        talents et aspirations.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200/50 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Lightbulb className="w-5 h-5 text-emerald-600 mr-2" />
                      Comment ça marche:
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: UserCircle, text: "Partagez quelques informations de base sur vous-même" },
                        { icon: BookOpen, text: "Répondez à des questions sur vos intérêts et préférences" },
                        { icon: BarChart3, text: "Notre IA analysera vos réponses en temps réel" },
                        { icon: Sparkles, text: "Recevez un rapport d'orientation éducative personnalisé" }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + (index * 0.1) }}
                          className="flex items-start"
                        >
                          <div className="bg-emerald-100 p-2.5 rounded-full mr-3 flex-shrink-0">
                            <item.icon className="w-5 h-5 text-emerald-600" />
                          </div>
                          <span className="text-gray-700">{item.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col items-center"
                  >
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mb-6 w-full">
                      <div className="flex">
                        <Sparkles className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-amber-800 text-sm">
                          <span className="font-medium">Conseil: </span> 
                          {randomTip}
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={handleStartQuiz}
                      className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md flex items-center border-b-4 border-emerald-700 hover:shadow-lg"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="text-lg">Commencer l'évaluation</span>
                      <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white shadow-lg rounded-2xl overflow-hidden max-w-2xl mx-auto border border-gray-100"
              >
                <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white">
                  <motion.h3 variants={itemVariants} className="text-xl font-bold mb-1">
                    Une erreur est survenue
                  </motion.h3>
                  <motion.p variants={itemVariants} className="text-red-100">
                    Nous avons rencontré un problème lors du traitement de votre demande
                  </motion.p>
                </div>
                
                <div className="p-6">
                  <motion.div variants={itemVariants} className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
                    <p className="text-red-800">{error}</p>
                  </motion.div>
                  
                  <motion.button
                    variants={itemVariants}
                    onClick={resetQuiz}
                    className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center font-medium"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Réessayer
                  </motion.button>
                </div>
              </motion.div>
            ) : report ? (
              <motion.div
                key="report"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <ReportView report={report} onReset={resetQuiz} />
              </motion.div>
            ) : (
              <motion.div
                key="quiz"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full flex flex-col items-center"
              >
                {/* Combined Question Card + Progress Tracker */}
                <motion.div 
                  variants={itemVariants} 
                  className="w-full max-w-3xl"
                >
                  {currentQuestion && (
                    <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-gray-100 relative">
                      {/* Progress Tracker now at the top of the card */}
                      <div className="px-6 pt-6">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-lg shadow-sm">
                              <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">{t('general.progress')}</span>
                              <h3 className="text-2xl font-bold text-gray-800">{Math.round((progress / totalQuestions) * 100)}%</h3>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg">
                              <Zap className="w-4 h-4" />
                              <span>{progress}/{totalQuestions} {t('general.questions')}</span>
                            </div>
                            
                            <div className="flex sm:hidden items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700">
                              <span className="text-sm font-semibold">{progress}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                          {/* Background pattern */}
                          <div className="absolute inset-0 opacity-20">
                            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:20px_100%] animate-[shimmer_2s_infinite]"></div>
                          </div>
                          
                          <motion.div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round((progress / totalQuestions) * 100)}%` }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                          >
                            {/* Shine effect */}
                            <div className="absolute inset-0 overflow-hidden">
                              <div className="h-full w-20 bg-white/30 transform -skew-x-30 animate-shimmer"></div>
                            </div>
                          </motion.div>
                        </div>
                        
                        {/* Tips Section */}
                        {showTips && (
                          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 mb-4">
                            <div className="flex justify-between">
                              <div className="flex">
                                <Sparkles className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                                <p className="text-amber-800 text-sm">
                                  <span className="font-medium">{t('general.tip')}: </span> 
                                  {randomTip}
                                </p>
                              </div>
                              <button 
                                onClick={() => setShowTips(false)}
                                className="text-amber-500 hover:text-amber-700"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {!showTips && (
                          <button 
                            onClick={() => setShowTips(true)}
                            className="text-sm text-gray-500 hover:text-emerald-600 mb-2 flex items-center"
                          >
                            <Lightbulb className="w-4 h-4 mr-1" />
                            {t('general.showTip')}
                          </button>
                        )}
                      </div>

                      {/* Question Card Content */}
                      <QuestionCard
                        question={currentQuestion}
                        onSubmit={answerQuestion}
                        isLoading={isLoading}
                        isProfileQuestion={inProfilePhase}
                        questionNumber={progress}
                        totalQuestions={totalQuestions}
                        embedded={true}
                      />

                      {/* Auto Fill Button */}
                      {devMode && (
                        <div className="p-4 pt-0">
                          <AutoFillButton
                            questionType={currentQuestion.type}
                            previousAnswers={previousAnswers}
                            options={currentQuestion.options}
                            onSelectAnswer={answerQuestion}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
            
            {/* Development Info */}
            {devMode && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-gray-800 text-gray-200 p-4 rounded-lg max-w-2xl text-xs font-mono border border-gray-700 shadow-lg mx-auto"
              >
                <h4 className="font-bold mb-2 text-emerald-400">Debug Info:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex space-x-2">
                    <span className="text-gray-400">Initialized:</span>
                    <span className={initialized ? "text-emerald-400" : "text-red-400"}>
                      {initialized ? "true" : "false"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-gray-400">Progress:</span>
                    <span className="text-blue-400">{progress} / {totalQuestions}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-gray-400">Loading:</span>
                    <span className={isLoading ? "text-amber-400" : "text-emerald-400"}>
                      {isLoading ? "true" : "false"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-gray-400">Has Report:</span>
                    <span className={report ? "text-emerald-400" : "text-gray-400"}>
                      {report ? "true" : "false"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-gray-400">Question Type:</span>
                    <span className="text-purple-400">
                      {currentQuestion?.type || "none"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-gray-400">Profile Phase:</span>
                    <span className={inProfilePhase ? "text-indigo-400" : "text-emerald-400"}>
                      {inProfilePhase ? "true" : "false"}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
