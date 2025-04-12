'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '../store/quizStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle,
  UserCircle,
  BookOpen,
  Star,
  PenTool,
  Sparkles,
  ListChecks,
  Sliders
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onSubmit: (response: string | number) => void;
  isLoading: boolean;
  isProfileQuestion?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
  embedded?: boolean; // New prop to indicate if it's embedded in the progress tracker
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onSubmit, 
  isLoading,
  isProfileQuestion = false,
  questionNumber = 0,
  totalQuestions = 0,
  embedded = false  // Default to false for backward compatibility
}) => {
  const [textResponse, setTextResponse] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(5);
  const [showHint, setShowHint] = useState(false);
  const [isHintPanelOpen, setIsHintPanelOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Reset selected values when question changes
  useEffect(() => {
    setTextResponse('');
    setSelectedOption(null);
    setSliderValue(5);
    setShowHint(false);
    setIsHintPanelOpen(false);
    setIsTyping(false);
  }, [question]);

  // Set typing status for text responses
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextResponse(e.target.value);
    setIsTyping(true);
    
    // Clear typing status after 1 second of inactivity
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (question.type === 'text' && textResponse.trim()) {
      onSubmit(textResponse);
      setTextResponse('');
    } else if (question.type === 'multiple-choice' && selectedOption) {
      onSubmit(selectedOption);
      setSelectedOption(null);
    } else if (question.type === 'slider') {
      onSubmit(sliderValue);
      setSliderValue(5);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      }
    },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const floatingIconVariants = {
    initial: { y: 0, opacity: 0.5 },
    animate: { 
      y: [-5, 5, -5], 
      opacity: [0.5, 0.8, 0.5],
      transition: { 
        repeat: Infinity, 
        duration: 4
      }
    }
  };

  // Determine category icon based on the question
  const getCategoryIcon = () => {
    if (isProfileQuestion) {
      return <UserCircle className="w-5 h-5" />;
    } else if (question.category === 'interests') {
      return <Star className="w-5 h-5" />;
    } else {
      return <BookOpen className="w-5 h-5" />;
    }
  };

  // Get the question type icon
  const getQuestionTypeIcon = () => {
    switch (question.type) {
      case 'text':
        return <PenTool className="w-5 h-5" />;
      case 'multiple-choice':
        return <ListChecks className="w-5 h-5" />;
      case 'slider':
        return <Sliders className="w-5 h-5" />;
      default:
        return <HelpCircle className="w-5 h-5" />;
    }
  };

  // Function to render appropriate input based on question type
  const renderQuestionInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <motion.div 
            variants={itemVariants} 
            className="mt-8 relative"
          >
            <div className="relative group">
              <textarea
                className="w-full p-5 border bg-white/80 backdrop-blur-sm border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 shadow-md hover:shadow-lg transition-all min-h-[160px] text-base"
                rows={5}
                value={textResponse}
                onChange={handleTextChange}
                placeholder={isProfileQuestion ? "Exprimez-vous librement..." : "Partagez vos pensées ici..."}
                disabled={isLoading}
              />
              
              <AnimatePresence>
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, bottom: -10 }}
                    animate={{ opacity: 1, bottom: -20 }}
                    exit={{ opacity: 0, bottom: -10 }}
                    className="absolute right-4 text-emerald-500 text-xs font-medium"
                  >
                    typing...
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md transition-transform transform group-hover:scale-110">
                <PenTool className="w-5 h-5 text-white" />
              </div>
            </div>
            
            {textResponse.trim().length > 0 && (
              <motion.p 
                className="text-xs text-right mt-2 text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {textResponse.length} caractères
              </motion.p>
            )}
          </motion.div>
        );
        
      case 'multiple-choice':
        return (
          <motion.div 
            variants={containerVariants}
            className="mt-8 relative"
          >
            <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md z-10">
              <ListChecks className="w-5 h-5 text-white" />
            </div>
            
            <ul className="grid grid-cols-1 gap-3 relative z-0">
              {question.options?.map((option, index) => {
                const isSelected = selectedOption === option;
                
                return (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <motion.button
                      type="button"
                      onClick={() => !isLoading && setSelectedOption(option)}
                      disabled={isLoading}
                      className={`w-full p-5 border text-left rounded-xl cursor-pointer transition-all flex items-center group ${
                        isSelected 
                          ? 'border-transparent bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' 
                          : 'border-gray-200 hover:border-emerald-200 bg-white/80 backdrop-blur-sm hover:bg-emerald-50/80 shadow-sm hover:shadow-md'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`
                        w-6 h-6 rounded-full mr-4 flex-shrink-0 flex items-center justify-center transition-all
                        ${isSelected
                          ? 'bg-white'
                          : 'border-2 border-gray-300 group-hover:border-emerald-300'
                        }
                      `}>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      <span className={`text-base ${isSelected ? 'font-medium' : ''}`}>{option}</span>
                      
                      {isSelected && (
                        <motion.div 
                          className="absolute -top-1 -right-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                          <div className="bg-emerald-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        );
        
      case 'slider':
        return (
          <motion.div 
            variants={containerVariants}
            className="mt-8 relative"
          >
            <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md z-10">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-md">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <span className="block text-xl font-semibold text-red-500">1</span>
                    <span className="text-xs text-gray-600">Pas du tout</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xl font-semibold text-amber-500">5</span>
                    <span className="text-xs text-gray-600">Modérément</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xl font-semibold text-emerald-500">10</span>
                    <span className="text-xs text-gray-600">Totalement</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="h-2 bg-gradient-to-r from-red-300 via-amber-300 to-emerald-300 rounded-full"></div>
                  
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseInt(e.target.value))}
                    className="w-full h-6 absolute top-1/2 -translate-y-1/2 appearance-none cursor-pointer bg-transparent"
                    style={{
                      // Removing default styles
                      WebkitAppearance: "none",
                      appearance: "none",
                      backgroundColor: "transparent"
                    }}
                    disabled={isLoading}
                  />
                  
                  {/* Custom slider thumb */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 rounded-full shadow-lg pointer-events-none z-10"
                    style={{
                      left: `calc(${((sliderValue - 1) / 9) * 100}% - ${sliderValue === 1 ? 0 : sliderValue === 10 ? 24 : 12}px)`,
                      borderColor: sliderValue <= 3 ? '#ef4444' : sliderValue <= 7 ? '#f59e0b' : '#10b981',
                      transform: 'translateY(-50%)'
                    }}
                  />
                  
                  {/* Circle marker for current value */}
                  <motion.div 
                    className="absolute w-12 h-12 rounded-full bg-gray-100/50 backdrop-blur-sm pointer-events-none"
                    style={{
                      left: `calc(${((sliderValue - 1) / 9) * 100}% - 24px)`,
                      top: "50%",
                      transform: "translateY(-50%)"
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <motion.div 
                  className={`px-8 py-3 rounded-full font-medium text-lg flex items-center ${
                    sliderValue >= 8 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' : 
                    sliderValue >= 5 ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white' :
                    'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  }`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={sliderValue}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <span className="mr-2 text-xl">{sliderValue}</span>
                  {sliderValue >= 8 ? <ThumbsUp className="w-5 h-5" /> : 
                   sliderValue >= 5 ? <span>•</span> : 
                   <ThumbsDown className="w-5 h-5" />}
                </motion.div>
              </div>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  const isSubmitDisabled = 
    isLoading || 
    (question.type === 'text' && textResponse.trim() === '') ||
    (question.type === 'multiple-choice' && selectedOption === null);

  return (
    <motion.div
      initial={embedded ? { opacity: 1 } : "hidden"}
      animate={embedded ? { opacity: 1 } : "visible"}
      exit={embedded ? { opacity: 0 } : "exit"}
      variants={embedded ? {} : containerVariants}
      className={`w-full ${embedded ? '' : 'bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-gray-100'} relative`}
      style={embedded ? {} : { transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {/* Floating decorative elements */}
      {!embedded && (
        <>
          <motion.div 
            className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-gradient-to-br from-amber-200/40 to-amber-400/40 blur-md"
            variants={floatingIconVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div 
            className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-200/40 to-teal-400/40 blur-md"
            variants={floatingIconVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 1 }}
          />
        </>
      )}
      
      {!embedded && (
        <div className={`bg-gradient-to-r ${
          isProfileQuestion 
            ? 'from-indigo-500 to-purple-600' 
            : 'from-emerald-500 to-teal-600'
        } px-6 py-4 text-white relative overflow-hidden`}>
          <motion.div variants={itemVariants} className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold flex items-center">
                <span className="bg-white/20 p-2 rounded-full mr-3">
                  {getCategoryIcon()}
                </span>
                {isProfileQuestion ? 'Profil Personnel' : 'Analyse Éducative'}
              </h2>
              <p className="text-sm opacity-90 mt-1">
                {isProfileQuestion 
                  ? 'Aidez-nous à personnaliser votre évaluation' 
                  : 'Vos réponses nous aident à trouver le meilleur parcours pour vous'}
              </p>
            </div>
            
            {(questionNumber > 0 && totalQuestions > 0) && (
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="text-sm font-semibold">{questionNumber}/{totalQuestions}</span>
              </div>
            )}
          </motion.div>
          
          {/* Decorative elements */}
          <div className="absolute -right-20 -bottom-20">
            <div className="w-40 h-40 rounded-full bg-white opacity-10"></div>
          </div>
          <div className="absolute -left-20 top-1/2">
            <div className="w-32 h-32 rounded-full bg-white opacity-10"></div>
          </div>

          {/* Floating particles */}
          <div className="absolute top-4 right-40 w-2 h-2 rounded-full bg-white/40 animate-pulse"></div>
          <div className="absolute top-10 right-20 w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse delay-300"></div>
          <div className="absolute bottom-6 right-32 w-2 h-2 rounded-full bg-white/30 animate-pulse delay-700"></div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        <motion.div 
          variants={embedded ? {} : itemVariants} 
          className="mb-10 relative"
          initial={embedded ? { opacity: 1 } : undefined}
          animate={embedded ? { opacity: 1 } : undefined}
        >
          <div className="flex justify-between">
            <h3 className={`${embedded ? 'text-2xl' : 'text-xl'} font-medium text-gray-800 tracking-tight mb-2`}>
              {question.text}
            </h3>
            
            {question.hint && (
              <button 
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="flex-shrink-0 text-gray-400 hover:text-emerald-500 transition-colors focus:outline-none"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Type indicator badge */}
          <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-3">
            {getQuestionTypeIcon()}
            <span className="ml-1.5">{
              question.type === 'text' ? 'Question ouverte' : 
              question.type === 'multiple-choice' ? 'Choix multiple' : 
              'Évaluation'
            }</span>
          </div>
          
          <AnimatePresence>
            {showHint && question.hint && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mt-3 bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 relative overflow-hidden"
              >
                <div className="flex items-start">
                  <Sparkles className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                  <p>{question.hint}</p>
                </div>
                
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-12 h-12">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-blue-100 rounded-bl-xl"></div>
                  <div className="absolute top-1 right-1 w-4 h-4 text-blue-400">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {renderQuestionInput()}
        </motion.div>
        
        <motion.div 
          variants={embedded ? {} : itemVariants} 
          className="flex justify-between items-center"
          initial={embedded ? { opacity: 1 } : undefined}
          animate={embedded ? { opacity: 1 } : undefined}
        >
          <div className="flex-grow">
            {question.type === 'text' && (
              <p className="text-xs text-gray-500">
                Soyez aussi précis que possible pour de meilleurs résultats
              </p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <motion.button
              type="submit"
              disabled={isSubmitDisabled}
              className={`relative px-6 py-3 rounded-xl font-medium flex items-center justify-center transition-all group overflow-hidden
                ${isProfileQuestion 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg'
                }
                ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Shine effect on hover */}
              <div className="absolute top-0 -left-[100px] w-20 h-full bg-white/20 transform -skew-x-30 group-hover:animate-shine pointer-events-none"></div>
              
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-5 w-5 mr-3 border-2 border-b-transparent border-white rounded-full"></div>
                  <span>Traitement...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2">Continuer</span>
                  <div className="relative w-5">
                    <ArrowRight className="w-5 h-5 absolute top-0 left-0 transition-transform group-hover:translate-x-1 group-hover:opacity-0" />
                    <ArrowRight className="w-5 h-5 absolute top-0 left-0 transition-transform translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                </div>
              )}
            </motion.button>
          </div>
        </motion.div>
      </form>

      {/* Bottom decorative wave */}
      {!embedded && (
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-300 to-teal-500 opacity-30"></div>
      )}
    </motion.div>
  );
};

export default QuestionCard;