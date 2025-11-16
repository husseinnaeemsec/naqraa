import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import emailSentImg from '../assets/mail-sent.svg';

export default function EmailSentComponent( { email } : { email:string } ){
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-center h-dvh w-dvw bg-white">
            <div className="max-w-xl w-full mx-auto space-y-3 p-4">
                <img src={emailSentImg} className='w-40 mx-auto' alt="" />
                <h1 className="text-2xl font-bold text-center">{t('auth.checkYourEmail')}</h1>
                <p className='text-center'>{t('auth.verificationEmailSent', { email })}</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link to={'/'} className='border p-2 rounded border-emerald-900'>{t('navigation.backToHome')}</Link>
                    <Link to={'/login'} className='p-2 rounded bg-emerald-600 text-white'>{t('auth.loginToAccount')}</Link>
                </div>
            </div>
        </div>
    )
}