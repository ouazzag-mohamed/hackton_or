'use client';

import React from 'react';
import { useQuizStore } from '../store/quizStore';
import AutoFillButton from './AutoFillButton';
import QuestionCard from './QuestionCard';
import AIThinkingAnimation from './AIThinkingAnimation';

const Quiz = () => {
  const { 
    currentQuestion, 
    responses,
    isLoading,
    error,
    inProfilePhase,
    answerQuestion
  } = useQuizStore();
  
  const handleAnswerSubmit = (answer: string | number) => {
    if (!currentQuestion) return;
    answerQuestion(answer);
  };

  // Extract just the response values for the AutoFillButton
  const previousAnswers = responses.map(response => response.response);
  
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="quiz-container p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 relative">
        {/* Show AIThinkingAnimation when loading a new question */}
        {isLoading && (
          <AIThinkingAnimation 
            message="L'IA analyse votre réponse..." 
            type="question" 
          />
        )}
        
        {/* Use the QuestionCard component */}
        <QuestionCard
          question={currentQuestion}
          onSubmit={handleAnswerSubmit}
          isLoading={isLoading}
          isProfileQuestion={inProfilePhase}
        />
      </div>
      
      {/* Always display the AutoFillButton, removed the environment check */}
      <AutoFillButton
        questionType={currentQuestion.type}
        previousAnswers={previousAnswers}
        options={currentQuestion.options}
        onSelectAnswer={handleAnswerSubmit}
      />
    </div>
  );
};

export default Quiz;
