import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { endpoints } from '../api/routes';
import Card from './ui/Card';
import Button from './ui/Button';
import { FileText, Video, Link as LinkIcon, Download, Eye, Lightbulb } from 'lucide-react';
import useApiErrorHandler from '../hooks/use-api-error-handler';

interface Resource {
  id: number;
  title: string;
  description?: string;
  file_type: 'pdf' | 'video' | 'document' | 'link' | 'image';
  file_url?: string;
  external_url?: string;
  thumbnail?: string;
  size?: string;
  downloads_count?: number;
  category?: {
    id: number;
    name: string;
  };
  uploaded_by?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

interface ResourcesResponse {
  results: Resource[];
  count: number;
}

const resourceIcons = {
  pdf: FileText,
  video: Video,
  document: FileText,
  link: LinkIcon,
  image: Eye
};

const resourceColors = {
  pdf: "bg-red-500 text-white",
  video: "bg-blue-500 text-white", 
  document: "bg-gray-600 text-white",
  link: "bg-emerald-500 text-white",
  image: "bg-purple-500 text-white"
};

const resourceLabels = {
  pdf: "PDF",
  video: "فيديو",
  document: "مستند",
  link: "رابط",
  image: "صورة"
};

export default function UsefulResourcesWidget() {
  useApiErrorHandler();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedResources = async () => {
      try {
        setLoading(true);
        // Fetch recommended/featured resources (limit to 6 for widget)
        const response = await api.get<ResourcesResponse>(`${endpoints.resources}?featured=true&limit=6`);
        setResources(response.data.results);
      } catch (err: any) {
        console.error('Error fetching recommended resources:', err);
        
        // Fallback to mock data if endpoint doesn't exist yet
        if (err.response?.status === 404) {
          setResources([
            {
              id: 1,
              title: "ورقة مفاهيم الجبر المتقدم",
              description: "شرح مفصل لمفاهيم الجبر مع أمثلة تطبيقية",
              file_type: "pdf",
              created_at: new Date().toISOString(),
              downloads_count: 150
            },
            {
              id: 2,
              title: "فيديو درس الكيمياء العضوية",
              description: "شرح تفاعلات الكيمياء العضوية",
              file_type: "video",
              created_at: new Date().toISOString(),
              downloads_count: 89
            },
            {
              id: 3,
              title: "ملخص قواعد اللغة العربية",
              description: "ملخص شامل لقواعد النحو والصرف",
              file_type: "document",
              created_at: new Date().toISOString(),
              downloads_count: 203
            },
            {
              id: 4,
              title: "تمارين الرياضيات المحلولة",
              description: "مجموعة من التمارين مع الحلول التفصيلية",
              file_type: "pdf",
              created_at: new Date().toISOString(),
              downloads_count: 127
            },
            {
              id: 5,
              title: "موقع تعلم اللغة الإنجليزية",
              description: "منصة تفاعلية لتعلم اللغة الإنجليزية",
              file_type: "link",
              external_url: "https://example.com",
              created_at: new Date().toISOString(),
              downloads_count: 76
            },
            {
              id: 6,
              title: "شرح الفيزياء النووية", 
              description: "مقدمة في الفيزياء النووية والإشعاع",
              file_type: "video",
              created_at: new Date().toISOString(),
              downloads_count: 94
            }
          ]);
        } else {
          setError('فشل في تحميل المصادر المقترحة');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedResources();
  }, []);

  const handleResourceClick = (resource: Resource) => {
    if (resource.file_type === 'link' && resource.external_url) {
      window.open(resource.external_url, '_blank');
    } else if (resource.file_url) {
      window.open(resource.file_url, '_blank');
    }
  };

  if (loading) {
    return (
      <Card variant="dashboard" className="w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">مصادر مقترحة</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
          مصادر مقترحة لك بناء على نشاطك التعليمي الأخير
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 dark:bg-emerald-800 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-emerald-800 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-emerald-800 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error && resources.length === 0) {
    return (
      <Card variant="dashboard" className="w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">مصادر مقترحة</h2>
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

  if (!resources.length) {
    return (
      <Card variant="dashboard" className="w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">مصادر مقترحة</h2>
        </div>
        <div className="text-center py-8">
          <Lightbulb className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">لا توجد مصادر مقترحة حالياً</p>
          <Link to="/resources">
            <Button variant="primary" size="sm">
              تصفح جميع المصادر
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="dashboard" className="w-full p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Lightbulb className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">مصادر مقترحة</h2>
        </div>
        <Link to="/resources" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
          عرض الكل
        </Link>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
        مصادر مقترحة لك بناء على نشاطك التعليمي الأخير
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {resources.map((resource, idx) => {
          const IconComponent = resourceIcons[resource.file_type] || FileText;
          
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card 
                variant="default" 
                className="h-full p-4 cursor-pointer bg-gradient-to-b from-white to-gray-50/30 dark:from-emerald-900/30 dark:to-emerald-950/50 border border-gray-200 dark:border-emerald-800"
                hover={true}
                onClick={() => handleResourceClick(resource)}
              >
                <div className="space-y-3">
                  {/* Resource Icon & Type */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${resourceColors[resource.file_type]}`}>
                        <IconComponent className="size-4" />
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${resourceColors[resource.file_type]}`}>
                        {resourceLabels[resource.file_type]}
                      </span>
                    </div>
                    
                    {resource.downloads_count && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Download className="size-3" />
                        <span>{resource.downloads_count}</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 dark:text-emerald-50 line-clamp-2 leading-tight text-sm">
                      {resource.title}
                    </h3>
                    {resource.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                        {resource.description}
                      </p>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    {resource.category && (
                      <span>{resource.category.name}</span>
                    )}
                    {resource.size && (
                      <span>{resource.size}</span>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
