import Card from "./ui/CustomCard";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    change: string;
    icon: LucideIcon;
    color: 'emerald' | 'blue' | 'orange' | 'purple';
}

export default function StatCard({ label, value, change, icon: Icon, color }: StatCardProps) {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg`}>
                    <Icon className={`size-5 text-${color}-600 dark:text-${color}-400`} />
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{change}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{value}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </Card>
    );
}
