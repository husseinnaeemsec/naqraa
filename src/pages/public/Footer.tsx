import { Link } from 'react-router-dom';
import appleLogo from '../../assets/apple-logo.svg';

export default function Footer() {
    return (
        <footer className="bg-white antialiased dark:bg-gray-900 border-t  border-emerald-100 dark:border-emerald-800">
            <div className="mx-auto  max-w-7xl  px-4 2xl:px-0">
                <div className="py-10 md:py-14 lg:py-20">
                    <div className="items-start gap-6 md:gap-10 lg:flex 2xl:gap-24">
                        <div className="grid min-w-0 flex-1 grid-cols-2 gap-6 md:gap-8 xl:grid-cols-3 text-right">
                            <div>
                                <h6 className="mb-4 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">عن نقرا</h6>
                                <ul className="space-y-3">
                                    <li><Link to="/about" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">من نحن</Link></li>
                                    <li><Link to="/terms" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400"> شروط الاستخدام </Link></li>
                                    <li><Link to="/blog" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">المدونة</Link></li>
                                    <li><Link to="/join-naqraa-team" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">انضم إلى الفريق</Link></li>
                                    <li><Link to="/naqraa-for-organizations" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">نقرأ للمؤسسات التعليمية</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="mb-4 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">الدعم والمساعدة</h6>
                                <ul className="space-y-3">
                                    <li><Link to="support" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">مركز المساعدة</Link></li>
                                    <li><Link to="/faq" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">الأسئلة الشائعة</Link></li>
                                    <li><Link to="/contact" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">تواصل معنا</Link></li>
                                    <li><Link to="/report-issue" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">الإبلاغ عن مشكلة</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="mb-4 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">الخدمات التعليمية</h6>
                                <ul className="space-y-3">
                                    <li><Link to="/courses/explore?is_free=on" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">الدورات المجانية</Link></li>
                                    <li><Link to="/plans" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">خطط الاشتراك</Link></li>
                                    <li><Link to="/resources" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">الأبحاث والمراجع</Link></li>
                                    <li><Link to="/communities" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">المجتمعات الطلابية</Link></li>
                                    <li><Link to="/organizations" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">المؤسسات التعليمية</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="mb-4 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">تطبيق نقرا</h6>
                                <ul className="space-y-3">
                                    <li className='flex items-center gap-2'>
                                        <button disabled className="text-gray-500 line-through  dark:text-gray-400 dark:hover:text-emerald-400">تحميل التطبيق</button>
                                        <span className="bg-amber-500 text-xs p-1 text-white rounded-md"> قريبا </span>
                                    </li>
                                    <li><Link to="/app-features" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">مميزات التطبيق</Link></li>

                                </ul>
                            </div>

                            <div>
                                <h6 className="mb-4 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">الشركاء</h6>
                                <ul className="space-y-3">
                                    <li><Link to="/partenrs?type=organizations" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">المدارس والجامعات</Link></li>
                                    
                                    <li><Link to="/partenrs?type=teachers" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">المعلّمون</Link></li>
                                </ul>
                            </div>
                        </div>

                        {/* <!-- === Subscribe & App Section === --> */}
                        <div className="mt-10 w-full md:mt-8 lg:mt-0 lg:max-w-lg">
                            <div className="space-y-5 rounded-xl bg-emerald-50 p-6 dark:bg-emerald-950/40">


                                <hr className="border-emerald-100 dark:border-emerald-800" />

                                <form action="#">
                                    <div className="items-end space-y-4 sm:flex sm:space-y-0">
                                        <div className="relative mr-3 w-full sm:w-96 lg:w-full">
                                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                                                اشترك ليصلك أحدث الدورات والمحتويات التعليمية
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                placeholder="أدخل بريدك الإلكتروني"
                                                required
                                                className="block w-full rounded-lg border border-emerald-200 bg-white p-3 text-sm text-gray-900 focus:border-emerald-600 focus:ring-emerald-600 dark:border-emerald-800 dark:bg-gray-800 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <button type="submit" className="w-full rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-800">
                                                اشتراك
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                <hr className="border-emerald-100 dark:border-emerald-800" />

                                <div>
                                    <p className="mb-3 flex gap-1 text-sm font-medium text-gray-900 dark:text-white">
                                        <span className="bg-amber-500 text-xs p-1 text-white rounded-md"> قريبا </span>
                                         <strong className='text-emerald-600'> تطبيق نقرأ  </strong> على اجهزة الهاتف
                                    </p>
                                    <div className="gap-4 space-y-4 sm:flex sm:space-y-0">
                                        <button disabled className="inline-flex w-full items-center justify-center rounded-lg bg-slate-600 px-4 py-2.5 text-white  focus:ring-4 focus:ring-emerald-300 sm:w-auto">
                                            <svg className="ml-3 h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                                            <div className="text-right">
                                                <div className="mb-1 text-xs">حمّل على</div>
                                                <div className="-mt-1 text-sm font-semibold">Google Play</div>
                                            </div>
                                        </button>

                                        <button disabled className="inline-flex w-full items-center justify-center rounded-lg bg-slate-600 px-4 py-2.5 text-white  focus:ring-4 focus:ring-emerald-300 sm:w-auto">
                                            <img src={appleLogo} className="ml-3 h-9 w-9" alt="" />
                                            <div className="text-right">
                                                <div className="mb-1 text-xs">حمّل على</div>
                                                <div className="-mt-1 text-sm font-semibold">App Store</div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <hr className="border-emerald-100 dark:border-emerald-800" />
                                <div className="flex items-center gap-3">
                                    <Link to={'/login'} className='p-2 bg-emerald-500 rounded-md text-white'> سجل الدخول الى حسابك  </Link>
                                    <Link to={'/register'} className='border p-2 rounded-md border-slate-300'> او انشئ حساب جديد  </Link>
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
                        © 2025 نقرا. جميع الحقوق محفوظة.
                    </div>
                </div>
            </div>
        </footer>

    )
}