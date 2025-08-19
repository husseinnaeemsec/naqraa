// Classroom Page Component
const ClassroomPage = () => {
    const courseModules = [
        {
            id: 1,
            title: 'مقدمة في الجبر',
            description: 'تعلم أساسيات الجبر وحل المعادلات الخطية',
            progress: 75,
            completed: false
        },
        {
            id: 2,
            title: 'الهندسة الأساسية',
            description: 'استكشاف الأشكال الهندسية والزوايا',
            progress: 100,
            completed: true
        },
        {
            id: 3,
            title: 'الإحصاء والاحتمالات',
            description: 'فهم البيانات والتحليل الإحصائي',
            progress: 40,
            completed: false
        },
        {
            id: 4,
            title: 'حساب التفاضل',
            description: 'مقدمة في المشتقات وتطبيقاتها',
            progress: 20,
            completed: false
        }
    ];

    return (
        <div className="space-y-8 h-screen  container mx-auto overflow-y-auto">
            <div className="bg-white max-h-full overflow-y-auto rounded-lg p-6 space-y-5">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-emerald-800">فصل الدراسة</h1>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                            متابعة الدرس
                        </button>
                        <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                            قائمة الدروس
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_25%] gap-5">
                    {/* Course content */}
                    <div>
                        <div className="bg-gray-100 aspect-video rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-16 h-16 text-emerald-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-emerald-600 font-medium">مشغل الفيديو</p>
                                <p className="text-sm text-emerald-500 mt-1">سيتم عرض الدرس هنا</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-emerald-800 mb-3">مقدمة في الجبر</h3>
                            <p className="text-gray-600 mb-4">
                                في هذا الدرس، ستتعلم أساسيات الجبر وكيفية حل المعادلات الخطية. سنغطي المتغيرات، المعاملات،
                                والمعادلات البسيطة مع أمثلة عملية.
                            </p>

                            <div className="flex space-x-2">
                                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                                    تشغيل
                                </button>
                                <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                                    إضافة إلى قائمة الانتظار
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-emerald-800 mb-4">محتوى الدورة</h3>
                        <div className="space-y-3">
                            {courseModules.map((module) => (
                                <div
                                    key={module.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${module.completed
                                        ? 'border-emerald-300 bg-emerald-50'
                                        : 'border-gray-200 hover:border-emerald-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-emerald-800">{module.title}</h4>
                                        {module.completed && (
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${module.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{module.progress}% مكتمل</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomPage;