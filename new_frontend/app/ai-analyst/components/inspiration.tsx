'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Loader2,
  BarChart3,
  Brain,
  Briefcase,
  GraduationCap,
  ScrollText
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/navbar'

// Career assessment questions
const questions = [
  {
    id: 'q1',
    question: 'Comment préfères-tu résoudre des problèmes ?',
    options: [
      { id: 'q1-a', text: 'En analysant logiquement les faits', value: 'analytical' },
      { id: 'q1-b', text: 'En cherchant des solutions créatives', value: 'creative' },
      { id: 'q1-c', text: 'En discutant avec d\'autres personnes', value: 'social' },
      { id: 'q1-d', text: 'En suivant des méthodes éprouvées', value: 'practical' }
    ]
  },
  {
    id: 'q2',
    question: 'Dans un projet de groupe, quel rôle adoptes-tu naturellement ?',
    options: [
      { id: 'q2-a', text: 'Leader qui organise et délègue', value: 'leadership' },
      { id: 'q2-b', text: 'Chercheur d\'idées et d\'innovations', value: 'innovative' },
      { id: 'q2-c', text: 'Médiateur qui facilite la communication', value: 'communication' },
      { id: 'q2-d', text: 'Expert technique qui résout les problèmes', value: 'technical' }
    ]
  },
  {
    id: 'q3',
    question: 'Qu\'est-ce qui te motive le plus dans un travail ?',
    options: [
      { id: 'q3-a', text: 'La possibilité d\'aider les autres', value: 'helping' },
      { id: 'q3-b', text: 'La stabilité et la sécurité', value: 'stability' },
      { id: 'q3-c', text: 'Le développement de nouvelles compétences', value: 'growth' },
      { id: 'q3-d', text: 'La liberté et l\'indépendance', value: 'independence' }
    ]
  },
  {
    id: 'q4',
    question: 'Quel environnement de travail préfères-tu ?',
    options: [
      { id: 'q4-a', text: 'Structuré avec des règles claires', value: 'structured' },
      { id: 'q4-b', text: 'Dynamique et en constante évolution', value: 'dynamic' },
      { id: 'q4-c', text: 'Collaboratif avec beaucoup d\'interactions', value: 'collaborative' },
      { id: 'q4-d', text: 'Autonome avec peu de supervision', value: 'autonomous' }
    ]
  },
  {
    id: 'q5',
    question: 'Quelle matière t\'intéresse le plus à l\'école ?',
    options: [
      { id: 'q5-a', text: 'Sciences (physique, chimie, biologie)', value: 'science' },
      { id: 'q5-b', text: 'Arts (littérature, musique, dessin)', value: 'arts' },
      { id: 'q5-c', text: 'Sciences sociales (histoire, économie)', value: 'social_science' },
      { id: 'q5-d', text: 'Technologie et informatique', value: 'technology' }
    ]
  },
  {
    id: 'q6',
    question: 'Comment gères-tu le stress ?',
    options: [
      { id: 'q6-a', text: 'En planifiant et en m\'organisant mieux', value: 'planning' },
      { id: 'q6-b', text: 'En pratiquant des activités créatives', value: 'creative_outlet' },
      { id: 'q6-c', text: 'En parlant à des amis ou à un mentor', value: 'social_support' },
      { id: 'q6-d', text: 'En me concentrant sur des actions concrètes', value: 'action_oriented' }
    ]
  },
  {
    id: 'q7',
    question: 'Quelle compétence voudrais-tu le plus développer ?',
    options: [
      { id: 'q7-a', text: 'Compétences techniques et spécialisées', value: 'technical_skills' },
      { id: 'q7-b', text: 'Créativité et innovation', value: 'creative_skills' },
      { id: 'q7-c', text: 'Communication et travail d\'équipe', value: 'social_skills' },
      { id: 'q7-d', text: 'Leadership et gestion', value: 'leadership_skills' }
    ]
  },
  {
    id: 'q8',
    question: 'Quelle est ta plus grande force ?',
    options: [
      { id: 'q8-a', text: 'La précision et l\'attention aux détails', value: 'detail_oriented' },
      { id: 'q8-b', text: 'L\'adaptabilité et la flexibilité', value: 'adaptable' },
      { id: 'q8-c', text: 'L\'empathie et la compréhension des autres', value: 'empathetic' },
      { id: 'q8-d', text: 'La résolution de problèmes complexes', value: 'problem_solver' }
    ]
  }
]

// Career profiles based on assessment results
const careerProfiles = {
  technical: {
    title: 'Profil Technique & Scientifique',
    description: 'Tu possèdes un esprit analytique et méthodique, avec une affinité naturelle pour résoudre des problèmes complexes. Les carrières techniques ou scientifiques te correspondent parfaitement.',
    careers: [
      'Ingénieur en informatique',
      'Data scientist',
      'Chercheur scientifique',
      'Architecte logiciel',
      'Ingénieur en robotique'
    ],
    educationPaths: [
      'École d\'ingénieur',
      'Faculté des sciences',
      'Masters spécialisés en informatique',
      'Doctorat en sciences'
    ],
    icon: Brain
  },
  creative: {
    title: 'Profil Créatif & Innovant',
    description: 'Ta pensée est innovante et tu excelles dans la génération d\'idées originales. Les environnements qui valorisent la créativité et l\'expression personnelle te permettront de t\'épanouir.',
    careers: [
      'Designer UX/UI',
      'Architecte',
      'Marketing digital',
      'Développeur de jeux vidéo',
      'Content creator'
    ],
    educationPaths: [
      'École d\'art et design',
      'Formation en communication visuelle',
      'École de cinéma et médias',
      'Cursus en innovation & entrepreneuriat'
    ],
    icon: ScrollText
  },
  social: {
    title: 'Profil Social & Communicant',
    description: 'Tu as un talent naturel pour comprendre et interagir avec les autres. Les carrières centrées sur les relations humaines et la communication sont idéales pour toi.',
    careers: [
      'Responsable RH',
      'Enseignant',
      'Conseiller d\'orientation',
      'Community manager',
      'Travailleur social'
    ],
    educationPaths: [
      'Sciences humaines et sociales',
      'École de communication',
      'Formation en ressources humaines',
      'Sciences de l\'éducation'
    ],
    icon: GraduationCap
  },
  business: {
    title: 'Profil Business & Leadership',
    description: 'Tu démontres d\'excellentes capacités de leadership et d\'organisation. Les carrières qui te permettent de prendre des décisions et de diriger des équipes te correspondent parfaitement.',
    careers: [
      'Entrepreneur',
      'Chef de projet',
      'Consultant en stratégie',
      'Analyste financier',
      'Directeur commercial'
    ],
    educationPaths: [
      'École de commerce',
      'Masters en management',
      'Formation en gestion de projet',
      'MBA'
    ],
    icon: Briefcase
  }
}

export default function AIAnalystPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [profileResult, setProfileResult] = useState<string | null>(null)
  const [processingResults, setProcessingResults] = useState(false)
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/ai-analyst')
    }
  }, [isLoading, isAuthenticated, router])
  
  const handleAnswerSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
    
    // Auto advance to next question
    if (currentStep < questions.length) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 400)
    }
  }
  
  const handleSubmitAnswers = () => {
    setProcessingResults(true)
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Count values to determine profile
      const valueCount: Record<string, number> = {}
      
      Object.values(answers).forEach(value => {
        if (valueCount[value]) {
          valueCount[value]++
        } else {
          valueCount[value] = 1
        }
      })
      
      // Categorize based on predominant traits
      const technicalValues = [
        'analytical', 'technical', 'structured', 'science', 'planning', 
        'technical_skills', 'detail_oriented', 'problem_solver'
      ]
      
      const creativeValues = [
        'creative', 'innovative', 'dynamic', 'arts', 'creative_outlet',
        'creative_skills', 'adaptable'
      ]
      
      const socialValues = [
        'social', 'communication', 'helping', 'collaborative', 
        'social_science', 'social_support', 'social_skills', 'empathetic'
      ]
      
      const businessValues = [
        'leadership', 'stability', 'growth', 'independence', 'autonomous',
        'technology', 'action_oriented', 'leadership_skills'
      ]
      
      // Calculate profile scores
      const scores = {
        technical: 0,
        creative: 0,
        social: 0,
        business: 0
      }
      
      Object.entries(answers).forEach(([_, value]) => {
        if (technicalValues.includes(value)) scores.technical++
        if (creativeValues.includes(value)) scores.creative++
        if (socialValues.includes(value)) scores.social++
        if (businessValues.includes(value)) scores.business++
      })
      
      // Find highest score
      const result = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      setProfileResult(result)
      setProcessingResults(false)
      
    }, 2000)
  }
  
  const resetAnalysis = () => {
    setAnswers({})
    setCurrentStep(0)
    setProfileResult(null)
  }
  
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
  }
  
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
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return null // Will redirect via useEffect
  }
  
  const currentQuestion = questions[currentStep]
  const progress = currentStep / questions.length * 100
  
  const getResultProfile = () => {
    if (!profileResult) return null
    return careerProfiles[profileResult as keyof typeof careerProfiles]
  }
  
  const profile = getResultProfile()
  const ProfileIcon = profile?.icon || BarChart3
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <Link 
              href="/" 
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back to Home</span>
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              AI Analyste d'Orientation
            </h1>
            <p className="text-gray-600 mt-2">
              Découvre ton profil professionnel et les carrières qui te correspondent le mieux grâce à notre analyse intelligente.
            </p>
          </div>
          
          {/* Assessment content */}
          <AnimatePresence mode="wait">
            {!profileResult ? (
              /* Assessment questions */
              <motion.div
                key="assessment"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Progress bar */}
                <div className="relative h-2 bg-gray-100">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </div>
                
                <div className="p-8">
                  {currentStep < questions.length ? (
                    /* Question */
                    <motion.div
                      key={`question-${currentStep}`}
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <motion.div variants={itemVariants} className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                          Question {currentStep + 1} sur {questions.length}
                        </h2>
                        <p className="text-lg text-gray-800">{currentQuestion.question}</p>
                      </motion.div>
                      
                      <div className="space-y-3">
                        {currentQuestion.options.map((option) => (
                          <motion.div 
                            key={option.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <button
                              type="button"
                              onClick={() => handleAnswerSelect(currentQuestion.id, option.value)}
                              className={`
                                w-full text-left p-4 rounded-lg border transition-all
                                ${answers[currentQuestion.id] === option.value
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                                  : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50'
                                }
                              `}
                            >
                              <div className="flex items-center">
                                <div className={`
                                  w-5 h-5 rounded-full mr-3 flex-shrink-0 flex items-center justify-center
                                  ${answers[currentQuestion.id] === option.value
                                    ? 'bg-emerald-500'
                                    : 'border-2 border-gray-300'
                                  }
                                `}>
                                  {answers[currentQuestion.id] === option.value && (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <span>{option.text}</span>
                              </div>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Navigation */}
                      <motion.div variants={itemVariants} className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                          disabled={currentStep === 0}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            currentStep === 0
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          Question précédente
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setCurrentStep(Math.min(questions.length, currentStep + 1))}
                          disabled={!answers[currentQuestion.id]}
                          className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                            !answers[currentQuestion.id]
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          <span>Question suivante</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    /* Summary and submit */
                    <motion.div
                      key="summary"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex flex-col items-center"
                    >
                      <motion.div variants={itemVariants}>
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                          Analyse prête à être calculée
                        </h2>
                        <p className="text-gray-600 text-center mb-8 max-w-md mx-auto">
                          Nous avons collecté toutes les informations nécessaires pour analyser ton profil d'orientation. Notre IA va maintenant calculer tes résultats.
                        </p>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="w-full max-w-md">
                        <button
                          type="button"
                          onClick={handleSubmitAnswers}
                          disabled={processingResults}
                          className="w-full py-3 px-4 bg-emerald-500 border-b-4 border-emerald-600 text-white rounded-lg font-medium flex items-center justify-center disabled:opacity-70"
                        >
                          {processingResults ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin mr-2" />
                              <span>Analyse en cours...</span>
                            </>
                          ) : (
                            <>
                              <span>Calculer mes résultats</span>
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Results page */
              <motion.div
                key="results"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Results header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 py-8 px-8 text-white relative overflow-hidden">
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center mb-2">
                      <ProfileIcon className="w-7 h-7 mr-3" />
                      <h2 className="text-2xl font-bold">{profile?.title}</h2>
                    </div>
                    <p className="max-w-2xl">{profile?.description}</p>
                  </motion.div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -right-8 -bottom-12">
                    <div className="w-40 h-40 rounded-full bg-white opacity-10"></div>
                  </div>
                  <div className="absolute left-40 -top-8">
                    <div className="w-24 h-24 rounded-full bg-white opacity-10"></div>
                  </div>
                </div>
                
                <div className="p-8">
                  {/* Career suggestions */}
                  <motion.div variants={itemVariants} className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-emerald-500" />
                      <span>Carrières recommandées</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {profile?.careers.map((career, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          <span className="text-gray-800">{career}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Education paths */}
                  <motion.div variants={itemVariants}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-emerald-500" />
                      <span>Parcours éducatifs recommandés</span>
                    </h3>
                    
                    <div className="space-y-2">
                      {profile?.educationPaths.map((path, index) => (
                        <div key={index} className="flex items-center py-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3"></div>
                          <span className="text-gray-800">{path}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Next steps */}
                  <motion.div variants={itemVariants} className="mt-10 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Prochaines étapes</h3>
                    <p className="text-gray-700 mb-4">
                      Ton analyse est maintenant complète! Pour approfondir ces résultats, nous te recommandons de:
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Explorer les formations spécifiques dans les domaines recommandés</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Rechercher des stages ou des opportunités d'observation dans ces secteurs</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Mettre à jour ton profil avec ces nouvelles informations</span>
                      </li>
                    </ul>
                    
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/profile"
                        className="px-5 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                      >
                        Mettre à jour mon profil
                      </Link>
                      
                      <button
                        type="button"
                        onClick={resetAnalysis}
                        className="px-5 py-2 border border-emerald-500 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
                      >
                        Refaire l'analyse
                      </button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}