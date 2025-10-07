export default function Features() {
  return (
    <section className="grid  lg:grid-cols-4 gap-6 lg:gap-10 items-center max-w-7xl mx-auto p-5 lg:p-10">
      {/* ===== Left column (intro + call to action) ===== */}
      <div className="space-y-4">

        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 leading-snug">
          كل ما يحتاجه الطالب العراقي في مكان واحد
        </h2>

        {/* Subtext */}
        <p className="text-slate-600 text-base leading-relaxed">
          نوفر لك الدروس، الأدوات، والمجتمعات التعليمية التي تساعدك على فهم أعمق،
          وتعلم أسرع، وتجربة دراسية ممتعة ومجانية بالكامل.
        </p>

        {/* Button */}
        <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition">
          ابدأ الآن
        </button>
      </div>

      {/* ===== Right column (feature cards grid) ===== */}
      <div className="lg:col-span-3 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        {/* Placeholder feature cards */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl  border border-slate-100 p-4 hover:shadow-md hover:-translate-y-1 transition"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-lg mb-3"></div>
            <h3 className="font-semibold text-slate-800 mb-1">ميزة {i + 1}</h3>
            <p className="text-sm text-slate-600 leading-snug">
              وصف بسيط للميزة وكيف تساعد الطالب في تحسين تجربته التعليمية.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
