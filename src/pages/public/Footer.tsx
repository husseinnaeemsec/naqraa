import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import appleLogo from '../../assets/apple-logo.svg';
import api from '../../api/client';
import { endpoints } from '../../api/routes';

export default function Footer() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setMessage(t('footer.newsletter_form.error_email_required'));
            setMessageType('error');
            return;
        }

        setIsSubmitting(true);
        setMessage('');
        setMessageType('');

        try {
            await api.post(endpoints.newsletter.subscribe,{
                email: email.trim(),
                wants_course_updates: true,
                wants_new_content: true,
                wants_promotions: true,
                wants_announcements: true,
                source: 'footer'
            });
            setMessage(t('footer.newsletter_form.success_message'));
            setMessageType('success');
            setEmail('');
        } catch (error:any) {
            console.log(error.response)
            setMessage(error.response?.data?.email?.[0] || error.response?.data?.message || t('footer.newsletter_form.error_connection'));
            
            setMessageType('error');
        } finally {
            setIsSubmitting(false);

            // Clear message after 5 seconds
            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 5000);
        }
    };

    return (
        <footer className="bg-white antialiased dark:bg-gray-900 border-t  border-emerald-100 dark:border-emerald-800">
            <div className="mx-auto  max-w-7xl  px-4 2xl:px-0">
                <div className="py-10 md:py-14 lg:py-20">
                    <div className="items-start gap-6 md:gap-10 lg:flex 2xl:gap-24">
                        <div className="grid min-w-0 flex-1 grid-cols-2 gap-6 md:gap-8 xl:grid-cols-3 text-right">
                            <div>
                                <h6 className="mb-4 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">{t('footer.about_naqraa.title')}</h6>
                                <ul className="space-y-3">
                                    <li><Link to="/about" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.about_naqraa.who_we_are')}</Link></li>
                                    <li><Link to="/terms" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.about_naqraa.terms_of_use')}</Link></li>
                                    <li><Link to="/blog" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.about_naqraa.blog')}</Link></li>
                                    <li><Link to="/newsletter" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.about_naqraa.newsletter')}</Link></li>
                                    <li><Link to="/join-naqraa-team" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.about_naqraa.join_team')}</Link></li>
                                    <li><Link to="/naqraa-for-organizations" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.about_naqraa.naqraa_for_organizations')}</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="mb-4 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">{t('footer.support.title')}</h6>
                                <ul className="space-y-3">
                                    <li><Link to="support" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.support.help_center')}</Link></li>
                                    <li><Link to="/faq" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.support.faq')}</Link></li>
                                    <li><Link to="/contact" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.support.contact_us')}</Link></li>
                                    <li><Link to="/report-issue" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.support.report_issue')}</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="mb-4 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">{t('footer.services.title')}</h6>
                                <ul className="space-y-3">
                                    <li><Link to="/courses/explore?is_free=on" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.services.free_courses')}</Link></li>
                                    <li><Link to="/plans" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.services.subscription_plans')}</Link></li>
                                    <li><Link to="/resources" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.services.research_references')}</Link></li>
                                    <li><Link to="/communities" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.services.student_communities')}</Link></li>
                                    <li><Link to="/organizations" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.services.educational_organizations')}</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="mb-4 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">{t('footer.app.title')}</h6>
                                <ul className="space-y-3">
                                    <li className='flex items-center gap-2 relative'>
                                        <button disabled className="text-gray-500 line-through dark:text-gray-400">
                                            {t('footer.app.download_app')}
                                        </button>
                                        <div className="relative">
                                            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-xs px-2 py-1 text-white rounded-md font-medium shadow-lg animate-pulse transform -rotate-2">
                                                {t('footer.app.coming_soon')}
                                            </span>
                                        </div>
                                    </li>
                                    <li><Link to="/app-features" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.app.app_features')}</Link></li>

                                </ul>
                            </div>

                            <div>
                                <h6 className="mb-4 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">{t('footer.partners.title')}</h6>
                                <ul className="space-y-3">
                                    <li><Link to="/partenrs?type=organizations" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.partners.schools_universities')}</Link></li>

                                    <li><Link to="/partenrs?type=teachers" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">{t('footer.partners.teachers')}</Link></li>
                                </ul>
                            </div>
                        </div>

                        {/* <!-- === Subscribe & App Section === --> */}
                        <div className="mt-10 w-full md:mt-8 lg:mt-0 lg:max-w-lg">
                            <div className="space-y-5 rounded-xl bg-emerald-50 p-6 dark:bg-emerald-950/40">


                                <hr className="border-emerald-100 dark:border-emerald-800" />

                                <form onSubmit={handleNewsletterSubmit}>
                                    <div className="items-end space-y-4 sm:flex sm:space-y-0">
                                        <div className="relative mr-3 w-full sm:w-96 lg:w-full">
                                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                                                {t('footer.newsletter_form.title')}
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder={t('footer.newsletter_form.email_placeholder')}
                                                required
                                                disabled={isSubmitting}
                                                className="block w-full rounded-lg border border-emerald-200 bg-white p-3 text-sm text-gray-900 focus:border-emerald-600 focus:ring-emerald-600 dark:border-emerald-800 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        {t('footer.newsletter_form.submitting')}
                                                    </>
                                                ) : (
                                                    t('footer.newsletter_form.subscribe_button')
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Success/Error Message */}
                                    {message && (
                                        <div className={`mt-4 p-3 rounded-lg text-sm ${messageType === 'success'
                                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                : 'bg-red-100 text-red-800 border border-red-200'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                {messageType === 'success' ? (
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                {message}
                                            </div>
                                        </div>
                                    )}
                                </form>

                                <hr className="border-emerald-100 dark:border-emerald-800" />

                                <div>
                                    <p className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                        <strong className='text-emerald-600'>{t('footer.app.title')}</strong> {t('footer.app.on_mobile')}
                                    </p>
                                    <div className="gap-4 space-y-4 sm:flex sm:space-y-0">
                                        <div className="relative">
                                            <button disabled className="inline-flex w-full items-center justify-center rounded-lg bg-slate-600 px-4 py-2.5 text-white opacity-60 cursor-not-allowed sm:w-auto">
                                                <svg className="ml-3 h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                                                <div className="text-right">
                                                    <div className="mb-1 text-xs">{t('footer.app.download_on')}</div>
                                                    <div className="-mt-1 text-sm font-semibold">Google Play</div>
                                                </div>
                                            </button>
                                            <div className="absolute -top-2 -right-2">
                                                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-xs px-2 py-1 text-white rounded-full font-medium shadow-lg animate-pulse">
                                                    {t('footer.app.coming_soon')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <button disabled className="inline-flex w-full items-center justify-center rounded-lg bg-slate-600 px-4 py-2.5 text-white opacity-60 cursor-not-allowed sm:w-auto">
                                                <img src={appleLogo} className="ml-3 h-9 w-9" alt="" />
                                                <div className="text-right">
                                                    <div className="mb-1 text-xs">{t('footer.app.download_on')}</div>
                                                    <div className="-mt-1 text-sm font-semibold">App Store</div>
                                                </div>
                                            </button>
                                            <div className="absolute -top-2 -right-2">
                                                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-xs px-2 py-1 text-white rounded-full font-medium shadow-lg animate-pulse">
                                                    {t('footer.app.coming_soon')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-emerald-100 dark:border-emerald-800" />
                                <div className="flex items-center gap-3">
                                    <Link to={'/login'} className='p-2 bg-emerald-500 rounded-md text-white'>{t('footer.auth.login_to_account')}</Link>
                                    <Link to={'/register'} className='border p-2 rounded-md border-slate-300'>{t('footer.auth.or_create_account')}</Link>
                                </div>
                                <hr className="border-emerald-100 dark:border-emerald-800" />

                                <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                                    <a href="#" className="text-gray-500 hover:text-emerald-700"><i className="fa-brands fa-facebook-f"></i></a>
                                    <a href="#" className="text-gray-500 hover:text-emerald-700"><i className="fa-brands fa-instagram"></i></a>
                                    <a href="#" className="text-gray-500 hover:text-emerald-700"><i className="fa-brands fa-twitter"></i></a>
                                    <a href="#" className="text-gray-500 hover:text-emerald-700"><i className="fa-brands fa-youtube"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        {t('footer.copyright')}
                    </div>
                </div>
            </div>
        </footer>

    )
}