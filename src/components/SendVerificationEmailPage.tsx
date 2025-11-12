import { useEffect, useState } from 'react';
import api from '../api/client';
import { endpoints } from '../api/routes';
import emailSentImg from '../assets/mail-sent.svg';
import verificationImage from '../assets/verification.svg';
import { isValidEmail } from '../utils/functions';

export default function SendVerificationEmailPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    const savedEmail = localStorage.getItem('register_email');
    if (savedEmail && isValidEmail(savedEmail)) setEmail(savedEmail);
  }, []);

  // عدّ تنازلي
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendLink = async () => {
    if (!isValidEmail(email)) {
      setMessage('الرجاء إدخال بريد إلكتروني صالح');
      setStatus('error');
      return;
    }
    if (cooldown > 0) return;

    setStatus('loading');
    setMessage('جاري إرسال الرابط...');

    try {
      const res = await api.post(endpoints.user.verification.request, { email },{ withCredentials:false });
      setStatus('sent');
      setMessage(res.data.message || 'تم إرسال رابط التحقق بنجاح');
      setCooldown(res.data.cooldown_remaining || 60);
    } catch (err: any) {
      const code = err.response?.status;
      if (code === 429) {
        const remaining = err.response?.data?.cooldown_remaining || 60;
        setCooldown(remaining);
        setMessage(`الرجاء الانتظار ${remaining} ثانية قبل المحاولة مجددًا`);
      } else if (code === 404) {
        setMessage('لم يتم العثور على حساب بهذا البريد');
      } else {
        setMessage('حدث خطأ أثناء الإرسال، حاول لاحقًا');
      }
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center space-y-4">
      <img src={status === 'sent' ? emailSentImg : verificationImage} alt="Verification" className="max-w-xs mx-auto" />
      <h1 className="text-2xl font-semibold text-emerald-700">
        {status === 'sent' ? 'تم إرسال رابط التحقق 🎉' : 'أرسل رابط تحقق جديد'}
      </h1>

      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border border-gray-300 rounded w-64 text-center"
      />

      <button
        disabled={cooldown > 0}
        onClick={handleSendLink}
        className={`px-4 py-2 rounded font-semibold border border-emerald-800 ${
          cooldown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-100'
        }`}
      >
        {cooldown > 0 ? `انتظر ${cooldown} ثانية` : 'إرسال رابط تحقق'}
      </button>

      {message && <p className="text-gray-600 text-sm mt-2">{message}</p>}
    </div>
  );
}
