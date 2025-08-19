
// Chat Page Component
const ChatPage = () => {
    const chatUsers = [
        { name: 'أحمد عبد الله', online: true },
        { name: 'سارة محمد', online: false },
        { name: 'ياسر كريم', online: true },
        { name: 'لينا محمود', online: false },
        { name: 'عبد الرحمن أحمد', online: true }
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-emerald-800">الدردشة</h1>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    ابحث عن جهة اتصال...
                </button>
            </div>

            <div className="flex flex-col h-[calc(100vh-200px)]">
                <div className="flex-1 flex">
                    <div className="w-1/3 bg-emerald-50 border-r border-emerald-300">
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-emerald-800 mb-4">الدردشات</h2>
                            <div className="space-y-2">
                                {chatUsers.map((user, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3 p-3 hover:bg-emerald-100 rounded-lg cursor-pointer transition-colors"
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.online ? 'bg-green-500' : 'bg-gray-300'
                                            }`}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-emerald-800">{user.name}</div>
                                            <div className={`text-xs ${user.online ? 'text-green-600' : 'text-gray-500'}`}>
                                                {user.online ? 'متصل الآن' : 'غير متصل'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-2/3 bg-white border-l border-emerald-300 flex flex-col">
                        <div className="p-4 border-b border-emerald-200">
                            <h2 className="text-lg font-semibold text-emerald-800">محادثة مع أحمد عبد الله</h2>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-4">
                                <div className="flex">
                                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white mr-3">
                                        A
                                    </div>
                                    <div className="bg-emerald-100 p-3 rounded-lg max-w-xs">
                                        <p className="text-emerald-800">مرحباً! كيف حالك اليوم؟</p>
                                        <p className="text-xs text-emerald-600 mt-1">10:30 صباحاً</p>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <div className="bg-emerald-600 text-white p-3 rounded-lg max-w-xs">
                                        <p>أنا بخير، شكرًا! أحاول إنهاء مشروع الرياضيات.</p>
                                        <p className="text-xs text-emerald-200 mt-1">10:32 صباحاً</p>
                                    </div>
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 ml-3">
                                        U
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white mr-3">
                                        A
                                    </div>
                                    <div className="bg-emerald-100 p-3 rounded-lg max-w-xs">
                                        <p className="text-emerald-800">أنا أتمنى لك التوفيق! هل تحتاج إلى مساعدة في أي شيء؟</p>
                                        <p className="text-xs text-emerald-600 mt-1">10:35 صباحاً</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-emerald-200">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="اكتب رسالتك..."
                                    className="flex-1 px-4 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;