import { motion } from "framer-motion";
import { Building, TrendingUp, Users, Award, FileBarChart, Download, Calendar, Target } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// Organization Page Component
const OrgPage = () => {
    const stats = [
        { subject: "الرياضيات", grade: 85, color: "bg-emerald-500" },
        { subject: "اللغة العربية", grade: 92, color: "bg-blue-500" },
        { subject: "العلوم", grade: 78, color: "bg-purple-500" },
        { subject: "التاريخ", grade: 88, color: "bg-orange-500" },
    ];

    const metrics = [
        { label: "المشاركة في الصف", value: "95%", icon: Users, color: "text-emerald-600" },
        { label: "الحضور", value: "98%", icon: Calendar, color: "text-blue-600" },
        { label: "العمل الجماعي", value: "89%", icon: Target, color: "text-purple-600" },
        { label: "الإنجازات", value: "12", icon: Award, color: "text-orange-600" },
    ];

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
                        <Building className="w-8 h-8 text-emerald-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-50">المؤسسة التعليمية</h1>
                            <p className="text-gray-600 dark:text-emerald-200/70">التقارير والإحصائيات الأكاديمية</p>
                        </div>
                    </div>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2">
                        <FileBarChart className="w-4 h-4" />
                        تقرير شامل
                    </Button>
                </div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
                {metrics.map((metric, index) => {
                    const IconComp = metric.icon;
                    return (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (index * 0.05) }}
                        >
                            <Card className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-emerald-200/70">
                                            {metric.label}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-emerald-50 mt-1">
                                            {metric.value}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg bg-gray-100 dark:bg-emerald-900/30 ${metric.color}`}>
                                        <IconComp className="w-6 h-6" />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Academic Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Grades Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-emerald-50 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                                الدرجات الأكاديمية
                            </h3>
                            <Button variant="secondary" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                تنزيل
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.subject}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (index * 0.1) }}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900 dark:text-emerald-50">
                                            {stat.subject}
                                        </span>
                                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                            {stat.grade}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-emerald-900/30 rounded-full h-3">
                                        <motion.div
                                            className={`h-3 rounded-full ${stat.color}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.grade}%` }}
                                            transition={{ delay: 0.5 + (index * 0.1), duration: 0.8 }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                {/* Performance Analytics */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-emerald-50 mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 text-emerald-600" />
                            تحليل الأداء
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                        <span className="font-medium text-gray-900 dark:text-emerald-50">فوق المتوسط</span>
                                    </div>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">75%</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="font-medium text-gray-900 dark:text-emerald-50">متوسط</span>
                                    </div>
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">20%</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-orange-50/50 dark:bg-orange-900/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                        <span className="font-medium text-gray-900 dark:text-emerald-50">يحتاج تحسين</span>
                                    </div>
                                    <span className="text-orange-600 dark:text-orange-400 font-bold">5%</span>
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-emerald-100 dark:border-emerald-800">
                                <p className="text-sm text-gray-600 dark:text-emerald-200/70 mb-4">
                                    التوصيات:
                                </p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2 text-gray-700 dark:text-emerald-200">
                                        <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                        زيادة التركيز على العلوم
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-700 dark:text-emerald-200">
                                        <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                        مراجعة مواد الرياضيات
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-700 dark:text-emerald-200">
                                        <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                        المشاركة أكثر في الأنشطة
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </motion.div>
                </div>
            </div>
    );
};

export default OrgPage;