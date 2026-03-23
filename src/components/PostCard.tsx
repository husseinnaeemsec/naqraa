import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HeroHeartIcon, HeroChatBubbleLeftIcon, HeroEyeIcon, HeroLinkIcon } from './Icons';
import api from '../api/client';
import { endpoints } from '../api/routes';
import type { Post, Community } from '../../types';
import { useAppSelector } from '../store';
import {  InfoAlert } from './alerts';

interface PostCardProps {
  post: Post;
  community: Community;
  onInteraction?: () => void;
}

export default function PostCard({ post, community, onInteraction }: PostCardProps) {
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isLoading, setIsLoading] = useState(false);
  const {isAuthenticated} = useAppSelector((state) => state.auth);

  // Normalize tags to ensure it's always an array
  const normalizedTags = React.useMemo(() => {
    if (!post.tags) return [];
    if (Array.isArray(post.tags)) return post.tags;
    // Handle case where tags might be a string or other format
    if (typeof post.tags === 'string') {
      try {
        const parsed = JSON.parse(post.tags);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [post.tags]);

  // Normalize comments to ensure it's always an array
  const normalizedComments = React.useMemo(() => {
    if (!post.comments) return [];
    if (Array.isArray(post.comments)) return post.comments;
    return [];
  }, [post.comments]);

  const handleLike = async () => {
    if(!isAuthenticated){
        InfoAlert({
            title: t('post_card.login_required_title'),
            text: t('post_card.login_required_text'),
            cancelText: t('post_card.cancel'),
            confirmText: t('post_card.login_button'),
            onConfirm: () => {
                window.location.href = '/login?next=' + window.location.pathname;
            }
            
        })
        return;
    }
    try {

      setIsLoading(true);
      const response = await api.post(
        endpoints.community.postInteract(community.id, post.id),
        { type: 'like' }
      );
      
      setIsLiked(response.data.liked);
      setLikesCount(prev => response.data.liked ? prev + 1 : prev - 1);
      
      if (onInteraction) {
        onInteraction();
      }
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = async () => {
    try {
      await api.post(
        endpoints.community.postInteract(community.id, post.id),
        { type: 'view' }
      );
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return t('post_card.time_just_now');
    } else if (diffInHours < 24) {
      return t('post_card.time_hours_ago', { count: diffInHours });
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return t('post_card.time_days_ago', { count: diffInDays });
    }
  };

  const getPostTypeIcon = () => {
    switch (post.post_type) {
      case 'link':
        return <HeroLinkIcon className="size-4 text-blue-500" />;
      case 'image':
        return <HeroEyeIcon className="size-4 text-green-500" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (post.post_type) {
      case 'text':
        return (
          <div 
            className="prose prose-slate max-w-none text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        );
      
      case 'link':
        return (
          <div className="space-y-3">
            {post.content && (
              <div 
                className="prose prose-slate max-w-none text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-2 mb-2">
                <HeroLinkIcon className="size-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{t('post_card.external_link')}</span>
              </div>
              <a 
                href={post.link_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                onClick={handleView}
              >
                {post.link_url}
              </a>
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="space-y-3">
            {post.image && (
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-auto max-h-96 object-cover"
                  onClick={handleView}
                />
              </div>
            )}
            {post.content && (
              <div 
                className="prose prose-slate max-w-none text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            {post.user?.profile_picture ? (
              <img 
                src={post.user.profile_picture} 
                alt={post.user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                {post.user?.first_name?.[0] || post.user?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {post.user?.first_name && post.user?.last_name 
                  ? `${post.user.first_name} ${post.user.last_name}`
                  : post.user?.username || t('post_card.unknown_user')
                }
              </h4>
              {getPostTypeIcon()}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>
        
        {post.is_pinned && (
          <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full text-xs font-medium">
            {t('post_card.pinned')}
          </div>
        )}
      </div>

      {/* Post Title */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
        {post.title}
      </h3>

      {/* Post Content */}
      <div className="mb-4">
        {renderContent()}
      </div>

      {/* Tags */}
      {normalizedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {normalizedTags.map((tag, index) => (
            <span
              key={tag?.id || tag?.name || `tag-${index}`}
              className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
            >
              #{tag?.name || tag}
            </span>
          ))}
        </div>
      )}

      {/* Topic */}
      {post.topic && (
        <div className="mb-4">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
            {post.topic.name}
          </span>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center gap-2 text-sm transition ${
              isLiked 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <HeroHeartIcon className="size-5" fill={isLiked} />
            <span>{likesCount}</span>
          </button>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <HeroChatBubbleLeftIcon className="size-5" />
            <span>{post.comments_count || 0}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <HeroEyeIcon className="size-5" />
            <span>{post.views_count || 0}</span>
          </div>
        </div>
        
        {post.edited !== post.created_at && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {t('post_card.edited')}
          </span>
        )}
      </div>
      
      {/* Comments Section */}
      {normalizedComments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            {normalizedComments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {comment.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {comment.user?.username || t('post_card.unknown_user')}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <div 
                    className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 text-sm"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
                </div>
              </div>
            ))}
            
            {(post.comments_count || 0) > 3 && (
              <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                {t('post_card.view_all_comments', { count: post.comments_count || 0 })}
              </button>
            )}
          </div>
        </div>
      )}
    </motion.article>
  );
}