'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, X, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const { login, register, isAuthenticated } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect)
    }
  }, [isAuthenticated, router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    
    try {
      let success = false
      
      if (isLogin) {
        success = await login(email, password)
        if (success) {
          setSuccess('Login successful!')
          setTimeout(() => router.push(redirect), 1000)
        } else {
          setError('Invalid email or password')
        }
      } else {
        if (!name || name.length < 2) {
          setError('Please enter a valid name')
          setLoading(false)
          return
        }
        
        success = await register(name, email, password)
        if (success) {
          setSuccess('Registration successful!')
          setTimeout(() => router.push(redirect), 1000)
        } else {
          setError('Registration failed. Email may already be registered.')
        }
      }
    } catch (error) {
      setError('An unexpected error occurred')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
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

  const switchVariants = {
    login: { x: 0 },
    register: { x: '100%' }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <div className="fixed top-4 left-4 z-10">
        <Link href="/">
          <Image 
            src="/logo.png" 
            alt="Trchad Logo" 
            width={110} 
            height={45} 
            className="h-10 w-auto" 
            priority
          />
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
          <motion.div 
            className="w-full max-w-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h1>
              <p className="text-gray-600 mb-8">
                {isLogin 
                  ? 'Sign in to access your personalized orientation tools' 
                  : 'Join our platform to access personalized orientation tools'}
              </p>
            </motion.div>

            {/* Login/Register Toggle */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-gray-100 p-1 rounded-lg flex text-sm md:text-base relative">
                <motion.div 
                  className="absolute top-1 bottom-1 left-1 w-[calc(50%-2px)] bg-white rounded-md shadow-sm"
                  animate={isLogin ? 'login' : 'register'}
                  variants={switchVariants}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                ></motion.div>
                <button 
                  className={`flex-1 py-2 px-4 z-10 relative transition-colors rounded-md ${isLogin ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button 
                  className={`flex-1 py-2 px-4 z-10 relative transition-colors rounded-md ${!isLogin ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </button>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form onSubmit={handleSubmit} variants={itemVariants}>
              {/* Error and Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center">
                  <X className="w-5 h-5 mr-2 text-red-500" />
                  <p>{error}</p>
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  <p>{success}</p>
                </div>
              )}

              {/* Name Field - Only for Register */}
              {!isLogin && (
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
              )}
              
              {/* Email Field */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>
              
              {/* Password Field */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all pr-10"
                    required
                    minLength={isLogin ? 1 : 6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                )}
              </div>
              
              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full bg-emerald-500 border-b-4 border-emerald-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Additional Links */}
            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="text-gray-600">
                {isLogin ? (
                  <>
                    Don't have an account?{' '}
                    <button 
                      onClick={() => setIsLogin(false)} 
                      className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                    >
                      Sign up now
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button 
                      onClick={() => setIsLogin(true)} 
                      className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                    >
                      Log in
                    </button>
                  </>
                )}
              </p>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Right Section - Illustration & Features */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-50 to-teal-100 relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots pattern-emerald-500 pattern-bg-white pattern-size-4 pattern-opacity-10"></div>
          
          <div className="absolute w-full h-full flex items-center justify-center">
            {/* Main illustration */}
            <div className="relative max-w-lg w-3/4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Image
                  src="/illustrations.svg"
                  alt="Orientation illustration"
                  width={600}
                  height={500}
                  priority
                  className="w-full h-auto"
                />
              </motion.div>
            </div>
          </div>
          
          {/* Feature highlights */}
          <div className="absolute bottom-8 left-0 right-0 px-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-3 text-emerald-800">
                pourquoi rejoindre la communauté ?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-1.5 rounded-full mr-2 mt-0.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-sm text-gray-700">Accès à notre IA d'analyse d'orientation</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-1.5 rounded-full mr-2 mt-0.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-sm text-gray-700">Opportunités personnalisées</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-1.5 rounded-full mr-2 mt-0.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-sm text-gray-700">Communauté d'entraide</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-1.5 rounded-full mr-2 mt-0.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-sm text-gray-700">Ressources exclusives</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-40 right-20">
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 6,
                ease: "easeInOut" 
              }}
              className="w-32 h-32 rounded-full bg-emerald-200 opacity-40 blur-2xl"
            ></motion.div>
          </div>
          <div className="absolute bottom-40 left-20">
            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 7,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="w-40 h-40 rounded-full bg-teal-300 opacity-30 blur-2xl"
            ></motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}