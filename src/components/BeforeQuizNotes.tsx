export default function BeforeQuizNotes( { setShowNotes } : { setShowNotes:(value:boolean)=> void } ) {
    return (
        <div className="p-6 max-w-3xl w-full space-y-5 dark:bg-emerald-800 bg-white border-2 border-b-4 border-l-4 rounded-xl shadow">
            <h1 className="text-amber-600 dark:text-amber-400 text-2xl font-bold">ملاحظات مهمة قبل بدأ الاختبار</h1>
            <ol className="space-y-3 list-decimal pr-4">
                <li className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="bg-sky-100 flex items-center gap-2 p-2 border-2 border-sky-700 text-sky-800 border-b-4 border-l-4 rounded-md">
                        <i className="text-base fi fi-rr-globe"></i>
                        تأكد من ان يكون اتصالك بالانترنت مستقر 
                    </span>
                </li>
                <li className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-base">عند الضغط على</span>
                    <button className="w-fit p-2 bg-emerald-100 text-emerald-900 border-2 border-b-4 border-l-4 rounded-md">
                        ابدأ الاختبار
                    </button>
                    <span className="bg-rose-100 p-2 border-2 border-rose-700 text-rose-800 border-b-4 border-l-4 rounded-md">
                        يمنع مغادرة أو تغيير الصفحة أثناء الاختبار
                    </span>
                </li>
                <li className="text-sm flex flex-wrap gap-2">
                    <span>لا يمكنك الرجوع إلى الأسئلة السابقة بعد الانتقال للسؤال التالي.</span>
                    <span className="bg-yellow-100 p-1 border-2 border-yellow-700 text-yellow-800 border-b-4 border-l-4 rounded-md">
                        احرص على الإجابة بدقة
                    </span>
                </li>
                <li className="text-sm flex flex-wrap gap-2">
                    <span>سيتم احتساب الوقت الذي استغرقته لإكمال الاختبار.</span>
                    <span className="bg-emerald-100 p-1 border-2 border-emerald-700 text-emerald-900 border-b-4 border-l-4 rounded-md">
                        لا تستعجل في الاجابة حيث ان الوقت المستغرق لاخذ الاختبار غير مهم
                    </span>
                </li>
                <li className="text-sm flex flex-wrap gap-2">
                    <span>في حالة مغادرة الصفحة أو تقليل التبويب، سيتم اعتبارك راسبًا.</span>
                    <span className="bg-rose-100 p-1 border-2 border-rose-700 text-rose-800 border-b-4 border-l-4 rounded-md">
                        لا تحاول الغش أو تبديل التبويبات
                    </span>
                </li>
            </ol>
            <button
                onClick={() => setShowNotes(false)}
                className="w-full p-3 bg-emerald-100 text-emerald-900 font-bold border-2 border-b-4 border-l-4 rounded-md hover:bg-emerald-200"
            >
                فهمت
            </button>
        </div>
    )
}
