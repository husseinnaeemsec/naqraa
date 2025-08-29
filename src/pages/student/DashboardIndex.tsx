import LastWatchedCourseWidget from "../../components/LastWatchedCourseWidget";
import StudyHoursChart from "../../components/StudyHoursChartWidget";
import UpcomingExams from "../../components/UpcomingExamsWidget";
import RecentActivityWidget from "../../components/RecentActivityWidget";
import RecommendedCoursesWidget from "../../components/RecommendedCoursesWidget";
import TasksWidget from "../../components/TaskWidget";
import UsefulResourcesWidget from "../../components/UsefulResourcesWidget";
import UserProfileWidget from "../../components/UserProfileWidget";
import NotificationsWidget from "../../components/NotificationsWidget";
import OrganizationNotificationsWidget from "../../components/OrganizationNotificationsWidget";
import CalendarWidget from "../../components/CalendarWidget";
import TasksSidebarWidget from "../../components/TasksWidget";
import { useAppSelector } from "../../store/store";
import { Link } from "react-router-dom";
import {Helmet} from 'react-helmet'

const PlaceholderWidget = ({ text, className }: { text?: string; className?: string; }) => {

    return (
        <div className={` flex items-center justify-center ${className} `}>
            <h1> {text || 'Placeholder Text'} </h1>
        </div>
    )
}

const IndexPage = () => {

    const {user} = useAppSelector((state)=>state.auth)

    return (
        <div className=" content  mx-auto">
            <Helmet>
                <title> - لوحة التحكم </title>
            </Helmet>
            <div className="p-6 pb-2 space-y-2 dark:text-emerald-50">
                <h1 className="text-2xl"> مرحبا <strong> {user?.first_name} </strong>  </h1>
                <p> استمر بالتعلم لتحقق اقصى استفادة من وقتك وفي حال احتجات الى اي <Link to={'/help'} className="underline"> <strong> مساعدة </strong> </Link> لا تنسى نحن هنا في كل وقت </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12  gap-6 p-6">
                {/* ===== MAIN CONTENT ===== */}
                <div className="lg:col-span-9 space-y-6">
                    {/* Top Row - Stats / Quick Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-auto items-start grid-flow-dense gap-6">
                        <div className="lg:col-span-2 lg:max-h-60">
                            <LastWatchedCourseWidget />
                        </div>
                        <div className="rounded-xl lg:max-h-60">
                            <StudyHoursChart />
                        </div>
                        <div className="lg:col-span-2 lg:max-h-60">
                            <UpcomingExams />
                        </div>
                        <div className="lg:max-h-60 h-full">
                            <TasksWidget />
                        </div>
                    </div>

                    {/* Middle Row - Larger Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:max-h-60">
                        <div className="lg:col-span-3">
                            <UsefulResourcesWidget />
                        </div>
                        <div className="lg:col-span-2 lg:max-h-60">
                            <RecommendedCoursesWidget />
                        </div>
                        <div className="lg:max-h-60">
                            <RecentActivityWidget />
                        </div>
                    </div>

                </div>

                {/* ===== SIDEBAR ===== */}
                <div className="lg:col-span-3  max-h-dynamic space-y-6 sticky top-6 self-start">
                    {/* 1️⃣ User Profile */}
                    <UserProfileWidget />

                    {/* 2️⃣ Tasks */}
                    <TasksSidebarWidget />

                    {/* 3️⃣ Notifications */}
                    <NotificationsWidget />

                    {/* 4️⃣ Organization Notifications */}
                    <OrganizationNotificationsWidget />

                    {/* 5️⃣ Calendar */}
                    <CalendarWidget />
                </div>
            </div>

        </div>
    );
};

export default IndexPage;
