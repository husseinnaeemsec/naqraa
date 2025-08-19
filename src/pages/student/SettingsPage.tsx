// Settings Page Component
const SettingsPage = () => {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-emerald-800">الإعدادات</h1>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    حفظ التغييرات
                </button>
            </div>

            <div className="bg-white border border-emerald-300 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold text-emerald-800 mb-6">معلومات الحساب</h2>

                <div className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-emerald-800 mb-2">الصورة الشخصية</label>
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                <span className="text-emerald-600 font-bold text-xl">M</span>
                            </div>
                            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                                تغيير الصورة
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-emerald-800 mb-2">الاسم الكامل</label>
                        <input
                            type="text"
                            defaultValue="محمد أحمد"
                            className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-emerald-800 mb-2">البريد الإلكتروني</label>
                        <input
                            type="email"
                            defaultValue="mohamed@example.com"
                            className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-emerald-800 mb-2">كلمة المرور</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SettingsPage;