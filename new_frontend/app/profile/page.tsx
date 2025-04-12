'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  School, 
  BookOpen,
  Briefcase, 
  Edit,
  Save,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Camera
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/navbar'

// Avatar options from existing files
const avatarOptions = [
  '/avatars/bolt.png',
  '/avatars/boy.png',
  '/avatars/cat.png',
  '/avatars/dog.png',
  '/avatars/gorilla.png',
  '/avatars/man.png',
  '/avatars/meerkat.png',
  '/avatars/panda.png',
  '/avatars/woman.png'
]

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, logout, updateProfile } = useAuth()
  const router = useRouter()
  
  const [isEditing, setIsEditing] = useState(false)
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    school: '',
    profilePicture: '',
    interests: [] as string[]
  })
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' })
  const [saving, setSaving] = useState(false)
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile')
    }
  }, [isLoading, isAuthenticated, router])
  
  // Set initial profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        school: user.school || '',
        profilePicture: user.profilePicture || '/placeholder-user.jpg',
        interests: user.interests || []
      })
    }
  }, [user])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setProfileData(prev => ({
      ...prev,
      interests: value.split(',').map(item => item.trim()).filter(Boolean)
    }))
  }

  const handleAvatarSelect = (avatar: string) => {
    setProfileData(prev => ({
      ...prev,
      profilePicture: avatar
    }))
    setShowAvatarSelector(false)
  }
  
  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      
      // Basic validation
      if (!profileData.name || profileData.name.length < 2) {
        setNotification({
          type: 'error',
          message: 'Please enter a valid name'
        })
        return
      }
      
      // Update profile
      updateProfile({
        name: profileData.name,
        school: profileData.school,
        profilePicture: profileData.profilePicture,
        interests: profileData.interests
      })
      
      setIsEditing(false)
      setNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      })
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ type: null, message: '' })
      }, 3000)
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to update profile. Please try again.'
      })
    } finally {
      setSaving(false)
    }
  }
  
  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
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
    }
  }

  const avatarSelectorVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }
  
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.div
          className="max-w-3xl mx-auto"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back link */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back to Home</span>
            </Link>
          </motion.div>
          
          {/* Notification */}
          {notification.type && (
            <motion.div 
              className={`mb-6 p-4 rounded-lg flex items-center ${
                notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              )}
              <p>{notification.message}</p>
            </motion.div>
          )}
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 h-40">
              {/* Decorative elements */}
              <div className="absolute right-10 top-5">
                <div className="w-20 h-20 rounded-full bg-white opacity-10"></div>
              </div>
              <div className="absolute left-20 bottom-2">
                <div className="w-12 h-12 rounded-full bg-white opacity-10"></div>
              </div>
              
              {/* Avatar */}
              <div className="absolute -bottom-12 left-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden">
                    <Image
                      src={profileData.profilePicture}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {isEditing && (
                    <button 
                      onClick={() => setShowAvatarSelector(true)}
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md hover:bg-emerald-600 transition-colors"
                      aria-label="Change avatar"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Avatar Selector Modal */}
                <AnimatePresence>
                  {showAvatarSelector && (
                    <motion.div 
                      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowAvatarSelector(false)}
                    >
                      <motion.div
                        className="bg-white rounded-xl shadow-lg p-5 max-w-md w-full"
                        variants={avatarSelectorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={e => e.stopPropagation()}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose an Avatar</h3>
                        
                        <div className="grid grid-cols-3 gap-3">
                          {avatarOptions.map((avatar, index) => (
                            <button
                              key={index}
                              onClick={() => handleAvatarSelect(avatar)}
                              className={`
                                relative rounded-lg overflow-hidden aspect-square border-2
                                hover:border-emerald-500 transition-all
                                ${profileData.profilePicture === avatar ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200'}
                              `}
                            >
                              <Image
                                src={avatar}
                                alt={`Avatar option ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              {profileData.profilePicture === avatar && (
                                <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20">
                                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        
                        <div className="mt-5 flex justify-end">
                          <button
                            onClick={() => setShowAvatarSelector(false)}
                            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Action buttons */}
              <div className="absolute right-6 bottom-6 flex space-x-2">
                <motion.button
                  className={`
                    flex items-center justify-center gap-1 px-4 py-2 rounded-lg text-sm font-medium
                    ${isEditing ? 'bg-gray-100 text-gray-700' : 'bg-white text-emerald-700'}
                    shadow-sm hover:shadow transition-all
                  `}
                  onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={saving}
                >
                  {isEditing ? (
                    <>
                      <ArrowLeft className="w-4 h-4" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </motion.button>
                
                {isEditing && (
                  <motion.button
                    className="flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium shadow-sm hover:bg-emerald-600 hover:shadow transition-all"
                    onClick={handleSaveProfile}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
            
            {/* Profile content */}
            <div className="p-8 pt-16">
              <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-500">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</p>
              </motion.div>
              
              <div className="mt-8 space-y-6">
                {/* Basic Information */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-emerald-500" />
                    <span>Basic Information</span>
                  </h2>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          disabled
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="text-gray-900">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
                
                {/* Education & Interests */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <School className="w-5 h-5 mr-2 text-emerald-500" />
                    <span>Education & Interests</span>
                  </h2>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School / University</label>
                        <input
                          type="text"
                          name="school"
                          value={profileData.school}
                          onChange={handleInputChange}
                          placeholder="Enter your school or university"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                        <input
                          type="text"
                          value={profileData.interests.join(', ')}
                          onChange={handleInterestChange}
                          placeholder="E.g. Technology, Art, Science (comma separated)"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate interests with commas</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <School className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">School / University</p>
                          <p className="text-gray-900">{user?.school || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <BookOpen className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Interests</p>
                          {user?.interests && user.interests.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {user.interests.map((interest, index) => (
                                <span 
                                  key={index} 
                                  className="bg-emerald-50 text-emerald-700 text-sm px-2.5 py-0.5 rounded-full"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-900">No interests specified</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
                
                {/* AI Analysis Results */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-emerald-500" />
                    <span>AI Career Analysis</span>
                  </h2>
                  
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <p className="text-gray-500 mb-3">Take the AI Analyst assessment to discover your ideal career path based on your skills and interests.</p>
                    
                    <Link 
                      href="/ai-analyst" 
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      <span>Take the assessment</span>
                      <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Logout button */}
          <motion.div variants={itemVariants} className="mt-8 flex justify-center">
            <motion.button
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => logout()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}