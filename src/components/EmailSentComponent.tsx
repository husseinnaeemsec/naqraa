import { Link } from 'react-router-dom';
import emailSentImg from '../assets/mail-sent.svg';

export default function EmailSentComponent( { email } : { email:string } ){

    return (
        <div className="flex items-center justify-center h-dvh w-dvw bg-white">
            <div className="max-w-xl w-full mx-auto space-y-3 p-4">
                <img src={emailSentImg} className='w-40 mx-auto' alt="" />
                <h1 className="text-2xl font-bold text-center"> الرجاء التحقق من بريدك الألكتروني </h1>
                <p className='text-center'> لقد قمنا بأرسال رابط التحقق من الحساب على بريدك الألكتروني <strong> {email} </strong> الرجاء التحقق منه لتفعيل الحساب </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link to={'/'} className='border p-2 rounded border-emerald-900' > العودة للصفحة الرئيسية </Link>
                    <Link to={'/login'} className='p-2 rounded bg-emerald-600 text-white' > سجل الدخول الى حسابك  </Link>
                </div>
            </div>
        </div>
    )
}