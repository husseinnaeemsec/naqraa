import { useEffect, useState } from 'react';
import api from '../api/client'; // axios instance
import { endpoints } from '../api/routes';
import emailSentImg from '../assets/mail-sent.svg';
import verificationImage from '../assets/verification.svg';
import { useAppDispatch, useAppSelector } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../store/authSlice';
import type { User } from '../../types';

export default function VerificationPage() {
  
  const {user,isAuthenticated} = useAppSelector(state=>state.auth);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeout, setTimer] = useState(0);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  
  // Check authentication
  useEffect(()=>{

    if(!isAuthenticated){
      navigate('/login')
    }
    if(isAuthenticated && user?.verified){
      navigate("/dashboard/")
    }

  },[isAuthenticated,user?.verified])

  // 🔁 عدّاد تنازلي للمهلة
  useEffect(() => {
    if (timeout <= 0) return;
    const t = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [timeout]);





  // 🧾 إرسال الرمز للتحقق
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length < 6) return setError('الرجاء إدخال الرمز كاملاً');
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post(endpoints.user.verification.verify, {code});
      setSuccess(true);
      dispatch(setUser({ ...(user as User), verified:true }))

    } catch (err: any) {
      setError(err.response?.data?.error || 'الرمز الذي أدخلته غير صالح');
    } finally {
      setLoading(false);
    }
  };

  // 🔁 طلب رمز تحقق جديد
  const handleCodeRequest = async () => {
    if (timeout > 0) return;
    setLoading(true);
    try {
      await api.post(endpoints.user.verification.request);
      setTimer(60); // إعادة تشغيل المؤقت
    } catch (e:any) {
      setError(e.response?.data?.error || 'حصل خطأ اثناء ارسال رمز التحقق')
    } finally {
      setLoading(false);
    }
  };

  // ✅ عند نجاح التحقق
  if (success) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-white">
        <div className="max-w-xl w-full mx-auto space-y-6 p-6 text-center">
          <img src={emailSentImg} alt="Email sent" className="mx-auto max-w-xs" />
          <h1 className="text-3xl font-bold text-emerald-800">تم تفعيل حسابك بنجاح 🎉</h1>
          <p className="text-gray-700">يمكنك الآن الاستمرار باستخدام التطبيق.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-white">
      <div className="space-y-4 text-center max-w-sm w-full p-4">
        <img src={verificationImage} alt="verify" className="max-w-xs mx-auto" />
        <h1 className="text-2xl font-semibold">الرجاء تأكيد حسابك قبل الاستمرار</h1>
        <p className="text-gray-600 text-sm mb-3">
          تم إرسال رمز التحقق إلى بريدك الإلكتروني <strong>{user?.email}</strong>
        </p>

        {/* 🟦 خلايا الكود */}
        <form onSubmit={handleSubmit} className="flex justify-between">
          <input
              type="text"
              value={code}
              maxLength={6}
              onChange={(e) => setCode(e.target.value) }
              placeholder='ادخل رمز التحقق'
              className="w-full p-2 text-center border rounded text-lg  focus:border-emerald-500 focus:outline-none"
            />
        </form>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-emerald-500 text-white w-full p-2 rounded font-semibold"
        >
          {loading ? 'الرجاء الانتظار...' : 'تحقق'}
        </button>

        <button
          disabled={timeout > 0 || loading}
          onClick={handleCodeRequest}
          className={`border border-emerald-500 w-full p-2 rounded font-semibold ${
            timeout > 0 ? 'text-gray-400 border-gray-300' : ''
          }`}
        >
          {timeout > 0
            ? `أعد الإرسال بعد ${timeout} ثانية`
            : 'لم يصلك الرمز؟ أعد الإرسال الآن'}
        </button>
      </div>
    </div>
  );
}
