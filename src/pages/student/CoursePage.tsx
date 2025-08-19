// Courses Page Component
const CoursesPage = () => {
    const courses = [
        {
            id: 1,
            title: 'الرياضيات',
            description: 'دورة شاملة لتعليم أساسيات الرياضيات من الجمع والطرح إلى الجبر والهندسة، مع أمثلة وتمارين تطبيقية.',
            image: 'https://placehold.co/300x300/10b981/ffffff?text=رياضيات',
            status: 'جاري التعلم'
        },
        {
            id: 2,
            title: 'اللغة الإنجليزية',
            description: 'تحسين مهارات القراءة والكتابة والتحدث باللغة الإنجليزية',
            image: 'https://placehold.co/300x300/10b981/ffffff?text=إنجليزية',
            status: 'مكتمل'
        }
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-emerald-800">المحاضرات</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white border border-emerald-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                        <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="font-bold text-emerald-800 mb-2">{course.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                            <div className="flex justify-between items-center">
                                <span className={`text-xs px-2 py-1 rounded ${course.status === 'مكتمل' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {course.status}
                                </span>
                                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                                    بدء التعلم
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursesPage;