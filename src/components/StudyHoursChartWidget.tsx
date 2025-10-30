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
    color: "var(--chart-1)",
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold dark:text-emerald-50">
          عدد ساعات الدراسة الأسبوعي
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="hours" fill="var(--chart-1)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
