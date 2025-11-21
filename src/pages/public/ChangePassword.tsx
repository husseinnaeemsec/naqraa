import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLogo } from '../../utils/functions';
import { useAppSelector } from '../../store/store';
import { CheckCircle, Eye, EyeOff, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../../api/client';
import { endpoints } from '../../api/routes';

export default function ChangePasswordPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { uid, token } = useParams<{ uid: string; token: string }>();

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!uid || !token) {
        setErrors(['رابط غير صحيح. يرجى استخدام الرابط المرسل إلى بريدك الإلكتروني.']);
        setValidatingToken(false);
        return;
      }

      try {
        setValidatingToken(true);
        const response = await api.get(endpoints.user.changePassword(uid, token));
        
        // If we get here without error, token is valid
        if (response.status === 200) {
          setTokenValid(true);
        }
      } catch (error: any) {
        setTokenValid(false);
        if (error.response?.status === 404) {
          setErrors(['الرابط غير صحيح أو منتهي الصلاحية.']);
        } else if (error.response?.status === 400) {
          setErrors(['الرابط غير صالح.']);
        } else {
          setErrors(['حدث خطأ أثناء التحقق من الرابط. يرجى المحاولة مرة أخرى.']);
        }
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [uid, token]);

  // التحقق من صحة كلمة المرور
  const validatePassword = (password: string): string[] => {
    const validationErrors: string[] = [];
    
    if (password.length < 8) {
      validationErrors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
    }
    
    if (!/[a-z]/.test(password)) {
      validationErrors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
    }
    
    if (!/[A-Z]/.test(password)) {
      validationErrors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
    }
    
    if (!/[0-9]/.test(password)) {
      validationErrors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
    }
    
    return validationErrors;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    // التحقق من وجود المعاملات المطلوبة
    if (!uid || !token) {
      setErrors(['رابط غير صحيح. يرجى استخدام الرابط المرسل إلى بريدك الإلكتروني.']);
      setLoading(false);
      return;
    }

    // التحقق من وجود كلمات المرور
    if (!newPassword || !passwordConfirm) {
      setErrors(['جميع الحقول مطلوبة.']);
      setLoading(false);
      return;
    }

    // التحقق من تطابق كلمات المرور
    if (newPassword !== passwordConfirm) {
      setErrors(['كلمتا المرور غير متطابقتان.']);
      setLoading(false);
      return;
    }

    // التحقق من صحة كلمة المرور
    const passwordValidationErrors = validatePassword(newPassword);
    if (passwordValidationErrors.length > 0) {
      setErrors(passwordValidationErrors);
      setLoading(false);
      return;
    }

    try {
      await api.post(endpoints.user.changePassword(uid, token), {
        new_password: newPassword,
        password_confirm: passwordConfirm
      });
      
      setPasswordChanged(true);
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          setErrors([error.response.data.error || 'البيانات المرسلة غير صحيحة']);
        } else if (error.response.status === 404) {
          setErrors(['الرابط غير صحيح أو منتهي الصلاحية']);
        } else if (error.response.status === 500) {
          setErrors(['حصل خطأ في الخادم الرجاء المحاولة في وقت آخر']);
        } else {
          setErrors([error.response.data.error || error.response.data.detail || 'حدث خطأ غير متوقع']);
        }
      } else {
        setErrors(['حصل خطأ أثناء تغيير كلمة المرور الرجاء المحاولة في وقت آخر']);
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full min-h-screen bg-white text-slate-900 pt-24 pb-20 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200 rounded-full opacity-15 -z-10"></div>

      <div className="max-w-md mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
          <Link to={'/'} className="text-7xl font-bold font-handjet text-emerald-50 rounded-full flex items-center justify-center">
            <img src={getLogo()} className='size-48' />
          </Link>

          {validatingToken ? (
            // Token validation loading state
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold text-emerald-700 mb-4">
                التحقق من صحة الرابط...
              </h1>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
              <p className="text-slate-600">
                جارٍ التحقق من صحة رابط إعادة تعيين كلمة المرور...
              </p>
            </div>
          ) : !tokenValid ? (
            // Invalid token state
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <AlertCircle className="w-20 h-20 text-red-500" />
              </div>
              
              <h1 className="text-2xl font-bold text-red-700 mb-4">
                رابط غير صالح
              </h1>
              
              {errors.length > 0 && (
                <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                  {errors.map((err, i) => <p className='text-red-700 text-sm' key={i}>{err}</p>)}
                </div>
              )}
              
              <div className="space-y-3 text-slate-600">
                <p>
                  الرابط المستخدم غير صحيح أو منتهي الصلاحية.
                </p>
                <p className="text-sm">
                  يرجى طلب رابط جديد لإعادة تعيين كلمة المرور.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  to="/reset-password"
                  className="w-full bg-emerald-500 text-white p-3 rounded hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  طلب رابط جديد
                </Link>
                
                <Link
                  to="/login"
                  className="w-full border border-emerald-500 text-emerald-500 p-3 rounded hover:bg-emerald-50 transition-colors flex items-center justify-center"
                >
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </div>
          ) : !passwordChanged ? (
            <>
              <h1 className="text-4xl text-center mb-2 text-emerald-700 dark:text-emerald-200">
                تغيير كلمة المرور
              </h1>
              <p className="text-center mb-4 text-gray-600 dark:text-gray-300 max-w-sm">
                أدخل كلمة المرور الجديدة لإعادة تأمين حسابك.
              </p>

              <form className="w-full max-w-sm flex flex-col gap-4" onSubmit={handleChangePassword}>
                {errors.length > 0 && (
                  <div className="bg-red-100 dark:bg-red-900/50 px-3 text-red-700 dark:text-red-50 p-3 rounded">
                    {errors.map((err, i) => <p className='text-center text-sm' key={i}>{err}</p>)}
                  </div>
                )}
                
                {/* كلمة المرور الجديدة */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="كلمة المرور الجديدة"
                    className="p-3 pl-12 pr-12 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-emerald-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* تأكيد كلمة المرور */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="تأكيد كلمة المرور الجديدة"
                    className="p-3 pl-12 pr-12 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-emerald-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* متطلبات كلمة المرور */}
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p>متطلبات كلمة المرور:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li className={newPassword.length >= 8 ? 'text-emerald-600' : ''}>
                      8 أحرف على الأقل
                    </li>
                    <li className={/[a-z]/.test(newPassword) ? 'text-emerald-600' : ''}>
                      حرف صغير واحد على الأقل
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? 'text-emerald-600' : ''}>
                      حرف كبير واحد على الأقل
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? 'text-emerald-600' : ''}>
                      رقم واحد على الأقل
                    </li>
                  </ul>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-500 text-white p-3 rounded hover:bg-emerald-600 disabled:bg-gray-400 dark:disabled:bg-gray-700 dark:hover:bg-emerald-600 transition-colors"
                >
                  {loading ? 'جارٍ التغيير...' : 'تغيير كلمة المرور'}
                </button>
                
                <div className="text-center">
                  <Link className='text-sm text-emerald-600 dark:text-emerald-400 underline' to={'/login'}>
                    العودة لتسجيل الدخول
                  </Link>
                </div>
              </form>
            </>
          ) : (
            // صفحة تأكيد تغيير كلمة المرور
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="w-20 h-20 text-emerald-500" />
              </div>
              
              <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-200">
                تم تغيير كلمة المرور بنجاح!
              </h1>
              
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <p>
                  تم تحديث كلمة مرورك بنجاح.
                </p>
                <p className="text-sm">
                  يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  className="w-full bg-emerald-500 text-white p-3 rounded hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                    {isAuthenticated ? 'لوحة التحكم' : ' تسجيل الدخول الآن'}
                </Link>
                
                <Link
                  to="/"
                  className="w-full border border-emerald-500 text-emerald-500 p-3 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center justify-center"
                >
                  العودة للصفحة الرئيسية
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}