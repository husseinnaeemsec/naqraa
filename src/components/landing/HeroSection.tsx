import { t } from "i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Users, BookOpen, Award, ChevronRight } from "lucide-react";

export default function HeroSection() {
    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const slideInRight = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, delay: 0.3 }
    };

    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-100" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-300 rounded-full opacity-15 blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            
            <motion.div 
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-32"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
            >
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
                    {/* Content */}
                    <motion.div className="space-y-6 sm:space-y-8 text-right lg:order-1" variants={fadeInUp}>
                        {/* Badge */}
                        <motion.div 
                            className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium"
                            variants={fadeInUp}
                        >
                            <Award className="size-4" />
                            منصة التعلم الرائدة في العالم العربي
                        </motion.div>

                        {/* Main Title */}
                        <motion.h1 
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight"
                            variants={fadeInUp}
                        >
                            {t('hero_title')}
                        </motion.h1>

                        {/* Description */}
                        <motion.p 
                            className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl"
                            variants={fadeInUp}
                        >
                            {t("hero_text")}
                        </motion.p>

                        {/* Stats */}
                        <motion.div 
                            className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 py-4 sm:py-6"
                            variants={fadeInUp}
                        >
                            {[
                                { icon: <Users className="size-6 text-emerald-600" />, value: "10K+", label: "طالب" },
                                { icon: <BookOpen className="size-6 text-emerald-600" />, value: "500+", label: "دورة" },
                                { icon: <Award className="size-6 text-emerald-600" />, value: "98%", label: "رضا" }
                            ].map((stat, index) => (
                                <motion.div 
                                    key={index}
                                    className="text-center"
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="mb-2">{stat.icon}</div>
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div 
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-start"
                            variants={fadeInUp}
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link 
                                    to={'/courses'} 
                                    className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-200 w-full sm:w-auto"
                                >
                                    <Play className="size-4 sm:size-5" />
                                    {t("hero_button_text")}
                                </Link>
                            </motion.div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
                            >
                                شاهد العرض التوضيحي
                                <ChevronRight className="size-4" />
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* Hero Image */}
                    <motion.div 
                        className="relative mt-8 lg:mt-0 lg:order-2"
                        variants={slideInRight}
                    >
                        <div className="relative max-w-lg mx-auto lg:max-w-none">
                            {/* Floating Cards */}
                            <motion.div 
                                className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl z-10 hidden sm:block"
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <BookOpen className="size-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">دورة جديدة!</div>
                                        <div className="text-sm text-gray-600">البرمجة الحديثة</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl z-10 hidden sm:block"
                                animate={{ y: [10, -10, 10] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <Users className="size-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">+250 طالب</div>
                                        <div className="text-sm text-gray-600">انضموا اليوم</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Main Hero Image */}
                            <motion.div 
                                className="relative bg-white/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-emerald-100"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img 
                                    src="/heroimg.svg" 
                                    alt="منصة نقرأ التعليمية" 
                                    className="w-full h-auto"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
