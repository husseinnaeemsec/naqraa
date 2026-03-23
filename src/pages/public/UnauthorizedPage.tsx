import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logoutUser } from '../../store/auth/authSlice';

export default function UnauthorizedPage() {
  const [searchParams] = useSearchParams();
  const nextUrl = searchParams.get('next');
  const dispatch = useAppDispatch();
  const {isAuthenticated} = useAppSelector(state=>state.auth);
  useEffect(() => {
    if(isAuthenticated) return;
    // Clear any remaining auth data
    localStorage.removeItem('user');
    sessionStorage.clear();
    dispatch(logoutUser());
  }, []);

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-emerald-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-emerald-950 rounded-2xl shadow-xl p-8 text-center border border-emerald-100 dark:border-emerald-800">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-emerald-50 mb-2">
              غير مسموح بالوصول
            </h1>
            <p className="text-gray-600 dark:text-emerald-200/80 mb-6">
              جلستك انتهت صلاحيتها. الرجاء تسجيل الدخول مرة أخرى للمتابعة.
            </p>
          </motion.div>

          <div className="space-y-3">
            <Link
              to={nextUrl ? `/login?next=${encodeURIComponent(nextUrl)}` : '/login'}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              تسجيل الدخول مرة أخرى
            </Link>
            
            <Link
              to="/"
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-gray-700 dark:text-emerald-200 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              العودة إلى الرئيسية
            </Link>
          </div>
          
          {nextUrl && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800"
            >
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                سيتم إعادتك إلى الصفحة المطلوبة بعد تسجيل الدخول
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}