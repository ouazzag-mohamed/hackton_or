'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Server, Zap } from 'lucide-react';

interface AIThinkingAnimationProps {
  message?: string;
  type?: 'question' | 'report';
}

const AIThinkingAnimation: React.FC<AIThinkingAnimationProps> = ({ 
  message = "L'IA analyse vos réponses...",
  type = 'question'
}) => {
  const isQuestionType = type === 'question';
  
  return (
    <div className={`
      w-full h-full absolute inset-0 flex items-center justify-center z-50
      backdrop-blur-sm bg-white/60
      ${isQuestionType ? 'rounded-2xl' : 'rounded-3xl'}
      overflow-hidden
    `}>
      {/* Background animation elements */}
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        {/* Binary code background for report type */}
        {!isQuestionType && (
          <div className="text-xs font-mono text-emerald-800/30 absolute inset-0 select-none overflow-hidden whitespace-nowrap leading-none">
            {Array(40).fill(0).map((_, i) => (
              <div 
                key={i}
                className="overflow-hidden"
                style={{ 
                  animation: `slide ${3 + Math.random() * 4}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                {Array(100).fill(0).map((_, j) => (
                  Math.random() > 0.5 ? '1' : '0'
                )).join('')}
              </div>
            ))}
          </div>
        )}
        
        {/* Neural network lines for question type */}
        {isQuestionType && (
          <div className="absolute inset-0">
            {Array(15).fill(0).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-emerald-400/20 h-0.5 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: 0,
                  right: 0,
                  transformOrigin: 'left',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 1.5 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: 'loop',
                  repeatDelay: Math.random() * 2
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Main animation */}
        <div className="relative mb-8">
          {/* Orbiting particles */}
          <div className="relative">
            {Array(3).fill(0).map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0"
                initial={{ rotate: i * 120 }}
                animate={{ rotate: i * 120 + 360 }}
                transition={{
                  duration: isQuestionType ? 3 : 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <motion.div
                  className={`
                    absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-3 h-3 rounded-full shadow-md
                    ${isQuestionType ? 'bg-emerald-400' : 'bg-indigo-400'}
                  `}
                  style={{ 
                    top: '0%',
                    left: '50%',
                    marginTop: '-30px',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: i * 0.3,
                  }}
                />
              </motion.div>
            ))}
            
            {/* Center icon with pulsing animation */}
            <motion.div 
              className={`
                w-20 h-20 rounded-full shadow-xl flex items-center justify-center
                ${isQuestionType 
                  ? 'bg-gradient-to-br from-emerald-400 to-teal-500' 
                  : 'bg-gradient-to-br from-indigo-400 to-purple-500'
                }
              `}
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 0 0 rgba(52, 211, 153, 0.7)',
                  '0 0 0 10px rgba(52, 211, 153, 0)',
                  '0 0 0 0 rgba(52, 211, 153, 0)'
                ]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: 'loop'
              }}
            >
              {isQuestionType ? (
                <Brain className="w-10 h-10 text-white" />
              ) : (
                <Server className="w-10 h-10 text-white" />
              )}
            </motion.div>
            
            {/* Inner spinning circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className={`w-28 h-28 rounded-full border-2 border-dashed ${
                  isQuestionType ? 'border-emerald-200' : 'border-indigo-200'
                }`}
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: isQuestionType ? 15 : 10, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            </div>
            
            {/* Middle spinning circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className={`w-36 h-36 rounded-full border border-dashed ${
                  isQuestionType ? 'border-emerald-200/70' : 'border-indigo-200/70'
                }`}
                animate={{ rotate: -360 }}
                transition={{ 
                  duration: isQuestionType ? 30 : 20, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            </div>
            
            {/* Outer spinning circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className={`w-44 h-44 rounded-full border border-dashed ${
                  isQuestionType ? 'border-emerald-100/50' : 'border-indigo-100/50'
                }`}
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: isQuestionType ? 45 : 30, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            </div>
          </div>
          
          {/* Random sparkles */}
          {Array(6).fill(0).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'loop',
                delay: i * 0.7,
              }}
            >
              <Sparkles 
                className={`w-4 h-4 ${
                  isQuestionType ? 'text-emerald-300' : 'text-indigo-300'
                }`} 
              />
            </motion.div>
          ))}
        </div>
        
        {/* Loading message */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className={`text-xl font-medium mb-1 ${
            isQuestionType ? 'text-emerald-600' : 'text-indigo-600'
          }`}>
            {message}
          </p>
          
          <div className="flex items-center justify-center mt-2 mb-1">
            <span className={`text-sm ${
              isQuestionType ? 'text-emerald-500' : 'text-indigo-500'
            }`}>
              {isQuestionType ? (
                <>Génération d'une nouvelle question</>
              ) : (
                <>Analyse et synthèse des données</>
              )}
            </span>
            
            {/* Animated dots */}
            <div className="flex items-center ml-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={`w-1.5 h-1.5 mx-0.5 rounded-full ${
                    isQuestionType ? 'bg-emerald-500' : 'bg-indigo-500'
                  }`}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-2">
            <Zap className={`w-4 h-4 mr-1.5 ${
              isQuestionType ? 'text-amber-500' : 'text-blue-500'
            }`} />
            <span className="text-xs text-gray-500">
              {isQuestionType
                ? "Votre réponse est en cours de traitement"
                : "Création de votre rapport personnalisé"
              }
            </span>
          </div>
        </motion.div>
      </div>

      {/* CSS for sliding animation */}
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default AIThinkingAnimation;