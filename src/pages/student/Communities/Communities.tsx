import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Plus, Search, Filter, Hash, UserPlus, TrendingUp, MessageSquare, Star } from "lucide-react";
import Card from "../../../components/ui/CustomCard";
import Button from "../../../components/ui/CustomButton";

// Community Page Component
const CommunitiesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const communities = [
        { 
            id: 1, 
            name: 'طلاب الرياضيات', 
            members: 124, 
            description: 'مجتمع للطلاب المهتمين بالرياضيات والحلول المبتكرة',
            category: 'academic',
            posts: 45,
            online: 12,
            trending: true,
            image: '🔢'
        },
        { 
            id: 2, 
            name: 'القراءة والمطالعة', 
            members: 89, 
            description: 'مجتمع لمحبي القراءة والكتاب والأدب العربي',
            category: 'literature',
            posts: 67,
            online: 8,
            trending: false,
            image: '📚'
        },
        { 
            id: 3, 
            name: 'التطوير الذاتي', 
            members: 156, 
            description: 'مجتمع للتطوير الشخصي والمهني والنمو المستمر',
            category: 'development',
            posts: 89,
            online: 15,
            trending: true,
            image: '🚀'
        },
        { 
            id: 4, 
            name: 'العلوم والتكنولوجيا', 
            members: 201, 
            description: 'مجتمع لمناقشة أحدث التطورات العلمية والتقنية',
            category: 'science',
            posts: 123,
            online: 24,
            trending: true,
            image: '🔬'
        },
        { 
            id: 5, 
            name: 'الفنون والإبداع', 
            members: 78, 
            description: 'مجتمع للفنانين والمبدعين لمشاركة أعمالهم',
            category: 'arts',
            posts: 34,
            online: 6,
            trending: false,
            image: '🎨'
        },
        { 
            id: 6, 
            name: 'الرياضة والصحة', 
            members: 134, 
            description: 'مجتمع للرياضة واللياقة البدنية والصحة العامة',
            category: 'sports',
            posts: 56,
            online: 18,
            trending: false,
            image: '⚽'
        }
    ];

    const categories = [
        { id: 'all', name: 'الكل', icon: Hash },
        { id: 'academic', name: 'أكاديمي', icon: Users },
        { id: 'literature', name: 'أدب', icon: MessageSquare },
        { id: 'development', name: 'تطوير', icon: TrendingUp },
        { id: 'science', name: 'علوم', icon: Star },
        { id: 'arts', name: 'فنون', icon: Users },
        { id: 'sports', name: 'رياضة', icon: Users }
    ];

    const filteredCommunities = communities.filter(community => {
        const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            community.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || community.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const totalMembers = communities.reduce((sum, community) => sum + community.members, 0);
    const activeCommunities = communities.filter(c => c.online > 0).length;
    const trendingCommunities = communities.filter(c => c.trending).length;

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
                        <Users className="w-8 h-8 text-emerald-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-50">المجتمعات</h1>
                            <p className="text-gray-600 dark:text-emerald-200/70">انضم إلى مجتمعات تشاركك الاهتمامات</p>
                        </div>
                    </div>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        إنشاء مجتمع
                    </Button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            >
                <Card className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <Users className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-emerald-50">{totalMembers}</p>
                            <p className="text-sm text-gray-600 dark:text-emerald-200/70">إجمالي الأعضاء</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Hash className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-emerald-50">{activeCommunities}</p>
                            <p className="text-sm text-gray-600 dark:text-emerald-200/70">مجتمعات نشطة</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-emerald-50">{trendingCommunities}</p>
                            <p className="text-sm text-gray-600 dark:text-emerald-200/70">مجتمعات رائجة</p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Search and Filter */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
            >
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="ابحث في المجتمعات..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-emerald-950 text-gray-900 dark:text-emerald-50"
                        />
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-emerald-950 text-gray-900 dark:text-emerald-50"
                    >
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
            </motion.div>

            {/* Communities Grid */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {filteredCommunities.map((community, index) => (
                    <motion.div
                        key={community.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (index * 0.1) }}
                    >
                        <Card className="group hover:shadow-lg transition-all duration-200 h-full">
                            <div className="p-6 space-y-4">
                                {/* Community Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">{community.image}</div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-emerald-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                                                {community.name}
                                            </h3>
                                            {community.trending && (
                                                <span className="inline-flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                                                    <TrendingUp className="w-3 h-3" />
                                                    رائج
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 dark:text-emerald-200/70 text-sm line-clamp-2">
                                    {community.description}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-emerald-400">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{community.members}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="w-4 h-4" />
                                            <span>{community.posts}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span>{community.online} متصل</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="pt-2 border-t border-emerald-100 dark:border-emerald-800">
                                    <Link to={`/communities/${community.id}`}>
                                        <Button 
                                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            الانضمام
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Empty State */}
            {filteredCommunities.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <Users className="w-16 h-16 text-gray-300 dark:text-emerald-700 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-emerald-200 mb-2">
                        لا توجد مجتمعات
                    </h3>
                    <p className="text-gray-500 dark:text-emerald-400 mb-4">
                        جرب تغيير معايير البحث أو المرشح
                    </p>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        إنشاء مجتمع جديد
                    </Button>
                </motion.div>
            )}
        </div>
    );
};

export default CommunitiesPage;