import { useState } from "react";

const FilesPage = () => {
    const [files] = useState([
        { name: "مشروع الرياضيات", type: "PDF", size: "2.1 MB", date: "15 أبريل 2026" },
        { name: "مذكرة اللغة العربية", type: "DOCX", size: "1.5 MB", date: "10 أبريل 2026" },
        { name: "عرض تقديمي للعلوم", type: "PPTX", size: "3.2 MB", date: "5 أبريل 2026" },
        { name: "مذكرة التاريخ", type: "PDF", size: "1.8 MB", date: "1 أبريل 2026" },
        { name: "مذكرة الجغرافيا", type: "DOCX", size: "2.3 MB", date: "28 مارس 2026" },
        { name: "مذكرة الكيمياء", type: "PDF", size: "1.9 MB", date: "22 مارس 2026" },
    ]);

    return (
        <div className="p-6">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold text-gray-800">الملفات</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                    + تحميل ملف جديد
                </button>
            </div>

            {/* Files Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {files.map((file, idx) => (
                    <div
                        key={idx}
                        className="group border rounded-lg p-4 bg-white hover:shadow-md hover:bg-gray-50 cursor-pointer transition"
                    >
                        {/* File Icon */}
                        <div className="flex justify-center mb-3">
                            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg group-hover:bg-gray-200">
                                <svg
                                    className="w-6 h-6 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* File Info */}
                        <div className="text-center">
                            <p className="font-medium text-sm text-gray-800 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{file.type} • {file.size}</p>
                            <p className="text-[11px] text-gray-400 mt-1">{file.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilesPage;
