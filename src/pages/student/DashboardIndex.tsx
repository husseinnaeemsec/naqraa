import LastWatchedCourseWidget from "../../components/LastWatchedCourseWidget";
import StudyHoursChart from "../../components/StudyHoursChartWidget";
import UpcomingExams from "../../components/UpcomingExamsWidget";
import RecentActivityWidget from "../../components/RecentActivityWidget";
import RecommendedCoursesWidget from "../../components/RecommendedCoursesWidget";
import TasksWidget from "../../components/TaskWidget";
import UsefulResourcesWidget from "../../components/UsefulResourcesWidget";
import UserProfileWidget from "../../components/UserProfileWidget";
import { useAppSelector } from "../../store/store";
import { Link } from "react-router-dom";



const IndexPage = () => {

    const { user } = useAppSelector((state) => state.auth)

    return (
        <div>

            <div className="p-6 pb-2 space-y-2 dark:text-emerald-50">
                <h1 className="text-2xl"> مرحبا <strong> {user?.first_name} </strong>  </h1>
                <p> استمر بالتعلم لتحقق اقصى استفادة من وقتك وفي حال احتجات الى اي <Link to={'/help'} className="underline"> <strong> مساعدة </strong> </Link> لا تنسى نحن هنا في كل وقت </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12  gap-6 p-6">
                {/* ===== MAIN CONTENT ===== */}
                <div className="lg:col-span-9 space-y-6">
                    {/* Top Row - Stats / Quick Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-auto   grid-flow-dense gap-6">
                        {
                            user?.progress?.last_watched_enrollment && (
                                <div className="h-full max-h-fit border">
                                    <LastWatchedCourseWidget />
                                </div>
                            )
                        }
                        {user?.week_study_time && ( <div className="rounded-xl "><StudyHoursChart weekData={user?.week_study_time} /></div> )}
                        <div className="lg:col-span-3 ">
                            <UpcomingExams />
                        </div>
                        <div className=" h-full">
                            <TasksWidget />
                        </div>
                    </div>

                    {/* Middle Row - Larger Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                        <div className="lg:col-span-3">
                            <UsefulResourcesWidget />
                        </div>
                        <div className="lg:col-span-2 ">
                            <RecommendedCoursesWidget />
                        </div>
                        <div className="">
                            <RecentActivityWidget />
                        </div>
                    </div>

                </div>

                {/* ===== SIDEBAR ===== */}
                <div className="lg:col-span-3  max-h-dynamic z-0 space-y-6 sticky top-6 self-start">
                    {/* 1️⃣ User Profile */}
                    <UserProfileWidget />
                </div>
            </div>

        </div>
    );
};

export default IndexPage;
