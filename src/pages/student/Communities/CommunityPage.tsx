import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { endpoints } from "../../../api/routes";
import api from "../../../api/client";
import { useAppSelector } from "../../../store";
import PostCard from "../../../components/PostCard";
import CreatePost from "../../../components/CreatePost";
import { HeroErrorIcon, HeroPlusIcon, HeroUsersIcon, HeroMenuIcon, HeroXIcon } from "../../../components/Icons";
import type { Post, Community } from "../../../../types";

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [community, setCommunity] = useState<Community | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { communityId } = useParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Load community details
  useEffect(() => {
    if (communityId) {
      fetchCommunity();
    }
  }, [communityId]);

  // Load posts when community is loaded
  useEffect(() => {
    if (community) {
      fetchPosts(1);
    }
  }, [community]);

  const fetchCommunity = async () => {
    if (!communityId) return;
    
    try {
      setLoading(true);
      const response = await api.get(endpoints.community.detail(Number(communityId)));
      setCommunity(response.data);
    } catch (err: any) {
      console.error("Error fetching community:", err);
      setError("حدث خطأ في تحميل بيانات المجتمع");
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (pageNumber: number) => {
    if (!communityId) return;
    
    try {
      const res = await api.get(`${endpoints.community.posts(Number(communityId))}?page=${pageNumber}`);
      const data = res.data;

      if (pageNumber === 1) {
        setPosts(data.results || data);
      } else {
        setPosts((prev) => [...prev, ...(data.results || data)]);
      }

      // Check if there's a next page
      setHasMore(!!data.next);
      setPage(pageNumber + 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleJoinCommunity = async () => {
    if (!communityId || !isAuthenticated) return;
    
    try {
      await api.post(endpoints.community.join(Number(communityId)));
      // Refresh community data to show updated membership status
      fetchCommunity();
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreatePost(false);
  };

  const canUserPost = () => {
    if (!isAuthenticated || !community?.user_membership) return false;
    return community.user_membership.can_post && 
           community.user_membership.status === 'active';
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin size-8 text-emerald-600" />
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          {error || "لم يتم العثور على المجتمع"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile Top Navigation */}
      <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {community?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-sm">
                {community?.name}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {community?.members_count} عضو
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {canUserPost() && (
              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition"
                title="إنشاء منشور"
              >
                <HeroPlusIcon className="size-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {mobileMenuOpen ? (
                <HeroXIcon className="size-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <HeroMenuIcon className="size-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950"
            >
              <div className="p-4 space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-lg text-center">
                    <p className="text-lg font-bold text-emerald-600">{community?.posts_count}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">منشور</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-lg text-center">
                    <p className="text-lg font-bold text-emerald-600">{community?.members_count}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">عضو</p>
                  </div>
                </div>
                
                {/* Join Button for Mobile */}
                {isAuthenticated && !community?.user_membership && (
                  <button
                    onClick={() => {
                      handleJoinCommunity();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-medium"
                  >
                    انضم للمجتمع
                  </button>
                )}
                
                {/* Quick Actions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">إجراءات سريعة</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2 bg-white dark:bg-gray-900 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                      المنشورات المثبتة
                    </button>
                    <button className="p-2 bg-white dark:bg-gray-900 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                      العلامات الشائعة
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4 lg:space-y-6">
          {/* Warning component */}
          <div className="p-3 sticky top-20 z-10   rounded-md bg-amber-50 border border-amber-500 my-4 text-amber-900">
            <h4 className="font-medium text-2xl mb-1 flex items-center gap-2">
              <HeroErrorIcon className="size-6" />
            تنبيه مهم  
            </h4>
            <p>
              هذه الصفحة غير مكتملة حاليًا وقد تكون هناك بعض الميزات المفقودة أو الأخطاء. نحن نعمل على تحسينها باستمرار لضمان أفضل تجربة للمستخدمين.
            </p>
          </div>
        {/* Desktop Community Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {community.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl text-sm lg:text-base">
                {community.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <HeroUsersIcon className="size-4" />
                  <span>{community.members_count} عضو</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{community.posts_count} منشور</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  community.visibility === 'public' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {community.visibility === 'public' ? 'مجتمع عام' : 'مجتمع خاص'}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              {isAuthenticated && !community.user_membership && (
                <button
                  onClick={handleJoinCommunity}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium whitespace-nowrap"
                >
                  انضم للمجتمع
                </button>
              )}
              
              {/* Desktop Create Post Button */}
              {canUserPost() && (
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
                >
                  <HeroPlusIcon className="size-4" />
                  إنشاء منشور
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Create Post Form */}
        <AnimatePresence>
          {showCreatePost && canUserPost() && (
            <CreatePost
              community={community}
              onPostCreated={handlePostCreated}
              onCancel={() => setShowCreatePost(false)}
            />
          )}
        </AnimatePresence>

        {/* Posts List */}
        <div>
          {posts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                لا توجد منشورات بعد
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                لا توجد منشورات في هذا المجتمع حتى الآن
              </p>
              {canUserPost() && (
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
                >
                  كن أول من ينشر!
                </button>
              )}
            </motion.div>
          ) : (
            <InfiniteScroll
              dataLength={posts.length}
              next={() => fetchPosts(page)}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center py-6">
                  <Loader2 className="animate-spin text-emerald-600" />
                </div>
              }
              endMessage={
                <p className="text-center text-gray-400 py-4">
                  لا توجد منشورات أخرى 🎉
                </p>
              }
              className="space-y-6"
            >
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  community={community}
                  onInteraction={() => {
                    // Optional: Refresh posts or update counts
                  }}
                />
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>

        {/* Sidebar - Hidden on Mobile */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
        {/* Community Info Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm sticky top-20"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">معلومات المجتمع</h3>
          
          {/* Owner Info */}
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-400 mb-2">مؤسس المجتمع</h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                {community.owner.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{community.owner.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">منذ {formatDate(community.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">إجمالي الأعضاء</span>
              <span className="font-medium text-gray-900 dark:text-white">{community.members_count}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">إجمالي المنشورات</span>
              <span className="font-medium text-gray-900 dark:text-white">{community.posts_count}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">تاريخ الإنشاء</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatDate(community.created_at)}</span>
            </div>
          </div>

          {/* Community Rules */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">قواعد المجتمع</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• احترام جميع الأعضاء</li>
              <li>• منشورات ذات جودة عالية فقط</li>
              <li>• لا للمحتوى المسيء أو المضلل</li>
              <li>• استخدام العلامات المناسبة</li>
            </ul>
          </div>
        </motion.div>

        {/* Pinned Posts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">المنشورات المثبتة</h3>
          
          {posts.filter(post => post.is_pinned).length > 0 ? (
            <div className="space-y-3">
              {posts.filter(post => post.is_pinned).slice(0, 3).map((post) => (
                <div key={post.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{post.likes_count} إعجاب</span>
                    <span>•</span>
                    <span>{post.comments_count} تعليق</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">لا توجد منشورات مثبتة</p>
          )}
        </motion.div>

        {/* Popular Tags */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">العلامات الشائعة</h3>
          
          <div className="flex flex-wrap gap-2">
            {['برمجة', 'تصميم', 'تطوير ويب', 'ذكي اصطناعي', 'موبايل'].map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}