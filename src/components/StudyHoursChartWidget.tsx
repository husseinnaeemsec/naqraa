"use client";

import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import type { StudyTimeWeek } from "../../types";

export interface StudySession {
  study_time_in_sec: number;
  is_today: boolean;
  date: string;
  day_info: {
    name: string;
    number: number;
  };
}



interface Props {
  weekData: StudyTimeWeek | null;
}

const chartConfig = {
  hours: {
    label: "ساعات الدراسة",
    color: "hsl(var(--emerald-600))",
  },
};

// 🧠 Helper to convert seconds → hours (1 decimal)
function secondsToHours(seconds: number): number {
  return Math.round((seconds / 3600) * 10) / 10;
}

export default function StudyHoursChartShadcn({ weekData }: Props) {
  // Arabic day order: Saturday → Friday
  const arabicDays: { key: keyof StudyTimeWeek; label: string }[] = [
    { key: "saturday", label: "السبت" },
    { key: "sunday", label: "الأحد" },
    { key: "monday", label: "الإثنين" },
    { key: "tuesday", label: "الثلاثاء" },
    { key: "wednesday", label: "الأربعاء" },
    { key: "thursday", label: "الخميس" },
    { key: "friday", label: "الجمعة" },
  ];
  
  if(!weekData) return;

  // Prepare chart data
  const data = arabicDays.map((d) => ({
    day: d.label,
    hours: weekData[d.key]
      ? secondsToHours(weekData[d.key]!.study_time_in_sec)
      : 0,
  }));

  return (
    <Card className="w-full bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-900 dark:text-emerald-50 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          عدد ساعات الدراسة الأسبوعي
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#6b7280', fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey="hours" 
              fill="#10b981" 
              radius={[3, 3, 0, 0]}
              className="fill-emerald-500 hover:fill-emerald-600 transition-colors"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
