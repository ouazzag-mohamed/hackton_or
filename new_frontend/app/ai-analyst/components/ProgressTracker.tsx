'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, BarChart3, Zap, Star } from 'lucide-react';

interface ProgressTrackerProps {
  current: number;
  total: number;
}

export default function ProgressTracker({ current, total }: ProgressTrackerProps) {
  const percentage = Math.min(100, Math.round((current / total) * 100));
  
  const determineProgress = () => {
    if (percentage < 25) return 'starting';
    if (percentage < 50) return 'quarter';
    if (percentage < 75) return 'halfway';
    if (percentage < 100) return 'almostDone';
    return 'completed';
  };
  
  const progressStatus = determineProgress();
  
  const progressMessages = {
    starting: "C'est parti ! Nous commençons à recueillir vos préférences.",
    quarter: "Bon début ! Continuez sur cette lancée.",
    halfway: "À mi-chemin ! Vos réponses forgent déjà un profil intéressant.",
    almostDone: "Presque terminé ! Vos réponses sont précieuses pour l'analyse finale.",
    completed: "Félicitations ! Analyse complète."
  };
  
  const progressEmojis = {
    starting: "🚀",
    quarter: "👍",
    halfway: "💪",
    almostDone: "🎯",
    completed: "🏆"
  };
  
  // Calculate the estimated time remaining
  const estimatedTimeRemaining = Math.ceil((total - current) * 0.5); // 30 seconds per question
  
  return (
    <motion.div
      className="w-full max-w-3xl bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-6 border border-gray-100"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-lg shadow-sm">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Progression</span>
            <h3 className="text-2xl font-bold text-gray-800">{percentage}%</h3>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg">
            <Zap className="w-4 h-4" />
            <span>{current}/{total} questions</span>
          </div>
          
          <div className="flex sm:hidden items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-700">
            <span className="text-sm font-semibold">{current}</span>
          </div>
        </div>
      </div>
      
      <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:20px_100%] animate-[shimmer_2s_infinite]"></div>
        </div>
        
        <motion.div 
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="h-full w-20 bg-white/30 transform -skew-x-30 animate-shimmer"></div>
          </div>
          
          {/* Tiny particles following the progress */}
          <div className="absolute top-0 right-0 h-full flex items-center">
            {percentage > 0 && percentage < 100 && (
              <motion.div
                className="w-3 h-3 rounded-full bg-white shadow-sm transform -translate-x-1/2"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            )}
          </div>
        </motion.div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <motion.div 
          className="max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={progressStatus}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <span className="mr-2 text-lg">{progressEmojis[progressStatus as keyof typeof progressEmojis]}</span>
            <p className="text-sm text-gray-700 font-medium">
              {progressMessages[progressStatus as keyof typeof progressMessages]}
            </p>
          </div>
        </motion.div>
        
        {current < total && (
          <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            <Clock className="w-3 h-3 mr-1 inline" />
            <span>
              {estimatedTimeRemaining <= 1 
                ? "Moins d'une minute" 
                : `~${estimatedTimeRemaining} min`
              }
            </span>
          </div>
        )}
        
        {current === total && (
          <motion.div 
            className="flex items-center text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12 }}
          >
            <CheckCircle className="w-3 h-3 mr-1 inline" />
            <span>Complété</span>
          </motion.div>
        )}
      </div>
      
      <div className="mt-5 flex justify-between">
        {Array.from({ length: 5 }).map((_, index) => {
          const stepPercentage = (index + 1) * 20;
          const isCompleted = percentage >= stepPercentage;
          const isCurrent = percentage < stepPercentage && percentage >= stepPercentage - 20;
          
          return (
            <motion.div 
              key={index} 
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className={`relative w-6 h-6 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md' : 
                  isCurrent ? 'bg-white border-2 border-emerald-500 shadow-sm' : 
                  'bg-gray-200'
                }`}
              >
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, delay: 0.2 }}
                  >
                    <CheckCircle className="w-3 h-3 text-white" />
                  </motion.div>
                )}
                {isCurrent && (
                  <motion.div 
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                )}
              </div>
              <span className={`text-xs mt-1 ${
                isCompleted ? 'text-emerald-600 font-medium' : 
                isCurrent ? 'text-gray-600 font-medium' :
                'text-gray-500'
              }`}>
                {stepPercentage}%
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}