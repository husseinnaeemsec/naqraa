import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react"; // أيقونة تحميل (اختيارية)
import { endpoints } from "../../../api/routes";
import api from "../../../api/client";
import { useParams } from "react-router-dom";
import type { Post } from "../../../../types";



export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const {communityId} = useParams()

  // تحميل أول دفعة من المنشورات
  useEffect(() => {
    fetchPosts(1);
  }, []);

  const fetchPosts = async (pageNumber: number) => {
    if(!communityId) return
    try {
      const res = await api.get(`${endpoints.community.posts(Number(communityId))}?page=${pageNumber}`);
      const data = res.data;

      if (pageNumber === 1) {
        setPosts(data.results);
      } else {
        setPosts((prev) => [...prev, ...data.results]);
      }

      // التحقق إذا في صفحة تالية
      setHasMore(!!data.next);
      setPage(pageNumber + 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };


  return (
    <div className="max-w-5xl mx-auto mt-6">
      <InfiniteScroll
        dataLength={posts.length}
        next={() => fetchPosts(page)}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-gray-500" />
          </div>
        }
        endMessage={
          <p className="text-center text-gray-400 py-4">
            لا توجد منشورات أخرى 🎉
          </p>
        }
      >
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 mb-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div>
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleString("ar-IQ")}
                </p>
              </div>
            </div>

            <p className="text-gray-800 dark:text-gray-100 mb-2">{post.content}</p>

          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
