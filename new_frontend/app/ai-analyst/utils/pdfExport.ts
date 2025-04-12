import jsPDF from 'jspdf';
import { OrientationReport, QuestionType } from '../store/quizStore';
import { educationTracks } from '../data/moroccoEducationData';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../translations';

// Add utility function for auto-filling quiz answers during development testing
export const generateAutoAnswer = (questionType: QuestionType, previousAnswers: any[] = [], currentOptions: string[] = []) => {
  // For multiple-choice questions
  if (questionType === 'multiple-choice' && currentOptions?.length > 0) {
    const randomIndex = Math.floor(Math.random() * currentOptions.length);
    return currentOptions[randomIndex];
  }
  
  // For slider questions (1-10)
  if (questionType === 'slider') {
    // If previous answers exist, use them to generate pattern-based responses
    if (previousAnswers && previousAnswers.length > 0) {
      const recentScaleAnswers = previousAnswers
        .filter(a => typeof a === 'number' || !isNaN(parseInt(a)))
        .slice(-3)
        .map(a => typeof a === 'number' ? a : parseInt(a));
      
      if (recentScaleAnswers.length > 0) {
        const avg = recentScaleAnswers.reduce((sum, val) => sum + val, 0) / recentScaleAnswers.length;
        const randomOffset = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newValue = Math.max(1, Math.min(10, Math.round(avg + randomOffset)));
        return newValue;
      }
    }
    return Math.floor(Math.random() * 10) + 1;
  }
  
  // For text inputs
  if (questionType === 'text') {
    const textResponses = [
      "This is an auto-generated response for testing",
      "I am very interested in science and mathematics",
      "I prefer subjects that involve creativity and expression",
      "My favorite subjects are history and languages",
      "I enjoy solving problems and logical reasoning",
      "Technology and computer science are my main interests",
      "I'm interested in economics and business management",
      "I love reading literature and writing essays",
      "Art and design are my passions",
      "I'm curious about physics and engineering"
    ];
    return textResponses[Math.floor(Math.random() * textResponses.length)];
  }
  
  // Default fallback
  return "Auto-generated response";
};

export const exportReportAsPDF = (report: OrientationReport) => {
  try {
    const pdf = new jsPDF();
    
    // Get the current language from the store
    const language = useLanguageStore.getState().language;
    // Get translations for the current language
    const t = (key: string) => {
      const keys = key.split('.');
      let value = translations[language];
      
      for (const k of keys) {
        if (!value) return key;
        value = value[k];
      }
      
      return value || key;
    };
    
    // Sort scores to ensure they're in correct order (highest first)
    const sortedScores = [...(report?.scores || [])].sort((a, b) => b.score - a.score);
    const primaryScore = sortedScores?.[0];
    const secondaryScore = sortedScores?.[1];
    
    // Set up PDF
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(28, 63, 170);
    pdf.text(t('report.title'), 20, 20);
    
    // Add user info
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`${t('general.name')}: ${report.userProfile?.name || 'Student'}`, 20, 40);
    pdf.text(`${t('report.location')}: ${report.userProfile?.location || '-'}`, 20, 48);
    pdf.text(`${t('quiz.profileQuestion.educationLevel')}: ${report.userProfile?.educationLevel || '-'}`, 20, 56);
    pdf.text(`${t('report.date')}: ${new Date().toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-MA' : 'en-US')}`, 20, 64);
    
    // Add horizontal line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, 70, 190, 70);
    
    // Add top tracks
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(28, 63, 170);
    pdf.text(t('report.educationalTrackAlignment'), 20, 85);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    
    let yPosition = 95;
    
    if (sortedScores && sortedScores.length > 0) {
      sortedScores.slice(0, 3).forEach((score, index) => {
        const percentage = (score.score / 10) * 100;
        pdf.setFont("helvetica", "bold");
        pdf.text(`${index + 1}. ${score.trackName}`, 20, yPosition);
        pdf.setFont("helvetica", "normal");
        pdf.text(`${t('report.score')}: ${score.score.toFixed(1)}/10 (${percentage.toFixed(0)}%)`, 20, yPosition + 8);
        
        // Get track info from education data
        const trackInfo = educationTracks[score.trackId as keyof typeof educationTracks];
        if (trackInfo) {
          pdf.text(`${trackInfo.description?.substring(0, 80)}...`, 20, yPosition + 16);
        }
        
        yPosition += 25;
      });
    } else {
      pdf.text(language === 'ar' ? "لا توجد درجات متاحة للمسارات" : language === 'fr' ? "Pas de scores de parcours disponibles" : "No track scores available", 20, yPosition);
      yPosition += 15;
    }
    
    // Add horizontal line
    pdf.line(20, yPosition, 190, yPosition);
    yPosition += 15;
    
    // Add strengths
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(28, 63, 170);
    pdf.text(t('report.strengths'), 20, yPosition);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    
    yPosition += 10;
    if (report.strengths && report.strengths.length > 0) {
      report.strengths.slice(0, 4).forEach((strength, index) => {
        pdf.text(`• ${strength}`, 20, yPosition + (index * 8));
      });
      yPosition += (4 * 8);
    } else {
      pdf.text(language === 'ar' ? "لم يتم تحديد نقاط قوة" : language === 'fr' ? "Aucun point fort identifié" : "No strengths identified", 20, yPosition);
      yPosition += 15;
    }
    
    // Add areas to improve
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(28, 63, 170);
    pdf.text(t('report.areasToImprove'), 20, yPosition);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    
    yPosition += 10;
    if (report.areasToImprove && report.areasToImprove.length > 0) {
      report.areasToImprove.slice(0, 3).forEach((area, index) => {
        pdf.text(`• ${area}`, 20, yPosition + (index * 8));
      });
      yPosition += (3 * 8) + 10;
    } else {
      pdf.text(language === 'ar' ? "لم يتم تحديد مجالات للتحسين" : language === 'fr' ? "Aucun domaine à améliorer n'a été identifié" : "No areas identified", 20, yPosition);
      yPosition += 15;
    }
    
    // Add recommended programs
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(28, 63, 170);
    pdf.text(t('report.recommendedPrograms'), 20, yPosition);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    
    yPosition += 10;
    if (report.recommendedPrograms && report.recommendedPrograms.length > 0) {
      report.recommendedPrograms.slice(0, 5).forEach((program, index) => {
        pdf.text(`• ${program}`, 20, yPosition + (index * 8));
      });
      yPosition += (5 * 8) + 10;
    } else {
      pdf.text(language === 'ar' ? "لا توجد برامج موصى بها متاحة" : language === 'fr' ? "Pas de programmes recommandés disponibles" : "No recommended programs available", 20, yPosition);
      yPosition += 15;
    }
    
    // Add summary of analysis
    if (report.analysis) {
      if (yPosition > 200) {
        // Add a new page if we're running out of space
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(28, 63, 170);
      pdf.text(t('report.personalizedAnalysis'), 20, yPosition);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(80, 80, 80);
      
      yPosition += 10;
      
      // Split analysis into shorter lines for PDF
      const analysisText = report.analysis;
      const maxWidth = 170;
      const lines = pdf.splitTextToSize(analysisText, maxWidth);
      
      // Only include first 15 lines to avoid overflow
      const displayLines = lines.slice(0, 15);
      pdf.text(displayLines, 20, yPosition);
    }
    
    // Add footer
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text("© 2025 " + (language === 'ar' ? "نظام التوجيه التعليمي المغربي" : language === 'fr' ? "Système d'Orientation Éducative Marocain" : "Morocco Educational Orientation System"), 20, 285);
    
    // Save the PDF with a localized filename
    const filename = language === 'ar' ? "تقرير_التوجيه_التعليمي.pdf" : 
                    language === 'fr' ? "rapport_orientation_educative.pdf" : 
                    "educational_orientation_report.pdf";
    pdf.save(filename);
    
    console.log("PDF report generated successfully");
    return true;
  } catch (error) {
    console.error("Error generating PDF report:", error);
    return false;
  }
};