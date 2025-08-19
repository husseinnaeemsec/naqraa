// Exams Page Component
const ExamsPage = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-emerald-800">الاختبارات</h1>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    جدول الاختبارات
                </button>
            </div>

            <div className="bg-white border border-emerald-300 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold text-emerald-800 mb-6">جدول الاختبارات القادم</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-emerald-200">
                                <th className="text-left py-3 px-4 font-medium">الاختبار</th>
                                <th className="text-left py-3 px-4 font-medium">الموعد</th>
                                <th className="text-left py-3 px-4 font-medium">الدرجة</th>
                                <th className="text-left py-3 px-4 font-medium">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-emerald-100 hover:bg-emerald-50 transition-colors">
                                <td className="py-3 px-4">امتحان الرياضيات</td>
                                <td className="py-3 px-4">20/4/2026</td>
                                <td className="py-3 px-4">85%</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">مكتمل</span>
                                </td>
                            </tr>
                            <tr className="border-b border-emerald-100 hover:bg-emerald-50 transition-colors">
                                <td className="py-3 px-4">امتحان اللغة العربية</td>
                                <td className="py-3 px-4">25/4/2026</td>
                                <td className="py-3 px-4">-</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">مقبل</span>
                                </td>
                            </tr>
                            <tr className="border-b border-emerald-100 hover:bg-emerald-50 transition-colors">
                                <td className="py-3 px-4">امتحان العلوم</td>
                                <td className="py-3 px-4">30/4/2026</td>
                                <td className="py-3 px-4">-</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">مقبل</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExamsPage;