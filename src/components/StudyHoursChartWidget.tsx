"use client";

import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const data = [
  { day: "السبت", hours: 2 },
  { day: "الأحد", hours: 4 },
  { day: "الإثنين", hours: 1.5 },
  { day: "الثلاثاء", hours: 3 },
  { day: "الأربعاء", hours: 2.5 },
  { day: "الخميس", hours: 4.5 },
  { day: "الجمعة", hours: 3 },
];

const chartConfig = {
  hours: {
    label: "ساعات الدراسة",
    color: "var(--chart-2)", // you can use a CSS variable like "var(--chart-1)" too
  },
} 

export default function StudyHoursChartShadcn() {
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
