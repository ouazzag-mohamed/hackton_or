'use client';

import React, { useState, useEffect, useRef } from 'react';
import { OrientationReport } from '../store/quizStore';
import { exportReportAsPDF } from '../utils/pdfExport';
import { useTranslation } from '../translations/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import AIThinkingAnimation from './AIThinkingAnimation';
import { 
  FileDown, 
  RefreshCw, 
  ChevronRight, 
  BarChart3, 
  BookOpen, 
  Award,
  TrendingUp,
  School,
  GraduationCap,
  Share2,
  ExternalLink,
  MapPin,
  ChevronDown,
  Sparkles,
  Star
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ReportViewProps {
  report: OrientationReport;
  onReset: () => void;
  isLoading?: boolean; // Add isLoading prop to control animation
}

const ReportView: React.FC<ReportViewProps> = ({ report, onReset, isLoading = false }) => {
  const { t } = useTranslation();
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const reportRef = useRef(report);
  
  // If report changes, update our reference to it
  useEffect(() => {
    reportRef.current = report;
    console.log('Report updated:', report);
    console.log('Scores in report:', report?.scores);
  }, [report]);

  const handleExportPDF = () => {
    const success = exportReportAsPDF(report);
    if (success) {
      setToastMessage('Rapport exporté avec succès !');
      setShowToast(true);
    } else {
      setToastMessage('Erreur lors de l\'exportation du rapport.');
      setShowToast(true);
    }
  };

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Ensure scores are defined and valid
  const validScores = report?.scores && Array.isArray(report.scores) && report.scores.length > 0
    ? report.scores
    : [];
  
  // Calculate the total sum of scores for percentage calculations
  const totalScorePoints = validScores.reduce((sum, score) => sum + score.score, 0) || 0;
  
  // Sort scores to ensure they're in correct order (highest first)
  const sortedScores = [...validScores].sort((a, b) => b.score - a.score);
  const primaryScore = sortedScores?.[0] || { score: 0, trackName: '', trackId: '', confidence: 0 };
  const secondaryScore = sortedScores?.[1] || { score: 0, trackName: '', trackId: '', confidence: 0 };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  // Sections data for navigation
  const sections = [
    { id: 'overview', label: t('report.overview'), icon: BarChart3 },
    { id: 'strengths', label: t('report.strengths'), icon: Award },
    { id: 'recommendations', label: t('report.recommendedPrograms'), icon: BookOpen },
    { id: 'schools', label: t('report.schools'), icon: School },
    { id: 'detailed', label: t('report.detailedAnalysis'), icon: TrendingUp }
  ];

  // Get the percentage change between the primary and secondary scores
  const getScoreDifference = () => {
    if (!primaryScore || !secondaryScore || primaryScore.score === 0) return 0;
    const diff = primaryScore.score - secondaryScore.score;
    return Math.round((diff / primaryScore.score) * 100);
  };
  
  const scoreDifference = getScoreDifference();
  
  // Main content
  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Hero section with primary results */}
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl overflow-hidden shadow-lg text-white p-8 relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -mb-20 -ml-20"></div>
              
              <h2 className="text-2xl font-bold mb-4">Votre orientation optimale</h2>
              <div className="text-3xl md:text-4xl font-extrabold mb-2">{report.primaryTrack}</div>
              
              <div className="flex items-end space-x-2 mb-4">
                <div className="text-2xl font-bold">{primaryScore?.score.toFixed(1)}/10</div>
                <div className="text-emerald-200 text-sm">Correspondance {scoreDifference}% supérieure</div>
              </div>
              
              <div className="h-2 bg-white/20 rounded-full mb-2 overflow-hidden">
                <div 
                  className="h-full bg-white" 
                  style={{ width: `${(primaryScore?.score / 10) * 100}%` }}
                ></div>
              </div>
              
              <div className="text-sm text-emerald-100 mt-4">
                Cette voie correspond parfaitement à vos compétences et intérêts
              </div>
            </motion.div>
            
            {/* Secondary track card */}
            <motion.div 
              variants={itemVariants}
              className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-indigo-700">ALTERNATIVE RECOMMANDÉE</h3>
                  <p className="text-xl font-bold text-gray-800 mt-1">{report.secondaryTrack}</p>
                </div>
                <div className="bg-indigo-100 text-indigo-800 font-bold rounded-full h-12 w-12 flex items-center justify-center">
                  {secondaryScore?.score.toFixed(1)}
                </div>
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600" 
                  style={{ width: `${(secondaryScore?.score / 10) * 100 || 0}%` }}
                ></div>
              </div>
            </motion.div>
            
            {/* Strengths preview */}
            <motion.div variants={itemVariants} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Award className="h-5 w-5 text-amber-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Vos points forts</h3>
              </div>
              <div className="space-y-3">
                {report?.strengths?.slice(0, 3).map((strength, index) => (
                  <div key={index} className="flex">
                    <Star className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{strength}</p>
                  </div>
                ))}
                <Link href="#" onClick={() => setActiveSection('strengths')} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
                  Voir tous les points forts
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
            
            {/* Mini brief analysis section */}
            <motion.div variants={itemVariants} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-5 w-5 text-emerald-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Résumé de l'analyse</h3>
              </div>
              <p className="text-gray-700">
                {report?.analysis?.split('.').slice(0, 2).join('. ') + '.'}
              </p>
              <Link href="#" onClick={() => setActiveSection('detailed')} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center mt-4">
                Lire l'analyse complète
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
            
            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleExportPDF}
                className="px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all flex items-center shadow-sm"
              >
                <FileDown className="w-5 h-5 mr-2" />
                Télécharger le rapport complet
              </button>
              
              <button
                onClick={onReset}
                className="px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-all flex items-center"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Recommencer l'évaluation
              </button>
            </motion.div>
          </motion.div>
        );
        
      case 'strengths':
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <Award className="h-6 w-6 text-amber-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Vos points forts</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2 mb-2">
                  <p className="text-gray-700">
                    Basé sur vos réponses, nous avons identifié ces forces clés qui vous distinguent:
                  </p>
                </div>
                
                {report?.strengths?.map((strength, index) => (
                  <div key={index} className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <div className="flex">
                      <Star className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-800 font-medium">{strength}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {report?.areasToImprove && report.areasToImprove.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Domaines à développer</h3>
                  <div className="space-y-3">
                    {report.areasToImprove.map((area, index) => (
                      <div key={index} className="flex">
                        <TrendingUp className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">{area}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        );
        
      case 'recommendations':
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <BookOpen className="h-6 w-6 text-emerald-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Programmes recommandés</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4 mb-8">
                {report?.recommendedPrograms?.map((program, index) => (
                  <div key={index} className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <GraduationCap className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                      <span className="font-medium text-gray-800">{program}</span>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        index < 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {index < 3 ? 'Très adapté' : 'Recommandé'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {report?.recommendedUniversities && report.recommendedUniversities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Universités suggérées</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {report.recommendedUniversities.map((university, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <p className="font-medium text-gray-800">{university}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        );
        
      case 'schools':
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-6">
                <School className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Établissements recommandés</h2>
              </div>
              
              {report?.schoolRecommendations && report.schoolRecommendations.length > 0 ? (
                <div className="space-y-6">
                  {report.schoolRecommendations.map((school, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 border-b flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-800">{school.name}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            {school.location} 
                            {school.distance && <span className="ml-1">• {school.distance}</span>}
                          </div>
                        </div>
                        <div className="bg-blue-500 text-white font-bold rounded-full h-14 w-14 flex items-center justify-center flex-shrink-0">
                          {school.matchScore}%
                        </div>
                      </div>
                      
                      <div className="p-5">
                        {/* Programs */}
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Programmes pertinents</h4>
                          <div className="flex flex-wrap gap-2">
                            {school.programs.map((program, i) => (
                              <span key={i} className="inline-block bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs">
                                {program}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Strengths */}
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Points forts de l'établissement</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {school.strengths.map((strength, i) => (
                              <li key={i} className="text-sm text-gray-600">{strength}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Admission Requirements */}
                        {school.admissionRequirements && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Conditions d'admission</h4>
                            <p className="text-sm text-gray-600">{school.admissionRequirements}</p>
                          </div>
                        )}
                        
                        {/* Website */}
                        {school.website && (
                          <div className="mt-4">
                            <a 
                              href={school.website} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              Visiter le site web
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun établissement spécifique n'a été recommandé pour votre profil.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        );
        
      case 'detailed':
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Detailed Analysis */}
            <motion.div variants={itemVariants} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-6 w-6 text-emerald-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Analyse détaillée</h2>
              </div>
              
              {/* Analysis Text */}
              <div className="bg-gray-50 p-5 rounded-lg mb-6">
                <p className="text-gray-700 whitespace-pre-line">{report?.analysis}</p>
              </div>
              
              {/* Statistical Analysis */}
              {report?.statisticalAnalysis && (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Analyse statistique</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">Intervalle de confiance</h4>
                      <p className="text-lg font-semibold">{report.statisticalAnalysis.confidenceInterval}</p>
                    </div>
                    
                    {report.statisticalAnalysis.primaryPercentile && (
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-purple-800 mb-1">Percentile (voie principale)</h4>
                        <p className="text-lg font-semibold">{report.statisticalAnalysis.primaryPercentile}%</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Track Distribution */}
                  {report.statisticalAnalysis.trackDistribution && report.statisticalAnalysis.trackDistribution.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Distribution des voies</h4>
                      <div className="h-8 flex rounded-md overflow-hidden mb-3">
                        {report.statisticalAnalysis.trackDistribution.map((track, index) => (
                          <div 
                            key={index}
                            className={`h-full ${
                              index === 0 ? 'bg-emerald-500' : 
                              index === 1 ? 'bg-blue-500' : 
                              index === 2 ? 'bg-purple-500' : 
                              index === 3 ? 'bg-amber-500' : 
                              'bg-gray-500'
                            }`}
                            style={{ width: `${track.percentage}%` }}
                            title={`${track.trackName}: ${track.percentage}%`}
                          ></div>
                        ))}
                      </div>
                      
                      <div className="text-sm flex flex-wrap gap-x-4 gap-y-2">
                        {report.statisticalAnalysis.trackDistribution.map((track, index) => (
                          <div key={index} className="flex items-center">
                            <div 
                              className={`w-3 h-3 mr-1 rounded-sm ${
                                index === 0 ? 'bg-emerald-500' : 
                                index === 1 ? 'bg-blue-500' : 
                                index === 2 ? 'bg-purple-500' : 
                                index === 3 ? 'bg-amber-500' : 
                                'bg-gray-500'
                              }`}
                            ></div>
                            <span>{track.trackName}: {track.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Key Insights */}
                  {report.statisticalAnalysis.keyInsights && report.statisticalAnalysis.keyInsights.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Insights clés</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {report.statisticalAnalysis.keyInsights.map((insight, index) => (
                          <li key={index} className="text-gray-700">{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </motion.div>
            
            {/* All Scores Distribution */}
            <motion.div variants={itemVariants} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Scores de toutes les voies</h3>
              <div className="space-y-4">
                {sortedScores?.map((score, index) => (
                  <div key={index} className="relative">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{score.trackName}</span>
                      <span className="text-sm font-medium">{score.score.toFixed(1)}/10</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          index === 0 ? 'bg-emerald-500' : 
                          index === 1 ? 'bg-blue-500' : 
                          'bg-gray-400'
                        }`}
                        style={{ width: `${(score.score / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );
        
      default:
        return <div>Section non trouvée</div>;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Debug scores display (only during development) */}
      <div className="mb-4 p-4 bg-slate-800 text-white rounded-lg text-sm font-mono">
        <h4 className="font-bold mb-2">Debug Scores:</h4>
        <pre>
          {JSON.stringify(report?.scores || 'No scores available', null, 2)}
        </pre>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            className="fixed top-24 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 relative">
        {/* Show AIThinkingAnimation when loading the report */}
        {isLoading && (
          <div className="absolute inset-0 z-50">
            <AIThinkingAnimation 
              message="L'IA génère votre rapport personnalisé..." 
              type="report" 
            />
          </div>
        )}
        
        {/* Report Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 text-white relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold">Rapport d'Orientation Éducative</h1>
              <p className="text-emerald-50 mt-1 max-w-xl">
                Voici votre rapport personnalisé basé sur vos réponses à l'évaluation
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportPDF}
                className="bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
              >
                <FileDown className="w-4 h-4 mr-2" />
                PDF
              </button>
              <button
                onClick={onReset}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors border border-emerald-400"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recommencer
              </button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-14 -bottom-14">
            <div className="w-48 h-48 rounded-full bg-white opacity-10"></div>
          </div>
          <div className="absolute left-1/4 -top-10">
            <div className="w-24 h-24 rounded-full bg-white opacity-10"></div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="px-6 overflow-x-auto">
            <div className="flex space-x-2 min-w-max py-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center whitespace-nowrap ${
                    activeSection === section.id 
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <section.icon className="w-4 h-4 mr-2" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Report Content */}
        <div className="p-6">
          {/* Score data debug information */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">Score Information:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-blue-600">Primary Track:</h4>
                <p className="text-gray-700">
                  {primaryScore.trackName || 'Not available'} - 
                  {primaryScore.score ? primaryScore.score.toFixed(1) : 'N/A'}/10
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-600">Secondary Track:</h4>
                <p className="text-gray-700">
                  {secondaryScore.trackName || 'Not available'} - 
                  {secondaryScore.score ? secondaryScore.score.toFixed(1) : 'N/A'}/10
                </p>
              </div>
            </div>
            
            <h4 className="text-sm font-semibold text-blue-600 mt-4 mb-2">All Scores:</h4>
            <div className="space-y-2">
              {sortedScores.map((score, index) => (
                <div key={index} className="flex justify-between">
                  <span>{score.trackName}</span>
                  <span className="font-medium">{score.score.toFixed(1)}/10</span>
                </div>
              ))}
              {sortedScores.length === 0 && (
                <p className="text-red-500">No scores available</p>
              )}
            </div>
          </div>
          
          {renderMainContent()}
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center mt-6 text-gray-500 text-sm">
        <p>© 2025 IRCHAD - Orientation Program. Créé par Inalgora Team.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link href="/" className="text-emerald-600 hover:text-emerald-700">
            Page d'accueil
          </Link>
          <span>•</span>
          <Link href="#" onClick={onReset} className="text-emerald-600 hover:text-emerald-700">
            Nouvelle évaluation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportView;