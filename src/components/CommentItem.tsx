import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroReplyIcon, HeroChatBubbleLeftIcon, HeroHeartIcon } from './Icons';
import api from '../api/client';
import { endpoints } from '../api/routes';
import { useAppSelector } from '../store';
import type { Comment, Community, Post } from '../../types';

interface CommentItemProps {
  comment: Comment;
  post: Post;
  community: Community;
  depth?: number;
  onReply?: (comment: Comment) => void;
}

export default function CommentItem({ 
  comment, 
  post, 
  community, 
  depth = 0, 
  onReply 
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked] = useState(false);
  const [likesCount] = useState(0);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const maxDepth = 5; // Maximum nesting depth

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'منذ قليل';
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `منذ ${diffInDays} يوم`;
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyContent.trim() || !isAuthenticated) return;

    try {
      setIsSubmitting(true);

      const response = await api.post(
        endpoints.community.createComment(community.id),
        {
          content: replyContent.trim(),
          parent: comment.id
        }
      );

      // Call parent callback if provided
      if (onReply) {
        onReply(response.data);
      }

      // Reset form
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error creating reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canReply = () => {
    if (!isAuthenticated || !community.user_membership) return false;
    return community.user_membership.can_comment && 
           community.user_membership.status === 'active' &&
           depth < maxDepth;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-4'} relative`}
    >
      {/* Depth indicator line */}
      {depth > 0 && (
        <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
      )}
      
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        {/* Comment Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {comment.user.username.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 dark:text-white text-sm">
                {comment.user.username}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(comment.created_at)}
              </span>
              {comment.edited_at && comment.edited_at !== comment.created_at && (
                <span className="text-xs text-gray-400 dark:text-gray-500">(محرر)</span>
              )}
            </div>
            
            {/* Comment Content */}
            <div 
              className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
            
            {/* Comment Actions */}
            <div className="flex items-center gap-4 mt-3">
              {/* Like Button */}
              <button
                onClick={() => {/* Handle like */}}
                className={`flex items-center gap-1 text-xs hover:text-emerald-600 transition ${
                  isLiked ? 'text-emerald-600' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <HeroHeartIcon className={`size-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </button>
              
              {/* Reply Button */}
              {canReply() && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 transition"
                >
                  <HeroReplyIcon className="size-4" />
                  <span>رد</span>
                </button>
              )}
              
              {/* Reply count if has replies */}
              {comment.replies && comment.replies.length > 0 && (
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <HeroChatBubbleLeftIcon className="size-4" />
                  <span>{comment.replies.length} رد</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Reply Form */}
        <AnimatePresence>
          {showReplyForm && canReply() && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleReplySubmit}
              className="mt-4 space-y-3"
            >
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`الرد على ${comment.user.username}...`}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white text-sm"
                rows={3}
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!replyContent.trim() || isSubmitting}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرد'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  إلغاء
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              post={post}
              community={community}
              depth={depth + 1}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}