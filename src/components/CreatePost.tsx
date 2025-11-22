import { useState } from 'react';

import { motion } from 'framer-motion';
import RichTextEditor from '../components/RichTextEditor';
import { HeroPenSquareIcon, HeroLinkIcon, HeroPhotoIcon, HeroXIcon } from '../components/Icons';
import api, { getCookie } from '../api/client';
import { endpoints } from '../api/routes';
import type { Community, Post } from '../../types';

interface CreatePostProps {
  community: Community;
  onPostCreated?: (post: Post) => void;
  onCancel?: () => void;
}

type PostType = 'text' | 'link' | 'image';

export default function CreatePost({ community, onPostCreated, onCancel }: CreatePostProps) {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('text');
  const [linkUrl, setLinkUrl] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string>('');
  const [topicId, setTopicId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('عنوان المنشور مطلوب');
      return;
    }

    if (postType === 'text' && !content.trim()) {
      setError('محتوى المنشور مطلوب');
      return;
    }

    if (postType === 'link' && !linkUrl.trim()) {
      setError('رابط المنشور مطلوب');
      return;
    }

    if (postType === 'image' && !image) {
      setError('صورة المنشور مطلوبة');
      return;
    }

    if (postType === 'image' && image && !(image instanceof File)) {
      setError('ملف الصورة غير صالح، يرجى اختيار صورة أخرى');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content);
      formData.append('post_type', postType);
      
      if (postType === 'link' && linkUrl.trim()) {
        formData.append('link_url', linkUrl.trim());
      }
      
      if (postType === 'image' && image) {
        // Ensure we're sending a proper File object
        if (image instanceof File) {
          // Additional validation - ensure file has content
          if (image.size === 0) {
            setError('الملف فارغ، يرجى اختيار صورة صالحة');
            return;
          }
          formData.append('image', image, image.name);
        } else {
          setError('ملف الصورة غير صالح، يرجى اختيار صورة أخرى');
          return;
        }
      }
      
      if (tags.trim()) {
        const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        formData.append('tags', JSON.stringify(tagList));
      }
      
      if (topicId) {
        formData.append('topic_id', topicId.toString());
      }



      // Use fetch instead of axios for better FormData support
      const response = await api.post(
        endpoints.community.createPost(community.id),
        formData,
        {
          withCredentials:true,
          headers: {
            // Get CSRF token for Django
            'X-CSRFToken': getCookie('csrftoken') || '',
          },
        }
      );
      
      if (!response.data) {
        const errorData = await response.data.response;
        throw new Error(JSON.stringify(errorData));
      }
      
      const responseData = response.data;
      if (onPostCreated) {
        onPostCreated(responseData);
      }
      
      // Reset form
      setTitle('');
      setContent('');
      setPostType('text');
      setLinkUrl('');
      setImage(null);
      setTags('');
      setTopicId(null);
      
    } catch (err: any) {
      console.error('Error creating post:', err);
      try {
        const errorData = JSON.parse(err.message);
        setError(errorData.detail || errorData.image?.[0] || 'حدث خطأ في إنشاء المنشور');
      } catch {
        setError('حدث خطأ في إنشاء المنشور');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('يرجى اختيار ملف صورة صالح');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }
      
      // Validate that it's actually a File object
      if (!(file instanceof File)) {
        setError('حدث خطأ في تحديد الملف، يرجى المحاولة مرة أخرى');
        return;
      }
      
      setImage(file);
      setError(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          إنشاء منشور جديد في {community.name}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <HeroXIcon className="size-6" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Post Type Selector */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPostType('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              postType === 'text'
                ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
            }`}
          >
            <HeroPenSquareIcon className="size-4" />
            نص
          </button>
          <button
            type="button"
            onClick={() => setPostType('link')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              postType === 'link'
                ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
            }`}
          >
            <HeroLinkIcon className="size-4" />
            رابط
          </button>
          <button
            type="button"
            onClick={() => setPostType('image')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              postType === 'image'
                ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
            }`}
          >
            <HeroPhotoIcon className="size-4" />
            صورة
          </button>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            عنوان المنشور *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="أدخل عنواناً واضحاً ومفيداً لمنشورك"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition"
            required
          />
        </div>

        {/* Content based on post type */}
        {postType === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              محتوى المنشور *
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="شارك أفكارك، خبراتك، أو أي معلومات مفيدة مع المجتمع..."
              height={250}
            />
          </div>
        )}

        {postType === 'link' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                رابط المنشور *
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                وصف الرابط
              </label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="اكتب وصفاً مختصراً عن هذا الرابط وفائدته..."
                height={150}
              />
            </div>
          </div>
        )}

        {postType === 'image' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اختر صورة *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition"
                required
                key={image ? 'file-selected' : 'file-empty'} // Force re-render to clear input if needed
              />
              {image && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  تم اختيار: {image.name} ({(image.size / 1024 / 1024).toFixed(2)} ميجابايت)
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                وصف الصورة
              </label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="اكتب وصفاً أو تعليقاً على هذه الصورة..."
                height={150}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الكلمات المفتاحية
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="مثال: برمجة، تطوير ويب، جافاسكريبت (افصل بفاصلة)"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            أضف كلمات مفتاحية مفصولة بفاصلة لتسهيل العثور على منشورك
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'جاري النشر...' : 'نشر المنشور'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}