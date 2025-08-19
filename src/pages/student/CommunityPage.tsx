// Community Page Component
const CommunityPage = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-emerald-800">المجتمعات</h1>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    انضم إلى مجتمع جديد
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { name: 'طلاب الرياضيات', members: 124, description: 'مجتمع للطلاب المهتمين بالرياضيات' },
                    { name: 'القراءة والمطالعة', members: 89, description: 'مجتمع لمحبي القراءة والكتاب' },
                    { name: 'التطوير الذاتي', members: 67, description: 'مجتمع للتطوير الشخصي والمهني' }
                ].map((community, index) => (
                    <div
                        key={index}
                        className="bg-white border border-emerald-300 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                        <h3 className="font-bold text-emerald-800 mb-2">{community.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{community.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-emerald-600">{community.members} عضو</span>
                            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                                الانضمام
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommunityPage;