import { motion } from "framer-motion";
import { ChevronRight, CheckCircle } from "lucide-react";

// Import your assets
import chat from "../../assets/chat-img.svg";
import community from "../../assets/community-img.svg";
import orgmanage from "../../assets/manage-img.svg";
import learn from "../../assets/learn-img.svg";
import research from "../../assets/research-img.svg";
import { t } from "i18next";

const images = [community, chat, orgmanage, learn, research]


// --- Arabic CTA Component (Remains the same, but simplified import) ---

const ArabicCtaSection = () => {
    return (
        <motion.section
            className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white"
            dir="rtl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl text-center">
                <motion.div
                    className="space-y-6 sm:space-y-8"
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div>
                        <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                            {t("features_page.cta_section.title")}
                        </h2>
                        <p className="mb-6 sm:mb-8 text-emerald-100 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                            {t("features_page.cta_section.description")}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
                        <motion.a
                            href="/register"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-emerald-700 font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                            <CheckCircle className="size-4 sm:size-5" />
                            {t("features_page.cta_section.start_free_button")}
                        </motion.a>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-medium px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-white hover:text-emerald-700 transition-all duration-300 text-sm sm:text-base"
                        >
                            {t("features_page.cta_section.learn_more_button")}
                            <ChevronRight className="size-4" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};
ArabicCtaSection.displayName = 'ArabicCtaSection';
// -----------------------------------------------------------------------------

// --- Feature Data (Remains the same) ---


// -----------------------------------------------------------------------------

// --- Features Component ---
export default function Features() {
    const featuresData = [
        {
            index: 0,
            title: t("naqraa_features.0.title"),
            description: t("naqraa_features.0.description"),
            details: [
                t("naqraa_features.0.details.0"),
                t("naqraa_features.0.details.1"),
                t("naqraa_features.0.details.2"),
            ],
            alt: t("naqraa_features.0.alt"),
            cta: t("naqraa_features.0.cta"),
            reverseLayout: false,
        },
        {
            index: 1,
            title: t("naqraa_features.1.title"),
            description: t("naqraa_features.1.description"),
            details: [
                t("naqraa_features.1.details.0"),
                t("naqraa_features.1.details.1"),
                t("naqraa_features.1.details.2"),
            ],
            alt: t("naqraa_features.1.alt"),
            cta: t("naqraa_features.1.cta"),
            reverseLayout: true,
        },
        {
            index: 2,
            title: t("naqraa_features.2.title"),
            description: t("naqraa_features.2.description"),
            details: [
                t("naqraa_features.2.details.0"),
                t("naqraa_features.2.details.1"),
                t("naqraa_features.2.details.2"),
            ],
            alt: t("naqraa_features.2.alt"),
            cta: t("naqraa_features.2.cta"),
            reverseLayout: false,
        },
        {
            index: 3,
            title: t("naqraa_features.3.title"),
            description: t("naqraa_features.3.description"),
            details: [
                t("naqraa_features.3.details.0"),
                t("naqraa_features.3.details.1"),
                t("naqraa_features.3.details.2"),
            ],
            alt: t("naqraa_features.3.alt"),
            cta: t("naqraa_features.3.cta"),
            reverseLayout: true,
        },
        {
            index: 4,
            title: t("naqraa_features.4.title"),
            description: t("naqraa_features.4.description"),
            details: [
                t("naqraa_features.4.details.0"),
                t("naqraa_features.4.details.1"),
                t("naqraa_features.4.details.2"),
            ],
            alt: t("naqraa_features.4.alt"),
            cta: t("naqraa_features.4.cta"),
            reverseLayout: false,
        },
    ];
    return (
        <section className="bg-gradient-to-b from-white to-emerald-50 overflow-hidden" dir="rtl">
            <div className="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24 py-8 sm:py-12 md:py-16">
                {featuresData.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`gap-6 sm:gap-8 lg:gap-16 items-center px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl md:grid md:grid-cols-2`}
                    >
                        {/* Image Column */}
                        <motion.div
                            className={`relative mb-8 md:mb-0 ${feature.reverseLayout ? "md:order-2" : "md:order-1"
                                }`}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
                                <img
                                    className="w-full max-h-[70vh] object-contain"
                                    src={images[feature.index]}
                                    alt={feature.alt}
                                />
                                {/* Floating badge */}
                                <motion.div
                                    className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-emerald-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg"
                                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {t("features_page.badges.new")}
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Text Content Column */}
                        <motion.div
                            className={`space-y-4 sm:space-y-6 ${feature.reverseLayout ? "md:order-1" : "md:order-2"
                                }`}
                            initial={{ opacity: 0, x: feature.reverseLayout ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                                <CheckCircle className="size-4" />
                                {t("features_page.badges.featured")}
                            </div>

                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                                {feature.title}
                            </h2>

                            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Detailed Points with Icons */}
                            <div className="space-y-3 sm:space-y-4">
                                {feature.details.map((detail, detailIndex) => (
                                    <motion.div
                                        key={detailIndex}
                                        className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-emerald-100 shadow-sm"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: detailIndex * 0.1 }}
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <CheckCircle className="size-4 text-emerald-600" />
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{detail}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.a
                                href="#"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-emerald-200 w-full sm:w-auto"
                            >
                                {feature.cta}
                                <ChevronRight className="size-5" />
                            </motion.a>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
            <ArabicCtaSection />
        </section>
    );
}