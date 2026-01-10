import { Link } from "react-router-dom";
import { Calendar, Activity, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import Card from "./ui/CustomCard";

export default function QuickActionsWidget() {
    const { t } = useTranslation();

    const actions = [
        { icon: Calendar, label: t('dashboard_index.view_timetable'), link: '/dashboard/timetable', color: 'blue' },
        { icon: Activity, label: t('dashboard_index.check_attendance'), link: '/dashboard/attendance', color: 'emerald' },
        { icon: Bell, label: t('dashboard_index.notifications'), link: '/dashboard/notifications', color: 'purple' }
    ];

    return (
        <Card className="lg:col-span-3 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">{t('dashboard_index.quick_actions')}</h3>
            <div className="space-y-2">
                {actions.map((action, i) => (
                    <Link
                        key={i}
                        to={action.link}
                        className={`flex items-center gap-3 p-3 rounded-lg bg-${action.color}-50 dark:bg-${action.color}-900/20 hover:bg-${action.color}-100 dark:hover:bg-${action.color}-900/30 transition-colors group`}
                    >
                        <action.icon className={`size-4 text-${action.color}-600 dark:text-${action.color}-400`} />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{action.label}</span>
                    </Link>
                ))}
            </div>
        </Card>
    );
}
