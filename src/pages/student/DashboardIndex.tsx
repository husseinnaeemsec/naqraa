import { Clock, CheckCircle, Edit } from "lucide-react";

const IndexPage = () => {
    const courses = [
        { id: 1, title: 'الفن الحديث', instructor: 'الأستاذة أليشيا ماير', level: 'مبتدئ', progress: 75, image: 'https://placehold.co/300x200' },
        { id: 2, title: 'التخطيط', instructor: 'مايك ديكنز', level: 'متقدم', progress: 30, image: 'https://placehold.co/300x200' },
        { id: 3, title: 'الخط العربي', instructor: 'محمود موابي', level: 'معتمد', progress: 100, image: 'https://placehold.co/300x200' }
    ];

    const assignments = [
        { id: 1, title: 'مناقشة حفل الجوائز', duration: '02 س 45 د', date: '20 يونيو 2024، 12:30 ص', status: 'قيد الانتظار' },
        { id: 2, title: 'الدوائر والبيضات', description: 'يجب أن تختلف أحجام دوائرك وبيضاتك في الحجم والزوايا والانفتاح.', dueDate: '15 يوليو 2024', level: 'المستوى 42', image: 'https://placehold.co/60x60' }
    ];

    const homeTasks = [
        { id: 1, title: 'الملمس والتفاصيل', description: 'كيفية تحليل ورسم أي موضوع عن طريق تبسيطه إلى أشكال أساسية.', dueDate: '20 يونيو 2024', priority: 'عالي', image: 'https://placehold.co/60x60' },
        { id: 2, title: 'تاريخ التصميم', description: 'تقنيات التوضيح', dueDate: '15 يوليو 2024', priority: 'منخفض', image: 'https://placehold.co/60x60' }
    ];

    const schedule = [
        { time: '12:00', event: 'التخطيط', details: 'الفصل الدراسي الثاني لتصميم الجرافيك' },
        { time: '14:30', event: 'تاريخ الفن', details: 'الفصل الدراسي الثاني لتصميم الجرافيك' }
    ];

    const reminders = [
        { icon: '🎨', text: 'الفن - إرسال الاختبار', date: '18 يونيو 2024، الجمعة' }
    ];

    return (
        <div className="bg-white font-mono min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Courses */}
                        <div className="border-2 border-b-4 border-l-4 border-emerald-800 rounded-lg p-6 ">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-emerald-900">دوراتي</h2>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-emerald-700">الكل</span>
                                    <span className="text-sm text-emerald-700">نشط</span>
                                    <span className="text-sm text-emerald-700">مكتمل</span>
                                    <button className="text-sm bg-emerald-700 text-emerald-50 px-2 py-1 rounded hover:bg-emerald-800">عرض الكل</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courses.map((course) => (
                                    <div key={course.id} className="border-2 border-emerald-800 rounded-lg p-4 hover:shadow-xl transition-shadow bg-emerald-50">
                                        <div className="flex items-center justify-between mb-3">
                                            <img src={course.image} alt={course.title} className="w-12 h-12 rounded-lg object-cover border-2 border-emerald-800" />
                                            <div className="text-xs text-emerald-800">{course.level}</div>
                                        </div>
                                        <h3 className="font-bold text-emerald-900 mb-1">{course.title}</h3>
                                        <p className="text-sm text-emerald-700 mb-3">{course.instructor}</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-emerald-700">التقدم</span>
                                                <span className="font-bold">{course.progress}%</span>
                                            </div>
                                            <div className="w-full bg-emerald-200 rounded-full h-2">
                                                <div className="bg-emerald-700 h-2 rounded-full transition-all duration-300" style={{ width: `${course.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Assignments */}
                        <div className="border-2 border-b-4 border-l-4 border-emerald-800 rounded-lg p-6 ">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-emerald-900">الواجبات</h2>
                                <div className="flex items-center space-x-2">
                                    <button className="text-sm text-emerald-800 hover:text-emerald-900">مشاركة</button>
                                    <button className="text-sm text-emerald-800 hover:text-emerald-900">أعلى</button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {assignments.map((assignment) => (
                                    <div key={assignment.id} className="flex items-center justify-between p-4 border-2 border-emerald-800 rounded-lg hover:bg-emerald-50 transition-colors bg-emerald-100">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-emerald-200 rounded-lg flex items-center justify-center border-2 border-emerald-800">
                                                <CheckCircle size={16} className="text-emerald-700" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-emerald-900">{assignment.title}</h3>
                                                <p className="text-sm text-emerald-700">{assignment.duration}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <button className="text-sm text-emerald-800 hover:text-emerald-900">إعادة الجدولة</button>
                                            <button className="px-4 py-1 bg-emerald-700 text-emerald-50 rounded hover:bg-emerald-800 transition-colors">
                                                قبول الدعوة
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Home Tasks */}
                        <div className="border-2 border-b-4 border-l-4 border-emerald-800 rounded-lg p-6 ">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-emerald-900">المهام المنزلية</h2>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-emerald-700">اليوم</span>
                                    <button className="text-sm bg-emerald-700 text-emerald-50 px-2 py-1 rounded hover:bg-emerald-800">إضافة جديد</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {homeTasks.map((task) => (
                                    <div key={task.id} className="border-2 border-emerald-800 rounded-lg p-4 hover:shadow-xl transition-shadow bg-emerald-50">
                                        <div className="flex items-center justify-between mb-3">
                                            <img src={task.image} alt={task.title} className="w-10 h-10 rounded-lg object-cover border-2 border-emerald-800" />
                                            <div className={`text-xs px-2 py-1 rounded ${task.priority === 'عالي' ? 'bg-emerald-300 text-emerald-900' : 'bg-emerald-200 text-emerald-700'}`}>
                                                {task.priority}
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-emerald-900 mb-1">{task.title}</h3>
                                        <p className="text-sm text-emerald-700 mb-3">{task.description}</p>
                                        <div className="flex items-center space-x-2">
                                            <Clock size={14} className="text-emerald-700" />
                                            <span className="text-sm text-emerald-700">{task.dueDate}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Profile */}
                        <div className="border-2 border-b-4 border-l-4 border-emerald-800 rounded-lg p-6 ">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-emerald-900">الملف الشخصي</h2>
                                <button className="p-1 text-emerald-600 hover:text-emerald-800">
                                    <Edit size={16} />
                                </button>
                            </div>
                            <div className="flex items-center space-x-4 mb-4">
                                <img src="https://placehold.co/60x60" alt="Profile" className="w-16 h-16 rounded-full border-2 border-emerald-800 object-cover" />
                                <div>
                                    <h3 className="font-bold text-emerald-900">ميليسا أندرسون</h3>
                                    <p className="text-sm text-emerald-700">mel.anderson@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="border-2 border-b-4 border-l-4 border-emerald-800 rounded-lg p-6 ">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-emerald-900">الجدول</h2>
                                <button className="text-sm bg-emerald-700 text-emerald-50 px-2 py-1 rounded hover:bg-emerald-800">عرض الكل</button>
                            </div>
                            <div className="space-y-3">
                                {schedule.map((item, index) => (
                                    <div key={index} className="bg-emerald-50 rounded-lg p-3 border-2 border-emerald-800">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-emerald-800">{item.time}</span>
                                            <span className="text-xs text-emerald-700">{item.event}</span>
                                        </div>
                                        <p className="text-xs text-emerald-700">{item.details}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reminders */}
                        <div className="border-2 border-b-4 border-l-4 border-emerald-800 rounded-lg p-6 ">
                            <h2 className="text-lg font-bold text-emerald-900 mb-4">التذكيرات</h2>
                            <div className="space-y-3">
                                {reminders.map((reminder, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg border-2 border-emerald-800">
                                        <span className="text-lg">{reminder.icon}</span>
                                        <div>
                                            <p className="font-bold text-emerald-900">{reminder.text}</p>
                                            <p className="text-xs text-emerald-700">{reminder.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndexPage;
