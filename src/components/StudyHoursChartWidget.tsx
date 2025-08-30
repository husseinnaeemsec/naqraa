import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StudyHoursChart() {
  const studyData = [2, 4, 1.5, 3, 2.5, 4.5, 3];

  // Detect theme from HTML tag (user preference)
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const htmlEl = document.documentElement;
    setIsDark(htmlEl.classList.contains("dark"));
  }, []);

  const getHoverColor = (value) => {
    if (value < 2) return "rgba(244, 63, 94, 0.8)"; // rose
    if (value < 4) return isDark ? "rgba(148,163,184,0.9)" : "rgba(100,116,139,0.9)"; // slate
    return "rgba(5, 150, 105, 0.85)"; // emerald
  };

  const data = {
    labels: ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
    datasets: [
      {
        label: "ساعات الدراسة",
        data: studyData,
        backgroundColor: isDark ? "rgba(148,163,184,0.6)" : "rgba(100,116,139,0.7)", // default slate
        hoverBackgroundColor: (ctx) => getHoverColor(ctx.raw),
        borderRadius: 6,
        barThickness: 18,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        titleColor: isDark ? "#f0fdf4" : "#111827",
        bodyColor: isDark ? "#f0fdf4" : "#111827",
        callbacks: { label: (ctx) => `${ctx.parsed.y} ساعات` },
      },
      title: { display: false },
    },
    scales: {
      x: {
        ticks: { color: isDark ? "#f0fdf4" : "#374151", font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: isDark ? "#f0fdf4" : "#374151",
          callback: (value) => `${value} س`,
        },
        grid: { color: isDark ? "rgba(100,116,139,0.2)" : "#e5e7eb" },
      },
    },
  };

  return (
    <div className="w-full bg-white dark:bg-emerald-950/50 dashboard-box p-4 rounded-xl">
      <h1 className="text-xl font-bold mb-2 dark:text-emerald-50 text-slate-700">
        عدد ساعات الدراسة الأسبوعي
      </h1>
      <Bar data={data} options={options} className="max-h-full max-w-full" />
    </div>
  );
}
