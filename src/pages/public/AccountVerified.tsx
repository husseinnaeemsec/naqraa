import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import verifiedImg from '../../assets/verified.svg';

export default function AccountVerified() {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-white">
      <div className="max-w-xl w-full mx-auto space-y-6 p-6 text-center">
        <img
          src={verifiedImg}
          alt="Account verified illustration"
          className="mx-auto w-40"
        />
        <h1 className="text-3xl font-bold text-emerald-800">{t('account_verified.title')}</h1>
        <p className="text-gray-700">
          {t('account_verified.description')}
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            {t('account_verified.login_now')}
          </Link>
          <Link
            to="/"
            className="px-4 py-2 border rounded border-emerald-900 hover:bg-emerald-50 transition"
          >
            {t('account_verified.back_home')}
          </Link>
        </div>
      </div>
    </div>
  );
}
