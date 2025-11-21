"use client";

import { BarChart, Bar, XAxis, CartesianGrid, Cell } from "recharts";
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



export interface StudySession {
  study_time_in_sec: number;
  is_today: boolean;
  date: string;
  day_info: {
    name: string;
    number: number;
  };
}

export interface StudyTimeWeek {
  sunday: StudySession | null;
  monday: StudySession | null;
  tuesday: StudySession | null;
  wednesday: StudySession | null;
  thursday: StudySession | null;
  friday: StudySession | null;
  saturday: StudySession | null;
}

export interface StudyTimeWeek {
  sunday: StudySession | null;
  monday: StudySession | null;
  tuesday: StudySession | null;
  wednesday: StudySession | null;
  thursday: StudySession | null;
  friday: StudySession | null;
  saturday: StudySession | null;
}


interface StudyHoursChartWidgetProps {
  weekData: StudyTimeWeek|null|undefined;
}




// Chart configuration will be created inside component to access t() function

// Helper to convert seconds → hours (1 decimal)
function secondsToHours(seconds: number): number {
  return Math.round((seconds / 3600) * 10) / 10;
}

export default function StudyHoursChartWidget({ weekData }: StudyHoursChartWidgetProps) {
  const { t } = useTranslation();

  // Day order and translation keys
  const weekDayOrder = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  const weekDayLabels = [
    "study_chart.days.sunday",
    "study_chart.days.monday",
    "study_chart.days.tuesday",
    "study_chart.days.wednesday",
    "study_chart.days.thursday",
    "study_chart.days.friday",
    "study_chart.days.saturday",
  ];

  // Transform StudyTimeWeek object to array in correct order, fill nulls
  const data: { day: string; hours: number; is_today?: boolean }[] = weekDayOrder.map((day, idx) => {
    const session = weekData && weekData[day as keyof StudyTimeWeek] ? weekData[day as keyof StudyTimeWeek] : {
      study_time_in_sec: 0,
      is_today: false,
      date: '',
      day_info: { name: '', number: idx },
    };
    return {
      day: t(weekDayLabels[idx]),
      hours: session && session.study_time_in_sec ? secondsToHours(session.study_time_in_sec) : 0,
      is_today: session ? session.is_today : false,
    };
  });

  // Chart configuration with translation
  const chartConfig = {
    hours: {
      label: t('study_chart.hours_label'),
      color: "hsl(var(--emerald-600))",
    },
  };

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
              radius={[3, 3, 0, 0]}
              className="transition-colors"
              fill="#10b981"
              >
              {
                data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.is_today ? "#065f46" : "#10b981"} />
                ))
              }
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
