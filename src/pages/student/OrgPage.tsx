// Organization Page Component
const OrgPage = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-emerald-800">المؤسسة التعليمية</h1>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    التقارير
                </button>
            </div>

            <div className="bg-white border border-emerald-300 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold text-emerald-800 mb-6">التقارير الأكاديمية</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-r border-emerald-200 pr-6">
                        <h3 className="font-bold text-emerald-800 mb-4">الدرجات</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span>الرياضيات</span>
                                <span className="font-bold">85%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>اللغة العربية</span>
                                <span className="font-bold">92%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>العلوم</span>
                                <span className="font-bold">78%</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-emerald-800 mb-4">الإحصائيات</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span>المشاركة في الصف</span>
                                <span className="font-bold">95%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>الحضور</span>
                                <span className="font-bold">98%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>العمل الجماعي</span>
                                <span className="font-bold">89%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrgPage;