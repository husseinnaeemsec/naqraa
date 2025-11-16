"use client";

import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import { useTranslation } from "react-i18next";
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

// Chart configuration will be created inside component to access t() function

// 🧠 Helper to convert seconds → hours (1 decimal)
function secondsToHours(seconds: number): number {
  return Math.round((seconds / 3600) * 10) / 10;
}

export default function StudyHoursChartShadcn({ weekData }: Props) {
  const { t } = useTranslation();
  
  // Day order with translation keys
  const weekDays: { key: keyof StudyTimeWeek; labelKey: string }[] = [
    { key: "saturday", labelKey: "study_chart.days.saturday" },
    { key: "sunday", labelKey: "study_chart.days.sunday" },
    { key: "monday", labelKey: "study_chart.days.monday" },
    { key: "tuesday", labelKey: "study_chart.days.tuesday" },
    { key: "wednesday", labelKey: "study_chart.days.wednesday" },
    { key: "thursday", labelKey: "study_chart.days.thursday" },
    { key: "friday", labelKey: "study_chart.days.friday" },
  ];
  
  if(!weekData) return;

  // Chart configuration with translation
  const chartConfig = {
    hours: {
      label: t('study_chart.hours_label'),
      color: "hsl(var(--emerald-600))",
    },
  };

  // Prepare chart data
  const data = weekDays.map((d) => ({
    day: t(d.labelKey),
    hours: weekData[d.key]
      ? secondsToHours(weekData[d.key]!.study_time_in_sec)
      : 0,
  }));

  return (
    <Card className="w-full bg-white dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-900 dark:text-emerald-50 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          {t('study_chart.title')}
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
