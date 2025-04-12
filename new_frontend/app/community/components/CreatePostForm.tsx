'use client'

import { useState, FormEvent } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useCommunityStore } from '../store/communityStore'
import Image from 'next/image'
import { MessageCircle, Lightbulb, Share, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CreatePostForm() {
  const { user } = useAuth()
  const { addPost } = useCommunityStore()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState<'question' | 'knowledge' | 'discussion' | 'opportunity'>('discussion')
  const [expanded, setExpanded] = useState(false)
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      return
    }
    
    if (!user) {
      alert('Vous devez être connecté pour poster.')
      return
    }
    
    // Add the post (text only)
    addPost({
      userId: user.id,
      userName: user.name,
      userAvatar: user.profilePicture || '/placeholder-user.jpg',
      title,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      category,
    })
    
    // Reset the form
    setTitle('')
    setContent('')
    setTags('')
    setCategory('discussion')
    setExpanded(false)
  }
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {!expanded ? (
        <div 
          className="p-4 cursor-pointer flex items-center"
          onClick={() => setExpanded(true)}
        >
          <div className="h-10 w-10 rounded-full overflow-hidden mr-4 flex-shrink-0">
            <Image 
              src={user?.profilePicture || '/placeholder-user.jpg'} 
              alt="Profile" 
              width={40} 
              height={40} 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="bg-gray-100 rounded-full px-5 py-3 text-gray-500 w-full hover:bg-gray-200 transition-colors">
            Partager quelque chose avec la communauté...
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6 flex items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-4 flex-shrink-0">
              <Image 
                src={user?.profilePicture || '/placeholder-user.jpg'} 
                alt="Profile" 
                width={40} 
                height={40} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{user?.name || 'Utilisateur'}</p>
            </div>
          </div>
          
          {/* Category selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <button 
              type="button"
              className={`flex items-center justify-center p-3 rounded-lg ${
                category === 'question' 
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              } transition-colors`}
              onClick={() => setCategory('question')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              <span>Question</span>
            </button>
            
            <button 
              type="button"
              className={`flex items-center justify-center p-3 rounded-lg ${
                category === 'knowledge' 
                  ? 'bg-amber-100 text-amber-700 border-2 border-amber-300' 
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              } transition-colors`}
              onClick={() => setCategory('knowledge')}
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              <span>Savoir</span>
            </button>
            
            <button 
              type="button"
              className={`flex items-center justify-center p-3 rounded-lg ${
                category === 'discussion' 
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' 
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              } transition-colors`}
              onClick={() => setCategory('discussion')}
            >
              <Share className="w-5 h-5 mr-2" />
              <span>Discussion</span>
            </button>
            
            <button 
              type="button"
              className={`flex items-center justify-center p-3 rounded-lg ${
                category === 'opportunity' 
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300' 
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              } transition-colors`}
              onClick={() => setCategory('opportunity')}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              <span>Opportunité</span>
            </button>
          </div>
          
          {/* Title input */}
          <input
            type="text"
            placeholder="Titre de votre publication"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          {/* Content textarea */}
          <textarea
            placeholder="Partagez votre question, connaissance ou expérience..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          
          {/* Tags input */}
          <input
            type="text"
            placeholder="Tags séparés par des virgules (ex: université, orientation, informatique)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
            >
              Publier
            </button>
          </div>
        </form>
      )}
    </motion.div>
  )
}