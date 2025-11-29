import { Link, useNavigate } from 'react-router-dom';
import logoutImg from '../../assets/logout.svg';
import { useAppDispatch } from '../../store/store';
import { useState } from 'react';
import api from '../../api/client';
import { endpoints } from '../../api/routes';
import { logoutUser } from '../../store/auth/authSlice';

export default function LogoutPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null|string>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        setLoading(true);
        try {
            await api.post(endpoints.user.logout);
            dispatch(logoutUser());
            navigate('/login/');
        } catch(err:any){
            setError(err?.response?.data?.error || 'حصل خطأ اثناء تسجيل الخروج ')
        } finally {
            setLoading(false);
        }
    }

    const icon = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>

        )
    }

    return (
        <div className="flex items-center justify-center h-dvh w-dvw bg-white">
            <div className="max-w-xl w-full mx-auto space-y-3 p-4">
                <img src={logoutImg} className='w-40 mx-auto' alt="" />
                <h1 className="text-2xl font-bold text-center"> هل انت متأكد من تسجيل الخروج ؟ </h1>
                {error !== null && <p className='text-center text-rose-600 flex justify-center items-center gap-2'> {icon()} {error} </p>}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link to={'/dashboard'} className='border p-2 rounded border-emerald-900' > لوحة التحكم  </Link>
                    <button onClick={handleLogout} disabled={loading} className='p-2 disabled:bg-slate-600 rounded bg-rose-600 text-white' > {loading ? 'الرجاء الانتظار...' : 'نعم , خروج '} </button>
                </div>
                
            </div>
        </div>
    )
}