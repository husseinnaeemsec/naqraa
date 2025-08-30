import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import learning from '../../assets/online-learning.svg';
import maths from '../../assets/maths-bg.svg';
import elearn from '../../assets/elearn.svg';
import community from '../../assets/online-discussion.svg';
import laptop from '../../assets/science.svg';
import { endpoints } from '../../api/routes';
import { Helmet } from "react-helmet";
import { getLogo } from '../../utils/functions';

export default function LoginPage() {
  const [username, setUsername] = useState('hussein');
  const [password, setPassword] = useState('2252Test');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    if (!username || !password) {
      setErrors(['اسم المستخدم وكلمة المرور مطلوبة.']);
      setLoading(false);
      return;
    }

    api.post(endpoints.user.login, { username, password })
      .then((_res) => navigate("/dashboard"))
      .catch((e) => {
        if (e.status === 500) {
          setErrors(['حصل خطأ في الخادم الرجاء المحاولة في وقت اخر'])
          return;
        }
        else if (e.response && e.status !== 421) {
          setErrors([e.response.data.error])

        } else {
          setErrors(['حصل خطأ اثناء عملية تسجيل الدخول الرجاء المحاولة في وقت اخر'])
        }
      })
      .finally(() => setLoading(false));
  };
  return (
    <>
      <Helmet>
        <title> تسجيل الدخول </title>
      </Helmet>

      <div className="bg-emerald-50 dark:bg-dark-emerald w-screen h-screen flex items-center justify-center">
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
            <h1 className="text-7xl font-bold font-handjet text-emerald-50 rounded-full   flex items-center justify-center"> <img src={getLogo()} className='size-48 ' /></h1>
            <h1 className="text-4xl text-center mb-2 text-emerald-700 dark:text-emerald-200">تسجيل الدخول</h1>
            <p className="text-center mb-4 text-gray-600 dark:text-gray-300">أدخل بياناتك للوصول إلى حسابك على نقرأ.</p>

            <form className="w-full max-w-sm flex flex-col gap-3" onSubmit={handleLogin}>
              {errors.length > 0 && (
                <div className="bg-red-100 dark:bg-red-900/50 px-3 text-red-700 dark:text-red-50 p-2 rounded">
                  {errors.map((err, i) => <p key={i}>{err}</p>)}
                </div>
              )}
              <input
                type="text"
                placeholder="اسم المستخدم"
                className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-emerald-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="كلمة المرور"
                className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-emerald-950 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-500 text-white p-2 rounded hover:bg-emerald-600 disabled:bg-gray-400 dark:disabled:bg-gray-700 dark:hover:bg-emerald-600 transition-colors"
              >
                {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
            </form>
          </div>


        </div>
      </div>
    </>
  );
}
