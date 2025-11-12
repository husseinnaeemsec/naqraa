import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { endpoints } from '../api/routes';
import verificationImage from '../assets/verification.svg';
import verificationFaildImage from '../assets/verification-faild.svg';
import emailSentImg from '../assets/mail-sent.svg';

export default function VerificationPage() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('جاري التحقق من حسابك...');
  const navigate = useNavigate();

  useEffect(() => {
    if (!uid || !token) return;

    const verifyAccount = async () => {
      try {
        const res = await api.get(endpoints.user.verification.verify(uid, token), {
          withCredentials: false,
        });
        setStatus('success');
        setMessage(res.data.message || 'تم تفعيل حسابك بنجاح');
        localStorage.removeItem('register_email');
        setTimeout(() => navigate('/login'), 2000);
      } catch (err: any) {
        const statusCode = err.response?.status;
        if (statusCode === 400 || statusCode === 404) {
          setMessage('رابط التحقق غير صالح أو منتهي الصلاحية');
        } else {
          setMessage('حدث خطأ أثناء التحقق، حاول لاحقًا');
        }
        setStatus('error');
      }
    };

    verifyAccount();
  }, [uid, token, navigate]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-center">
        <img src={verificationImage} alt="Verifying..." className="max-w-xs mx-auto mb-6 animate-pulse" />
        <h1 className="text-2xl font-semibold text-emerald-700">{message}</h1>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-center space-y-4">
        <img src={emailSentImg} alt="Success" className="max-w-xs mx-auto" />
        <h1 className="text-3xl font-bold text-emerald-800">تم تفعيل حسابك بنجاح 🎉</h1>
        <p className="text-gray-500 text-sm">سيتم تحويلك إلى تسجيل الدخول خلال ثانيتين...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center space-y-4">
      <img src={verificationFaildImage} alt="Verification failed" className="max-w-xs mx-auto" />
      <h1 className="text-2xl font-semibold text-red-600">فشل التحقق من الحساب</h1>
      <p className="text-gray-600">{message}</p>
      <a
        href="/resend-verification"
        className="mt-4 text-emerald-700 font-semibold underline hover:text-emerald-900"
      >
        أرسل رابط تحقق جديد
      </a>
    </div>
  );
}
