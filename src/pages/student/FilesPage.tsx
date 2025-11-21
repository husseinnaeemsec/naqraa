import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Eye, Search, Upload, Filter, MoreVertical, File, Image, Video } from "lucide-react";
import { useTranslation } from 'react-i18next';
import Card from "../../components/ui/CustomCard";
import Button from "../../components/ui/CustomButton";

const FilesPage = () => {
    const { t } = useTranslation();
    const [files] = useState([
        { id: 1, name: t('files_page.sample_math_project'), type: "PDF", size: "2.1 MB", date: "15 أبريل 2026", color: "text-red-600" },
        { id: 2, name: t('files_page.sample_arabic_note'), type: "DOCX", size: "1.5 MB", date: "10 أبريل 2026", color: "text-blue-600" },
        { id: 3, name: t('files_page.sample_science_presentation'), type: "PPTX", size: "3.2 MB", date: "5 أبريل 2026", color: "text-orange-600" },
        { id: 4, name: t('files_page.sample_history_note'), type: "PDF", size: "1.8 MB", date: "1 أبريل 2026", color: "text-red-600" },
        { id: 5, name: t('files_page.sample_geography_note'), type: "DOCX", size: "2.3 MB", date: "28 مارس 2026", color: "text-blue-600" },
        { id: 6, name: t('files_page.sample_chemistry_note'), type: "PDF", size: "1.9 MB", date: "22 مارس 2026", color: "text-red-600" },
    ]);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const getFileIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'pdf': return <FileText className="w-8 h-8" />;
            case 'docx': case 'doc': return <File className="w-8 h-8" />;
            case 'pptx': case 'ppt': return <File className="w-8 h-8" />;
            case 'jpg': case 'png': case 'gif': return <Image className="w-8 h-8" />;
            case 'mp4': case 'avi': return <Video className="w-8 h-8" />;
            default: return <File className="w-8 h-8" />;
        }
    };

    const filteredFiles = files.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950 p-6">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-emerald-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-50">{t('files_page.title')}</h1>
                            <p className="text-gray-600 dark:text-emerald-200/70">{t('files_page.subtitle')}</p>
                        </div>
                    </div>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        {t('files_page.upload_file')}
                    </Button>
                </div>
            </motion.div>

            {/* Search and Filter Bar */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
            >
                <Card className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder={t('files_page.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-emerald-200 dark:border-emerald-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-emerald-950 text-gray-900 dark:text-emerald-50"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                                onClick={() => setViewMode('grid')}
                                className="px-3 py-2"
                            >
                                {t('files_page.grid_view')}
                            </Button>
                            <Button 
                                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                                onClick={() => setViewMode('list')}
                                className="px-3 py-2"
                            >
                                {t('files_page.list_view')}
                            </Button>
                            <Button variant="secondary" className="px-3 py-2">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Files Grid/List */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
                    : "space-y-2"
                }
            >
                {filteredFiles.map((file, idx) => (
                    <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        {viewMode === 'grid' ? (
                            <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                                <div className="p-4 space-y-3">
                                    {/* File Icon */}
                                    <div className="flex justify-center">
                                        <div className={`p-3 rounded-lg bg-gray-100 dark:bg-emerald-900/30 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors ${file.color}`}>
                                            {getFileIcon(file.type)}
                                        </div>
                                    </div>

                                    {/* File Info */}
                                    <div className="text-center space-y-1">
                                        <h3 className="font-medium text-sm text-gray-900 dark:text-emerald-50 line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                                            {file.name}
                                        </h3>
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-emerald-400">
                                            <span>{file.type}</span>
                                            <span>•</span>
                                            <span>{file.size}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 dark:text-emerald-500">{file.date}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
                                <div className="p-4 flex items-center gap-4">
                                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-emerald-900/30 ${file.color}`}>
                                        {getFileIcon(file.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 dark:text-emerald-50 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                                            {file.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-emerald-400">
                                            <span>{file.type}</span>
                                            <span>{file.size}</span>
                                            <span>{file.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </motion.div>
                ))}
            </motion.div>

            {/* Empty State */}
            {filteredFiles.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <FileText className="w-16 h-16 text-gray-300 dark:text-emerald-700 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-emerald-50 mb-2">
                        {searchTerm ? t('files_page.no_files_found') : t('files_page.no_files_yet')}
                    </h3>
                    <p className="text-gray-500 dark:text-emerald-400 mb-6">
                        {searchTerm ? t('files_page.try_different_search') : t('files_page.start_uploading')}
                    </p>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        {t('files_page.upload_file')}
                    </Button>
                </motion.div>
            )}
        </div>
    );
};

export default FilesPage;
