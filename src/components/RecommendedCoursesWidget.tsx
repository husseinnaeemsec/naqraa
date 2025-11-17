import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/client';
import { endpoints } from '../api/routes';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { BookOpen, Clock, Users } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  cover?: string;
  students_count?: number;
  duration?: string;
  is_free?: boolean;
  slug: string;
}

interface ApiResponse {
  results: Course[];
  count: number;
  next?: string;
  previous?: string;
}

export default function RecommendedCoursesWidget() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        setLoading(true);
        // Fetch featured/recommended courses (limit to 4 for widget)
        const response = await api.get<ApiResponse>(`${endpoints.courses.list}?is_featured=true&limit=4`);
        setCourses(response.data.results);
      } catch (err) {
        console.error('Error fetching recommended courses:', err);
        setError('فشل في تحميل الدورات الموصى بها');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedCourses();
  }, []);

  if (loading) {
    return (
      <Card className="w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">دورات موصى بها</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[240px] flex-shrink-0">
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-emerald-800 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-emerald-800 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-emerald-800 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">دورات موصى بها</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            إعادة المحاولة
          </Button>
        </div>
      </Card>
    );
  }

  if (!courses.length) {
    return (
      <Card className="w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">دورات موصى بها</h2>
        </div>
        <div className="text-center py-8">
          <BookOpen className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">لا توجد دورات موصى بها حالياً</p>
          <Link to="/courses">
            <Button variant="outline" size="sm">
              استكشف جميع الدورات
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">دورات موصى بها</h2>
        </div>
        <Link to="/courses" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
          عرض الكل
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-gray-100 pb-2">
        {courses.map((course, idx) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="min-w-[240px] flex-shrink-0"
          >
            <Card 
              className="h-full bg-gradient-to-b from-white to-emerald-50/30 dark:from-emerald-900 dark:to-emerald-950 border border-emerald-100 dark:border-emerald-800"
              hover={true}
            >
              <div className="p-4 space-y-3">
                {/* Course Image */}
                <div className="relative h-28 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 rounded-lg overflow-hidden">
                  {course.cover ? (
                    <img 
                      src={course.cover} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="size-8 text-emerald-600 dark:text-emerald-300" />
                    </div>
                  )}
                  {course.is_free && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      مجاني
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900 dark:text-emerald-50 line-clamp-2 leading-tight">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
                    {course.students_count && (
                      <div className="flex items-center gap-1">
                        <Users className="size-3" />
                        <span>{course.students_count}</span>
                      </div>
                    )}
                    {course.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="size-3" />
                        <span>{course.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/courses/${course.slug}`}>
                  <Button 
                    size="sm" 
                    className="w-full"
                    gradient={true}
                  >
                    عرض التفاصيل
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
