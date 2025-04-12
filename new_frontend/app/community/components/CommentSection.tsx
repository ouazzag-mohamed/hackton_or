'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useCommunityStore, Comment } from '../store/communityStore'
import { useAuth } from '@/context/AuthContext'
import { ThumbsUp, ThumbsDown, Flag, Send } from 'lucide-react'

interface CommentSectionProps {
  postId: string
  comments: Comment[]
}

export default function CommentSection({ postId, comments }: CommentSectionProps) {
  const { user } = useAuth()
  const { addComment, upvoteComment, downvoteComment } = useCommunityStore()
  
  const [commentText, setCommentText] = useState('')
  
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentText.trim() || !user) return
    
    addComment({
      postId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.profilePicture || '/placeholder-user.jpg',
      content: commentText,
    })
    
    setCommentText('')
  }

  return (
    <div className="bg-gray-50 p-5 border-t border-gray-200">
      {/* Add new comment */}
      {user && (
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex items-start">
            <div className="h-8 w-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
              <Image 
                src={user.profilePicture || '/placeholder-user.jpg'} 
                alt={user.name}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-grow relative">
              <textarea
                placeholder="Ajouter un commentaire..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[80px] pr-12"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full hover:bg-emerald-600"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      )}
      
      {/* Comments list */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard 
              key={comment.id} 
              comment={comment} 
              onUpvote={() => user && upvoteComment(comment.id, user.id)}
              onDownvote={() => user && downvoteComment(comment.id, user.id)}
            />
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">Aucun commentaire pour le moment.</p>
            <p className="text-gray-400 text-sm mt-1">Soyez le premier à commenter !</p>
          </div>
        )}
      </div>
    </div>
  )
}

interface CommentCardProps {
  comment: Comment
  onUpvote: () => void
  onDownvote: () => void
}

function CommentCard({ comment, onUpvote, onDownvote }: CommentCardProps) {
  const { user } = useAuth()
  
  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { 
    addSuffix: true,
    locale: fr 
  })
  
  const voteScore = comment.upvotes - comment.downvotes

  return (
    <div className="flex">
      <div className="h-8 w-8 rounded-full overflow-hidden mr-3 flex-shrink-0 mt-1">
        <Image 
          src={comment.userAvatar} 
          alt={comment.userName}
          width={32}
          height={32}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-1">
            <span className="font-medium text-sm">{comment.userName}</span>
            <span className="text-xs text-gray-500 ml-2">{formattedDate}</span>
          </div>
          <p className="text-gray-800 text-sm whitespace-pre-line">{comment.content}</p>
        </div>
        
        {/* Comment actions */}
        <div className="flex items-center space-x-4 mt-1 pl-1">
          <button 
            onClick={onUpvote}
            className="flex items-center text-xs text-gray-500 hover:text-emerald-600"
            disabled={!user}
          >
            <ThumbsUp className="w-3 h-3 mr-1" />
            <span>{comment.upvotes}</span>
          </button>
          
          <button 
            onClick={onDownvote}
            className="flex items-center text-xs text-gray-500 hover:text-red-600"
            disabled={!user}
          >
            <ThumbsDown className="w-3 h-3 mr-1" />
            <span>{comment.downvotes}</span>
          </button>
          
          <span className="text-xs text-gray-500">
            {voteScore > 0 ? `+${voteScore}` : voteScore !== 0 ? voteScore : ''}
          </span>
          
          <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center">
            <Flag className="w-3 h-3 mr-1" />
            <span>Signaler</span>
          </button>
        </div>
      </div>
    </div>
  )
}