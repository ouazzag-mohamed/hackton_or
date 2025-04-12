'use client';

import { useState } from 'react';
import { generateQuestion, analyzeResponse, generateReport } from '../utils/aiService';
import { OrientationReport, OrientationScore, Question, UserResponse } from '../store/quizStore';
import { educationTracks } from '../data/moroccoEducationData';

export default function DevTest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Question generation state
  const [generatedQuestion, setGeneratedQuestion] = useState<Question | null>(null);
  const [previousResponses, setPreviousResponses] = useState<UserResponse[]>([]);
  const [questionText, setQuestionText] = useState('');
  
  // Response analysis state
  const [responseToAnalyze, setResponseToAnalyze] = useState('');
  const [analysisQuestion, setAnalysisQuestion] = useState('');
  const [analysisScores, setAnalysisScores] = useState<OrientationScore[]>([]);
  
  // Report generation state
  const [generatedReport, setGeneratedReport] = useState<OrientationReport | null>(null);
  
  // Initialize default scores
  const defaultScores = Object.keys(educationTracks).map(trackId => ({
    trackId,
    trackName: educationTracks[trackId as keyof typeof educationTracks].name,
    score: 0,
    confidence: 0,
  }));
  
  // Generate a test question
  const handleGenerateQuestion = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const question = await generateQuestion(previousResponses, analysisScores);
      setGeneratedQuestion(question);
    } catch (err) {
      setError(`Failed to generate question: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Add a custom test response
  const handleAddResponse = () => {
    if (!questionText.trim()) {
      setError('Please enter a question text');
      return;
    }
    
    const newResponse: UserResponse = {
      questionId: `manual-${Date.now()}`,
      questionText: questionText,
      response: responseToAnalyze,
      timestamp: Date.now(),
    };
    
    setPreviousResponses([...previousResponses, newResponse]);
    setQuestionText('');
    setResponseToAnalyze('');
    setError(null);
  };
  
  // Analyze a response
  const handleAnalyzeResponse = async () => {
    if (!analysisQuestion.trim() || !responseToAnalyze.trim()) {
      setError('Please enter both a question and a response');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const newResponse: UserResponse = {
        questionId: `analysis-${Date.now()}`,
        questionText: analysisQuestion,
        response: responseToAnalyze,
        timestamp: Date.now(),
      };
      
      const updatedScores = await analyzeResponse(
        newResponse,
        analysisScores.length > 0 ? analysisScores : defaultScores,
        [...previousResponses, newResponse]
      );
      
      setAnalysisScores(updatedScores);
    } catch (err) {
      setError(`Failed to analyze response: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Generate a report
  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const report = await generateReport(
        previousResponses,
        analysisScores.length > 0 ? analysisScores : defaultScores
      );
      
      setGeneratedReport(report);
    } catch (err) {
      setError(`Failed to generate report: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main>
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">AI Service Developer Testing</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Question Generation */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Question Generation</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">
              Previous responses: {previousResponses.length}
            </p>
            
            <button
              onClick={handleGenerateQuestion}
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
            >
              {loading ? 'Generating...' : 'Generate Test Question'}
            </button>
          </div>
          
          {generatedQuestion && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium">Generated Question:</h3>
              <p className="mt-2">{generatedQuestion.text}</p>
              <p className="text-sm text-gray-500 mt-1">Type: {generatedQuestion.type}</p>
              
              {generatedQuestion.options && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Options:</p>
                  <ul className="list-disc pl-5">
                    {generatedQuestion.options.map((option, i) => (
                      <li key={i}>{option}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Add Test Response</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Question Text:</label>
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter question text"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Response:</label>
              <textarea
                value={responseToAnalyze}
                onChange={(e) => setResponseToAnalyze(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter response"
                rows={2}
              />
            </div>
            
            <button
              onClick={handleAddResponse}
              className="bg-green-600 text-white py-2 px-4 rounded"
            >
              Add to Previous Responses
            </button>
          </div>
          
          {previousResponses.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Previous Responses:</h3>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
                {previousResponses.map((resp, i) => (
                  <div key={i} className="mb-2 pb-2 border-b border-gray-100">
                    <p className="text-sm font-medium">Q: {resp.questionText}</p>
                    <p className="text-sm">A: {resp.response}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Response Analysis */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Response Analysis</h2>
          
          <div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Question:</label>
              <input
                type="text"
                value={analysisQuestion}
                onChange={(e) => setAnalysisQuestion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter question to analyze"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Response:</label>
              <textarea
                value={responseToAnalyze}
                onChange={(e) => setResponseToAnalyze(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter response to analyze"
                rows={3}
              />
            </div>
            
            <button
              onClick={handleAnalyzeResponse}
              disabled={loading}
              className="bg-purple-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
            >
              {loading ? 'Analyzing...' : 'Analyze Response'}
            </button>
          </div>
          
          {analysisScores.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Track Scores:</h3>
              <div className="max-h-60 overflow-y-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-1 text-left text-xs">Track</th>
                      <th className="p-1 text-right text-xs">Score</th>
                      <th className="p-1 text-right text-xs">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisScores.sort((a, b) => b.score - a.score).map((score, i) => (
                      <tr key={i} className="border-t border-gray-200">
                        <td className="p-1 text-xs">{score.trackName}</td>
                        <td className="p-1 text-right text-xs">{score.score.toFixed(2)}</td>
                        <td className="p-1 text-right text-xs">{(score.confidence * 100).toFixed(0)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Report Generation */}
      <div className="mt-8 border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Report Generation</h2>
          
          <button
            onClick={handleGenerateReport}
            disabled={loading || previousResponses.length === 0}
            className="bg-indigo-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
          >
            {loading ? 'Generating...' : 'Generate Test Report'}
          </button>
        </div>
        
        {generatedReport && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h3 className="font-medium mb-2">Generated Report:</h3>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Primary Track:</p>
                  <p>{generatedReport.primaryTrack}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Secondary Track:</p>
                  <p>{generatedReport.secondaryTrack}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Strengths:</p>
                <ul className="list-disc pl-5 text-sm">
                  {generatedReport.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Areas to Improve:</p>
                <ul className="list-disc pl-5 text-sm">
                  {generatedReport.areasToImprove.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Recommended Programs:</p>
                <p className="text-sm">{generatedReport.recommendedPrograms.join(", ")}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Recommended Universities:</p>
                <p className="text-sm">{generatedReport.recommendedUniversities.join(", ")}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Analysis:</p>
                <p className="text-sm whitespace-pre-line">{generatedReport.analysis}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
    </main>
  );
}