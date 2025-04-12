'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PostList from './components/PostList'
import CreatePostForm from './components/CreatePostForm'
import { motion } from 'framer-motion'

export default function CommunityPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/community')
    }
  }, [isLoading, isAuthenticated, router])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold">
            <span className="text-black">Communauté</span>
            <span className="text-emerald-500"> Étudiante</span>
          </h1>
          <div className="w-16 h-1 bg-emerald-500 mx-auto mt-3 mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Posez vos questions, partagez vos connaissances et interagissez avec d'autres étudiants.
            Utilisez cet espace pour échanger librement sans jugement.
          </p>
        </motion.div>
        
        {/* Create Post Form */}
        <div className="mb-10">
          <CreatePostForm />
        </div>
        
        {/* Posts List */}
        <div>
          <PostList />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}