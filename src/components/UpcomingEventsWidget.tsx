import { Calendar, Plus, MoreVertical } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "./ui/CustomCard";
import CustomContextMenu from "./ui/CustomContextMenu";
import { getNewTaskInitialDataQuery } from "../utils/functions";
import { type Event } from "../types/core";
import { endpoints } from "../api/routes";
import apiClient from "../api/client";
import Spinner from "./Spinner";

export default function UpcomingEventsWidget() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await apiClient.get<Event[]>(endpoints.student.upcomingEvents);
                setEvents(response.data);
            } catch (error:any) {
                console.error("Failed to fetch events:", error);
                setError(t('dashboard_index.failed_to_fetch_events'));
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleAddTask = (eventTitle: string, _eventDate: string) => {
        
        const link = getNewTaskInitialDataQuery(eventTitle, 'high', 'true');
        navigate(link);
    };

    const formatEventDate = (startTime: string | null) => {
        if (!startTime) return t('dashboard_index.no_date');
        
        const eventDate = new Date(startTime);
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const isToday = eventDate.toDateString() === now.toDateString();
        const isTomorrow = eventDate.toDateString() === tomorrow.toDateString();
        
        const timeString = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        if (isToday) {
            return `${t('dashboard_index.today')}, ${timeString}`;
        } else if (isTomorrow) {
            return `${t('dashboard_index.tomorrow')}, ${timeString}`;
        } else {
            return eventDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + `, ${timeString}`;
        }
    };

    return (
        <Card className="lg:col-span-4 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Calendar className="size-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{t('dashboard_index.upcoming')}</h3>
                        <p className="text-xs text-slate-500">{t('dashboard_index.next_days', { count: 7 })}</p>
                    </div>
                </div>
            </div>
            
            <div className="space-y-2">
                {loading ? (
                    <Spinner className="border-orange-500" />
                ) : events.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard_index.no_upcoming_events')}</p>
                    </div>
                ) : (
                    events.map((event, i) => (
                        <CustomContextMenu
                            key={i}
                            actions={[
                                {
                                    label: t('dashboard_index.add_as_task'),
                                    icon: <Plus className="w-4 h-4" />,
                                    onClick: () => handleAddTask(event.title, event.due_date || '')
                                }
                            ]}
                            trigger={
                                <button 
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    <MoreVertical className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                </button>
                            }
                            className="flex items-center gap-3"
                        >
                            <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                                <div className="size-2 bg-orange-500 rounded-full"></div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">{event.title}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatEventDate(event.due_date)}</p>
                                </div>
                            </div>
                        </CustomContextMenu>
                    ))
                )}
            </div>
        </Card>
    );
}
