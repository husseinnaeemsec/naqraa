import { CheckCircle2, Calendar, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import Card from "./ui/CustomCard";

export default function RecentActivityFeed() {
    const { t } = useTranslation();

    const activities = [
        { action: 'Completed assignment', subject: 'Mathematics', time: '2 hours ago', icon: CheckCircle2, color: 'emerald' },
        { action: 'Attended class', subject: 'Physics', time: '4 hours ago', icon: Calendar, color: 'blue' },
        { action: 'Earned points', subject: '+50 points', time: '1 day ago', icon: Award, color: 'purple' }
    ];

    return (
        <Card className="p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">{t('dashboard_index.recent_activity')}</h3>
            <div className="space-y-4">
                {activities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className={`p-2 bg-${activity.color}-100 dark:bg-${activity.color}-900/30 rounded-lg`}>
                            <activity.icon className={`size-4 text-${activity.color}-600 dark:text-${activity.color}-400`} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.action}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{activity.subject}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
