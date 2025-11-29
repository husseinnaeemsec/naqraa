import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import Button  from './ui/CustomButton';
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

// interface ResourcesResponse {
//   results: Resource[];
//   count: number;
// }

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

// Dynamic resource labels based on translations
const getResourceLabel = (type: string, t: any) => {
  const labels = {
    pdf: "PDF",
    video: t('resources.types.video'),
    document: t('resources.types.document'),
    link: t('resources.types.link'),
    image: t('resources.types.image')
  };
  return labels[type as keyof typeof labels] || type;
};

export default function UsefulResourcesWidget() {
  const { t } = useTranslation();
  useApiErrorHandler();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, _setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedResources = async () => {
      setResources([]);
          setLoading(false);
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
      <Card className="w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">{t('resources.title')}</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
          {t('resources.subtitle')}
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
      <Card className="w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">{t('useful_resources.title')}</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            {t('useful_resources.retry')}
          </Button>
        </div>
      </Card>
    );
  }

  if (!resources.length) {
    return (
      <Card className="w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">{t('useful_resources.title')}</h2>
        </div>
        <div className="text-center py-8">
          <Lightbulb className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t('useful_resources.no_resources')}</p>
          <Link to="/resources">
            <Button variant="outline" size="sm">
              {t('useful_resources.browse_all')}
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Lightbulb className="size-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-emerald-50">{t('useful_resources.title')}</h2>
        </div>
        <Link to="/resources" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
          {t('useful_resources.view_all')}
        </Link>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
        {t('useful_resources.subtitle')}
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
                className="h-full p-4 cursor-pointer bg-gradient-to-b from-white to-gray-50/30 dark:from-emerald-900/30 dark:to-emerald-950/50 border border-gray-200 dark:border-emerald-800"
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
                        {getResourceLabel(resource.file_type, t)}
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
