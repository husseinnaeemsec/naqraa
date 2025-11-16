import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HeroBookIcon, HeroBuildingLibraryIcon, HeroWrenchScrewdriverIcon } from "../../components/Icons";
import { useState, type FormEvent } from "react";
import api from "../../api/client";
import { endpoints } from "../../api/routes";
import chatBot from '../../assets/chat_bot.svg';
import { Link } from "react-router-dom";

export default function SupportPage() {
  const { t } = useTranslation();
  const [sent,setSent] = useState(false);
  const [loading,setLoading] = useState(false);
  const [errors,setErrors] = useState<string[]>([]);
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [message,setMessage] = useState('')

  const handleSubmit = async (e:FormEvent) =>{
    e.preventDefault();
    setErrors([]);
    setSent(false);
    setLoading(true);
    if([email,name,message].some(input => input.trim() === '' )){
      setErrors([t('support_page.all_fields_required')]);
      setLoading(false);
      return;
    }

    try{
      await api.post(endpoints.support.contact,{ email,name,message })
      setSent(true);
    }catch(e:any){
      if(e.response?.status === 400){
        setErrors([e?.response?.data?.error || t('support_page.request_error')])
      }else{
        setErrors([t('support_page.request_error_generic')])
      }
    }finally{
      setLoading(false);
    }
  }

  if(sent){
    return (
      <div className="w-dvw h-dvh flex items-center flex-col gap-3 justify-center">
        <img src={chatBot} className="max-w-96" alt="" />
        <h1 className="text-3xl font-bold"> {t('support_page.success.title')} </h1>
        <p className="max-w-xs text-center">
          {t('support_page.success.message', { name })}
        </p>
        <Link to={'/'} className="p-2 rounded-md px-4 border border-slate-300 hover:bg-emerald-50" > {t('support_page.success.back_home')}  </Link>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 pt-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10"></div>

      {/* Hero Section */}
      <section className="text-center space-y-6 mb-16 sm:mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-emerald-700 leading-tight"
        >
          {t('support_page.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg sm:text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed"
        >
          {t('support_page.subtitle')}
        </motion.p>
      </section>

      {/* Support Form */}
      <section className="bg-white border border-slate-300 max-w-4xl mx-auto  rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 shadow-xl mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold mb-6 text-center"
        >
          {t('support_page.form.title')}
        </motion.h2>
        <p className="text-center text-lg mb-8 text-emerald-900">
          {t('support_page.form.description')}
        </p>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:gap-6">
          {
            errors.map((e)=>{
              return (
                <div className="p-2 bg-rose-50 text-rose-500 rounded border-rose-500 border"> {e} </div>
              )
            })
          }
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <input
              type="text"
              placeholder={t('support_page.form.name_placeholder')}
              className="p-4 rounded-xl bg-slate-100  focus:ring-2 ring-emerald-400"
              required
              value={name}
              onChange={(e)=>{ setName(e.target.value) }}
            />
            <input
              type="email"
              placeholder={t('support_page.form.email_placeholder')}
              className="p-4 rounded-xl bg-slate-100  focus:ring-2 ring-emerald-400"
              required
              value={email}
              onChange={(e)=>{ setEmail(e.target.value) }}
            />
          </div>
          <textarea
            placeholder={t('support_page.form.message_placeholder')}
            rows={6}
            className="p-4 rounded-xl bg-slate-100  focus:ring-2 ring-emerald-400 resize-none"
            required
            value={message}
            onChange={(e)=>{ setMessage(e.target.value) }}
          ></textarea>
          <button
            disabled={loading}
            className="text-white bg-emerald-700 font-bold py-4 rounded-xl text-lg sm:text-xl transition duration-200 hover:bg-emerald-100 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('support_page.form.sending') : t('support_page.form.submit')}
          </button>
        </form>
      </section>

      {/* Support Topics */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 sm:gap-8 mb-16">
        {[
          {
            title: t('support_page.topics.technical.title'),
            desc: t('support_page.topics.technical.description'),
            icon: <HeroWrenchScrewdriverIcon className="size-14 text-emerald-800" />
          },
          {
            title: t('support_page.topics.education.title'),
            desc: t('support_page.topics.education.description'),
            icon: <HeroBookIcon className="size-14 text-emerald-800" />
          },
          {
            title: t('support_page.topics.partnerships.title'),
            desc: t('support_page.topics.partnerships.description'),
            icon: <HeroBuildingLibraryIcon className="size-14 text-emerald-800" />
          }
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border border-emerald-200 rounded-2xl p-6 sm:p-8 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="text-4xl mb-4">{s.icon}</div>
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-700 mb-3">{s.title}</h3>
            <p className="text-slate-700 mb-4 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer CTA */}
      <section className="text-center pb-20 space-y-6">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-slate-800"
        >
          {t('support_page.cta.title')}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600"
        >
          {t('support_page.cta.description')}
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-emerald-600 text-white rounded-xl text-xl font-bold hover:bg-emerald-700 transition"
        >
          {t('support_page.cta.button')}
        </motion.button>
      </section>
    </div>
  );
}
