import { Link } from 'react-router-dom';
import verifiedImg from '../../assets/verified.svg'; // صورة تشير للنجاح

export default function AccountVerified() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-white">
      <div className="max-w-xl w-full mx-auto space-y-6 p-6 text-center">
        <img
          src={verifiedImg}
          alt="Account verified illustration"
          className="mx-auto w-40"
        />
        <h1 className="text-3xl font-bold text-emerald-800">تم تفعيل الحساب بنجاح</h1>
        <p className="text-gray-700">
          حسابك مفعل الآن، يمكنك تسجيل الدخول والبدء باستخدام جميع ميزات المنصة.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            سجل الدخول الآن
          </Link>
          <Link
            to="/"
            className="px-4 py-2 border rounded border-emerald-900 hover:bg-emerald-50 transition"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
