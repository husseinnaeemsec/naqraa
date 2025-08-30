import { useState } from "react";

const coursesData = [
  {
    id: 1,
    title: "رياضيات متقدمة",
    subject: "الرياضيات",
    level: "متوسط",
    instructor: "الأستاذ علي",
    description: "دورة شاملة لتقوية مهارات الرياضيات.",
  },
  {
    id: 2,
    title: "مقدمة في الفيزياء",
    subject: "الفيزياء",
    level: "مبتدئ",
    instructor: "الأستاذة ليلى",
    description: "تعرف على أساسيات الفيزياء بطريقة ممتعة.",
  },
  {
    id: 1,
    title: "رياضيات متقدمة",
    subject: "الرياضيات",
    level: "متوسط",
    instructor: "الأستاذ علي",
    description: "دورة شاملة لتقوية مهارات الرياضيات.",
  },
  {
    id: 2,
    title: "مقدمة في الفيزياء",
    subject: "الفيزياء",
    level: "مبتدئ",
    instructor: "الأستاذة ليلى",
    description: "تعرف على أساسيات الفيزياء بطريقة ممتعة.",
  },
  {
    id: 1,
    title: "رياضيات متقدمة",
    subject: "الرياضيات",
    level: "متوسط",
    instructor: "الأستاذ علي",
    description: "دورة شاملة لتقوية مهارات الرياضيات.",
  },
  {
    id: 2,
    title: "مقدمة في الفيزياء",
    subject: "الفيزياء",
    level: "مبتدئ",
    instructor: "الأستاذة ليلى",
    description: "تعرف على أساسيات الفيزياء بطريقة ممتعة.",
  },
  {
    id: 1,
    title: "رياضيات متقدمة",
    subject: "الرياضيات",
    level: "متوسط",
    instructor: "الأستاذ علي",
    description: "دورة شاملة لتقوية مهارات الرياضيات.",
  },
  {
    id: 2,
    title: "مقدمة في الفيزياء",
    subject: "الفيزياء",
    level: "مبتدئ",
    instructor: "الأستاذة ليلى",
    description: "تعرف على أساسيات الفيزياء بطريقة ممتعة.",
  },
  // Add more courses here
];

const subjects = ["الرياضيات", "الفيزياء", "الكيمياء", "الأحياء"];
const levels = ["مبتدئ", "متوسط", "متقدم"];

export default function CourseList() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch = course.title.includes(search) || course.instructor.includes(search);
    const matchesSubject = selectedSubject ? course.subject === selectedSubject : true;
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    return matchesSearch && matchesSubject && matchesLevel;
  });

  return (
    <div>
      <h1 className="text-3xl px-6 font-bold text-center"> قائمة الدورات </h1>
      <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8">
        {/* Sidebar */}
        <aside className="w-full h-fit top-0 sticky md:w-64 bg-white p-4 rounded-lg shadow-md flex-shrink-0">
          <h2 className="text-lg font-semibold mb-4">فلترة الدورات</h2>

          <input
            type="text"
            placeholder="ابحث عن دورة أو مدرب"
            className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="mb-4">
            <label className="block font-medium mb-2">المادة</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">كل المواد</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">المستوى</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">كل المستويات</option>
              {levels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* Course List */}
        <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">المادة: {course.subject}</p>
                  <p className="text-sm text-gray-500 mb-2">المستوى: {course.level}</p>
                  <p className="text-sm text-gray-500 mb-2">المدرب: {course.instructor}</p>
                  <p className="text-sm text-gray-600">{course.description}</p>
                </div>
                <button className="mt-4 bg-emerald-400 text-white py-2 px-4 rounded-md hover:bg-emerald-500 transition-colors">
                  مشاهدة الدورة
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">لا توجد دورات مطابقة للبحث</p>
          )}
        </main>
      </div>
    </div>
  );
}
