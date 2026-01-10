import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import Card from "./ui/CustomCard";

export default function WeeklyStudyChart() {
    const { t } = useTranslation();

    return (
        <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{t('dashboard_index.weekly_study_hours')}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard_index.study_time_this_week')}</p>
                </div>
                <TrendingUp className="size-5 text-emerald-600" />
            </div>
            
            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-48">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
                    const height = Math.random() * 100 + 20;
                    return (
                        <div key={day} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden flex items-end" style={{ height: '100%' }}>
                                <div 
                                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:from-emerald-600 hover:to-emerald-500"
                                    style={{ height: `${height}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{day}</span>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
