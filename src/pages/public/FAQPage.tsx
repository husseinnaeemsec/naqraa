import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const getFaqs = (t: any) => [
  {
    question: t('faq.graduation_projects_question'),
    answer: t('faq.graduation_projects_answer')
  },
  {
    question: t('faq.technical_support_question'),
    answer: t('faq.technical_support_answer')
  },
  {
    question: t('faq.free_resources_question'),
    answer: t('faq.free_resources_answer')
  },
  {
    question: t('faq.certificates_question'),
    answer: t('faq.certificates_answer')
  },
  {
    question: t('faq.share_research_question'),
    answer: t('faq.share_research_answer')
  }
];

export default function FAQPage() {
  const { t } = useTranslation();
  const faqs = getFaqs(t);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white px-6 md:px-16 lg:px-32 py-24">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-5xl md:text-6xl font-extrabold text-emerald-700 mb-16"
      >
        {t('faq.title')}
      </motion.h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow p-6 border cursor-pointer border-l-4 border-emerald-600"
            onClick={() => toggleFAQ(idx)}
          >
            <h3 className="text-xl md:text-2xl font-semibold text-emerald-700 flex justify-between items-center">
              {faq.question}
              <span className="text-emerald-900">{activeIndex === idx ? '-' : '+'}</span>
            </h3>
            {activeIndex === idx && (
              <p className="mt-4 text-slate-700 leading-relaxed">{faq.answer}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-20">
        <p className="text-lg text-slate-700 mb-4">{t('faq.not_found_answer')}</p>
        <Link to={'/contact'} className="px-10 py-4 bg-emerald-600 text-white rounded-xl text-xl font-bold hover:bg-emerald-700 transition">
          {t('faq.contact_us')}
        </Link>
      </div>

      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200 rounded-full opacity-30 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-300 rounded-full opacity-20 -z-10"></div>
    </div>
  );
}