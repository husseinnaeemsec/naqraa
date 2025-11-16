import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/client';
import { endpoints } from '../api/routes';
import verificationImage from '../assets/verification.svg';
import verificationFaildImage from '../assets/verification-faild.svg';
import emailSentImg from '../assets/mail-sent.svg';

export default function VerificationPage() {
  const { t } = useTranslation();
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!uid || !token) return;

    const verifyAccount = async () => {
      setMessage(t('verification.verifying'));
      try {
        const res = await api.get(endpoints.user.verification.verify(uid, token), {
          withCredentials: false,
        });
        setStatus('success');
        setMessage(res.data.message || t('verification.success_message'));
        localStorage.removeItem('register_email');
        setTimeout(() => navigate('/login'), 2000);
      } catch (err: any) {
        const statusCode = err.response?.status;
        if (statusCode === 400 || statusCode === 404) {
          setMessage(t('verification.invalid_link'));
        } else {
          setMessage(t('verification.error_occurred'));
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
        <h1 className="text-3xl font-bold text-emerald-800">{t('verification.success_title')}</h1>
        <p className="text-gray-500 text-sm">{t('verification.redirecting')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center space-y-4">
      <img src={verificationFaildImage} alt="Verification failed" className="max-w-xs mx-auto" />
      <h1 className="text-2xl font-semibold text-red-600">{t('verification.failed_title')}</h1>
      <p className="text-gray-600">{message}</p>
      <a
        href="/resend-verification"
        className="mt-4 text-emerald-700 font-semibold underline hover:text-emerald-900"
      >
        {t('verification.resend_link')}
      </a>
    </div>
  );
}
