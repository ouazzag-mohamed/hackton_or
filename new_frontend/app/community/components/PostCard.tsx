'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useCommunityStore, Post, Comment } from '../store/communityStore'
import { useAuth } from '@/context/AuthContext'
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Share, 
  MoreHorizontal,
  MessageCircle,
  Lightbulb,
  Briefcase
} from 'lucide-react'
import CommentSection from './CommentSection'
import { motion, AnimatePresence } from 'framer-motion'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth()
  const { comments, upvotePost, downvotePost } = useCommunityStore()
  
  const [showComments, setShowComments] = useState(false)
  
  const postComments = comments.filter(comment => comment.postId === post.id)
  
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { 
    addSuffix: true,
    locale: fr 
  })
  
  const voteScore = post.upvotes - post.downvotes
  
  // Get the appropriate category icon and color
  const getCategoryInfo = () => {
    switch(post.category) {
      case 'question':
        return { icon: <MessageCircle className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700' }
      case 'knowledge':
        return { icon: <Lightbulb className="w-4 h-4" />, color: 'bg-amber-100 text-amber-700' }
      case 'opportunity':
        return { icon: <Briefcase className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-700' }
      default:
        return { icon: <MessageSquare className="w-4 h-4" />, color: 'bg-purple-100 text-purple-700' }
    }
  }

  const categoryInfo = getCategoryInfo()
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <div className="p-5">
        {/* Post Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
              <Image 
                src={post.userAvatar} 
                alt={post.userName}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{post.userName}</p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </div>
          
          {post.category && (
            <span className={`px-2.5 py-1 text-xs rounded-full flex items-center ${categoryInfo.color}`}>
              <span className="mr-1">{categoryInfo.icon}</span>
              {post.category === 'question' ? 'Question' : 
               post.category === 'knowledge' ? 'Savoir' : 
               post.category === 'opportunity' ? 'Opportunité' : 'Discussion'}
            </span>
          )}
        </div>
        
        {/* Post Title */}
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        
        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
        </div>
        
  
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 px-2.5 py-1 rounded-full text-xs text-gray-700">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Post Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Vote buttons */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => user && upvotePost(post.id, user.id)}
              className="flex items-center px-2 py-1 hover:bg-gray-100 rounded-md transition-colors"
              disabled={!user}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              <span>{post.upvotes}</span>
            </button>
            
            <button 
              onClick={() => user && downvotePost(post.id, user.id)}
              className="flex items-center px-2 py-1 hover:bg-gray-100 rounded-md transition-colors"
              disabled={!user}
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              <span>{post.downvotes}</span>
            </button>
            
            <div className="text-sm text-gray-600 ml-1">
              {voteScore > 0 ? `+${voteScore}` : voteScore}
            </div>
          </div>
          
          {/* Comment button */}
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center px-3 py-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            <span>{post.commentCount} comments</span>
          </button>
          
          {/* Share button */}
          <button className="flex items-center px-3 py-1 hover:bg-gray-100 rounded-md transition-colors">
            <Share className="w-4 h-4 mr-2" />
            <span>Partager</span>
          </button>
        </div>
      </div>
      
      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CommentSection postId={post.id} comments={postComments} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}