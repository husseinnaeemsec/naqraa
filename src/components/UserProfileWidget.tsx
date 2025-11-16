import { Link } from "react-router-dom";
import { useAppSelector } from "../store/store";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Calendar, 
  BookOpen, 
  Trophy, 
  Clock, 
  Settings, 
  Star, 
  Target,
  TrendingUp,
  Bell,
  Gift,
  Crown,
  Zap
} from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function UserProfileWidget() {
  const { user } = useAppSelector((state) => state.auth);

  const getUserRole = () => {
    switch (user?.role) {
      case 'organization':
        return { label: 'حساب مؤسسة', icon: '🏢', color: 'text-blue-600' };
      case 'student':
        return { label: 'طالب', icon: '🎓', color: 'text-emerald-600' };
      case 'user':
        return { label: 'مساهم', icon: '✨', color: 'text-purple-600' };
      default:
        return { label: 'غير محدد', icon: '👤', color: 'text-gray-600' };
    }
  };

  const roleInfo = getUserRole();
  const joinDate = user?.date_joined ? new Date(user.date_joined).toLocaleDateString('ar-SA') : '';
  const enrolledCoursesCount = user?.enrolled_courses?.length || 0;

  // Calculate study streak (mock data for now)
  const studyStreak = 7; // This would come from backend
  const totalStudyHours = 45; // This would come from backend
  const completedCourses = 3; // This would come from backend

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card variant="dashboard" className="overflow-hidden">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 p-6 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 text-center space-y-4">
            {/* Profile Picture */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative mx-auto w-24 h-24"
            >
              <img 
                src={user?.profile?.profile_picture} 
                className="w-full h-full object-cover rounded-full border-4 border-white/20 shadow-lg" 
                alt={`${user?.first_name} ${user?.last_name}`}
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1">
                <span className="text-sm">{roleInfo.icon}</span>
              </div>
            </motion.div>

            {/* User Info */}
            <div>
              <h3 className="text-xl font-bold">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-emerald-100 text-sm">{roleInfo.label}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-700 dark:text-emerald-200">
              <Mail className="size-4 text-emerald-600" />
              <span className="truncate">{user?.email}</span>
            </div>
            
            {joinDate && (
              <div className="flex items-center gap-3 text-gray-700 dark:text-emerald-200">
                <Calendar className="size-4 text-emerald-600" />
                <span>انضم في {joinDate}</span>
              </div>
            )}
            
            <div className="flex items-center gap-3 text-gray-700 dark:text-emerald-200">
              <BookOpen className="size-4 text-emerald-600" />
              <span>{enrolledCoursesCount} دورة مسجل</span>
            </div>
          </div>

          <Link to="/dashboard/settings">
            <Button variant="outline" size="sm" className="w-full" icon={<Settings className="size-4" />}>
              تعديل الملف الشخصي
            </Button>
          </Link>
        </div>
      </Card>

      {/* Study Statistics */}
      <Card variant="dashboard" className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="size-5 text-emerald-600" />
          <h4 className="font-bold text-gray-900 dark:text-emerald-50">إحصائيات الدراسة</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-950 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Zap className="size-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-200">{studyStreak}</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-300">أيام متتالية</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Clock className="size-5 text-emerald-700" />
            </div>
            <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-100">{totalStudyHours}</div>
            <div className="text-xs text-emerald-700 dark:text-emerald-200">ساعة دراسة</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Trophy className="size-5 text-emerald-700" />
            </div>
            <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-100">{completedCourses}</div>
            <div className="text-xs text-emerald-700 dark:text-emerald-200">دورة مكتملة</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-3 bg-gradient-to-br from-emerald-200 to-emerald-300 dark:from-emerald-700 dark:to-emerald-800 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Star className="size-5 text-emerald-800" />
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-50">4.8</div>
            <div className="text-xs text-emerald-800 dark:text-emerald-200">متوسط التقييم</div>
          </motion.div>
        </div>
      </Card>

      {/* Achievement Badge */}
      <Card variant="dashboard" className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
            <Crown className="size-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">طالب متميز</h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">حافظت على التعلم لمدة أسبوع!</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card variant="dashboard" className="p-4">
        <h4 className="font-bold text-gray-900 dark:text-emerald-50 mb-4 flex items-center gap-2">
          <Target className="size-4 text-emerald-600" />
          إجراءات سريعة
        </h4>
        
        <div className="space-y-2">
          <Link to="/courses" className="flex items-center gap-3 p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 rounded-lg transition-colors group">
            <BookOpen className="size-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-gray-700 dark:text-emerald-200">استكشف الدورات</span>
          </Link>
          
          <Link to="/dashboard/notifications" className="flex items-center gap-3 p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 rounded-lg transition-colors group">
            <Bell className="size-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-gray-700 dark:text-emerald-200">الإشعارات</span>
          </Link>
          
          <Link to="/resources" className="flex items-center gap-3 p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 rounded-lg transition-colors group">
            <Gift className="size-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-gray-700 dark:text-emerald-200">المصادر التعليمية</span>
          </Link>
        </div>
      </Card>

      {/* Subscription Status (if applicable) */}
      {user?.subscription && (
        <Card variant="dashboard" className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
              <Crown className="size-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">العضوية المميزة</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">نشطة حتى {new Date(user.subscription.end_date).toLocaleDateString('ar-SA')}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
