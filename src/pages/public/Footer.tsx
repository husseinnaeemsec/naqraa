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
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">من نحن</a></li>
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">المدونة</a></li>
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">انضم إلى الفريق</a></li>
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">الشراكات</a></li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="mb-4 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">الدعم والمساعدة</h6>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">مركز المساعدة</a></li>
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">الأسئلة الشائعة</a></li>
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">تواصل معنا</a></li>
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">الإبلاغ عن مشكلة</a></li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="mb-4 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">الخدمات التعليمية</h6>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">الدورات المجانية</a></li>
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">الأبحاث والمراجع</a></li>
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">المجتمعات الطلابية</a></li>
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">المؤسسات التعليمية</a></li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="mb-4 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">تطبيق نقرا</h6>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">تحميل التطبيق</a></li>
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">مميزات التطبيق</a></li>
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">الدخول إلى حسابك</a></li>
                                </ul>
                            </div>

                            <div>
                                <h6 className="mb-4 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">الشركاء</h6>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">المدارس والجامعات</a></li>
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">المنظمات</a></li>
                                    <li><a href="#" className="text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400">المعلّمون</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* <!-- === Subscribe & App Section === --> */}
                        <div className="mt-10 w-full md:mt-8 lg:mt-0 lg:max-w-lg">
                            <div className="space-y-5 rounded-xl bg-emerald-50 p-6 dark:bg-emerald-950/40">
                                <a href="#" className="text-base font-medium text-emerald-700 underline hover:no-underline dark:text-emerald-400">
                                    تسجيل الدخول أو إنشاء حساب
                                </a>

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
                                    <p className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                                        تعلّم في أي وقت مع <a href="#" className="underline text-emerald-700 hover:text-emerald-800 dark:text-emerald-400">تطبيق نقرا</a>
                                    </p>
                                    <div className="gap-4 space-y-4 sm:flex sm:space-y-0">
                                        <a href="#" className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-white hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 sm:w-auto">
                                            <svg className="ml-3 h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                                            <div className="text-right">
                                                <div className="mb-1 text-xs">حمّل على</div>
                                                <div className="-mt-1 text-sm font-semibold">Google Play</div>
                                            </div>
                                        </a>

                                        <a href="#" className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-white hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 sm:w-auto">
                                            <img src={appleLogo} className="ml-3 h-9 w-9" alt="" />
                                            <div className="text-right">
                                                <div className="mb-1 text-xs">حمّل على</div>
                                                <div className="-mt-1 text-sm font-semibold">App Store</div>
                                            </div>
                                        </a>
                                    </div>
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