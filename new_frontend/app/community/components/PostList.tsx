'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCommunityStore, getFilteredAndSortedPosts, addDemoContent } from '../store/communityStore'
import PostCard from './PostCard'
import { ArrowUp, ArrowUpDown, Clock, MessageCircle, Lightbulb, Share, Briefcase } from 'lucide-react'

export default function PostList() {
  const { posts, filter, sortBy, setFilter, setSortBy } = useCommunityStore()
  
  // Initialize with demo content if needed
  useEffect(() => {
    addDemoContent()
  }, [])
  
  const filteredSortedPosts = getFilteredAndSortedPosts(posts, filter, sortBy)
  
  // Categories menu
  const categories = [
    { id: 'all', label: 'Tout', icon: null },
    { id: 'questions', label: 'Questions', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'knowledge', label: 'Savoirs', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'discussions', label: 'Discussions', icon: <Share className="w-4 h-4" /> },
    { id: 'opportunities', label: 'Opportunités', icon: <Briefcase className="w-4 h-4" /> },
  ]
  
  // Sort options
  const sortOptions = [
    { id: 'newest', label: 'Plus récents', icon: <Clock className="w-4 h-4" /> },
    { id: 'popular', label: 'Plus populaires', icon: <ArrowUp className="w-4 h-4" /> },
    { id: 'controversial', label: 'Controversés', icon: <ArrowUpDown className="w-4 h-4" /> },
  ]

  return (
    <div>
      {/* Filters and sorting */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          {/* Categories filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  filter === category.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                {category.icon && <span className="mr-1.5">{category.icon}</span>}
                {category.label}
              </button>
            ))}
          </div>
          
          {/* Sort options */}
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  sortBy === option.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                {option.icon && <span className="mr-1.5">{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Posts list */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredSortedPosts.length > 0 ? (
            filteredSortedPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-10 border border-gray-200 text-center">
              <p className="text-gray-500 text-lg">Aucune publication trouvée pour ce filtre.</p>
              <p className="text-gray-400 mt-2">Changez de filtre ou créez une nouvelle publication !</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}