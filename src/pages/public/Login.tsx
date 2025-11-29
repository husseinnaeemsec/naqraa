import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/client';
import learning from '../../assets/online-learning.svg';
import maths from '../../assets/maths-bg.svg';
import elearn from '../../assets/elearn.svg';
import community from '../../assets/online-discussion.svg';
import laptop from '../../assets/science.svg';
import { endpoints } from '../../api/routes';
import { getLogo } from '../../utils/functions';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { logoutUser, setAuthenticationState, setUser } from '../../store/auth/authSlice';
import VerificationPage from '../../components/VerificationPage';

// Utility function to validate safe redirect URLs
const isValidRedirectUrl = (url: string): boolean => {
  try {
    // Define allowed paths/routes for security
    const allowedPaths = [
      '/dashboard',
      '/courses',
      '/communities',
      '/resources',
      '/settings',
      '/notifications',
      '/chat',
      '/exams',
      '/files',
      '/org',
      '/organizations',
      '/timetable',
      '/subscription',
      '/board',
      '/classroom'
    ];

    // Parse the URL
    const parsedUrl = new URL(url, window.location.origin);

    // Only allow same-origin URLs
    if (parsedUrl.origin !== window.location.origin) {
      return false;
    }

    const pathname = parsedUrl.pathname;

    // Check if the path starts with any allowed path
    return allowedPaths.some(allowedPath =>
      pathname === allowedPath ||
      pathname.startsWith(allowedPath + '/') ||
      pathname.startsWith('/dashboard')
    );
  } catch {
    return false;
  }
};

export default function LoginPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVerificationForm, setShowVerificationEmail] = useState(false)
  const [activateAccount, setActivateAccount] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const slides = [
    { id: 1, img: learning, title: 'دراستك أكثر متعة وفعالية', subtitle: 'مع نقرأ توفر لك أحدث الطرق والأدوات التي تجعل دراستك أسهل وأسرع.' },
    { id: 2, img: elearn, title: 'دورات مجانية', subtitle: 'استفد من مجموعة واسعة من الدورات المجانية المنظمة بعناية.' },
    { id: 3, img: community, title: 'المجتمع الطلابي', subtitle: 'انضم إلى مجتمع يشارك الموارد والخبرات بين الطلاب.' },
    { id: 4, img: maths, title: 'أدوات الرياضيات', subtitle: 'استخدم أدوات تفاعلية تساعدك على حل مسائل الرياضيات بسرعة.' },
    { id: 5, img: laptop, title: 'الملازم واوراق البحث', subtitle: 'استفد من الااف الملازم واوراق البحث المجانية او انشئ ملازم وملخصات خاصة بك' },
  ];

  // تشغيل العارض تلقائياً
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const nextUrl = searchParams.get('next');

      // Validate and redirect to next URL if safe, otherwise default to dashboard
      if (nextUrl && isValidRedirectUrl(nextUrl)) {
        navigate(nextUrl, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, navigate, searchParams]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setActivateAccount(false);
    setLoading(true);

    if (!email || !password) {
      setErrors(['البريد الإلكتروني وكلمة المرور مطلوبة.']);
      setLoading(false);
      return;
    }
    api.post(endpoints.user.login, { email, password })
      .then((res) => {
        dispatch(setUser(res.data))
        dispatch(setUser(res.data))
        setTimeout(() => {
          dispatch(setAuthenticationState(true))
          const nextUrl = searchParams.get('next');
          navigate(nextUrl && isValidRedirectUrl(nextUrl) ? nextUrl : "/dashboard", { replace: true });
        }, 200);

      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 500) {
            setErrors(["حصل خطأ في الخادم الرجاء المحاولة في وقت اخر"]);
          } else if (e.response.status !== 421) {
            if (e.response.status === 401) {
              dispatch(logoutUser())
            }
            setErrors([e.response.data.error || e.response.data.detail]);
            if (e.response?.data?.code === 'account_not_active') {
              setActivateAccount(true)
            }
          }
        } else {
          setErrors([
            "حصل خطأ اثناء عملية تسجيل الدخول الرجاء المحاولة في وقت اخر",
          ]);
        }
      })
      .finally(() => setLoading(false));
  };

  if (showVerificationForm) return <VerificationPage />

  return (
    <>

      <div className="bg-emerald-50 dark:bg-dark-emerald w-screen min-h-screen flex items-center justify-center">
        <div className="container gap-10 m-auto h-[90dvh]  p-5 grid lg:grid-cols-2 items-center justify-center">
          {/* يسار: العارض */}
          <div className="relative h-full  w-full rounded-2xl overflow-hidden flex flex-col items-center justify-center  ">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute flex flex-col justify-center items-center top-0 left-0 w-full h-full transition-opacity duration-700 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img src={slide.img} alt={slide.title} className="h-[70%] object-cover mx-auto" />
                <div className="min-w-xl text-emerald-800 dark:text-emerald-50 text-center p-4 rounded max-w-xs">
                  <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                  <p>{slide.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* يمين: نموذج تسجيل الدخول */}
          <div className="h-full w-full flex flex-col items-center justify-center gap-5 bg-white dark:bg-emerald-950 rounded-2xl p-8 dashboard-box">
            <Link to={'/'} className="text-7xl font-bold font-handjet text-emerald-50 rounded-full   flex items-center justify-center"> <img src={getLogo()} className='size-20 ' /></Link>
            <h1 className="text-4xl text-center mb-2 text-emerald-700 dark:text-emerald-200">تسجيل الدخول</h1>
            <p className="text-center mb-4 text-gray-600 dark:text-gray-300">أدخل بياناتك للوصول إلى حسابك على نقرأ.</p>

            <form className="w-full max-w-sm flex flex-col gap-3" onSubmit={handleLogin}>
              {errors.length > 0 && (
                <div className="bg-red-100 dark:bg-red-900/50 px-3 text-red-700 dark:text-red-50 p-2 rounded">
                  {errors.map((err, i) => <p className='text-center' key={i}>{err}</p>)}
                </div>
              )}
              {activateAccount && <button type='button' onClick={() => { setShowVerificationEmail(true) }} className='underline text-center'> تفعيل الحساب </button>}
              <input
                type="text"
                placeholder="البريد الإلكتروني"
                className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-emerald-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="كلمة المرور"
                className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-emerald-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className='text-sm mb-2'> نسيت كلمة المرور ؟ <Link className='underline' to={'/reset-password'} > اعادة تعيين كلمة المرور  </Link> </p>
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-500 text-white p-2 rounded hover:bg-emerald-600 disabled:bg-gray-400 dark:disabled:bg-gray-700 dark:hover:bg-emerald-600 transition-colors"
              >
                {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
              <p className='text-sm text-slate-500'> ليس لديك حساب بعد؟ <Link className='underline' to={searchParams.get('next') ? `/register?next=${encodeURIComponent(searchParams.get('next')!)}` : '/register'} > انشئ حساب جديد </Link> </p>
            </form>
          </div>


        </div>
      </div>
    </>
  );
}
