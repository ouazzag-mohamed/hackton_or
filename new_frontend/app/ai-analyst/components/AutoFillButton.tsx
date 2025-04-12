import React from 'react';
import { generateAutoAnswer } from '../utils/pdfExport';
import { QuestionType } from '../store/quizStore';

interface AutoFillButtonProps {
  questionType: QuestionType;
  previousAnswers: Array<string | number>;
  options?: string[];
  onSelectAnswer: (answer: string | number) => void;
  className?: string;
}

const AutoFillButton: React.FC<AutoFillButtonProps> = ({ 
  questionType, 
  previousAnswers, 
  options = [],
  onSelectAnswer,
  className = '' 
}) => {
  const handleAutoFill = () => {
    const autoAnswer = generateAutoAnswer(questionType, previousAnswers, options);
    if (autoAnswer !== null) {
      onSelectAnswer(autoAnswer);
      console.log('Auto-filled answer:', autoAnswer);
    }
  };
  
  return (
    <button
      type="button"
      onClick={handleAutoFill}
      className={`fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-4 rounded-xl text-lg font-bold 
        shadow-lg hover:from-purple-700 hover:to-pink-600 transition z-50 ${className} animate-pulse`}
      style={{ 
        opacity: 1,
        border: '3px solid yellow',
        boxShadow: '0 0 15px rgba(255, 255, 0, 0.7)'
      }}
    >
      🚀 AUTO-FILL 🚀
    </button>
  );
};

export default AutoFillButton;
