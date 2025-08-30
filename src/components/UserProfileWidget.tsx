import { Link } from "react-router-dom";
import { useAppSelector } from "../store/store";

export default function UserProfileWidget() {

  const {user} = useAppSelector((state)=> state.auth )

  const getUserRole = ()=>{
    switch (user?.role){
      case 'organization':
        return 'حساب مؤسسسة'
      case 'student':
        return 'طالب'
      case 'user':
        return 'مساهم'
      default:
        return 'غير محدد'
    }
  }

  return (
    <div className="p-4 bg-white space-y-2 dark:bg-emerald-950 dark:text-white rounded-xl shadow">
      <img src={user?.profile?.profile_picture} className=" object-cover aspect-square  size-40 rounded-full mx-auto  " />
      <p>الاسم: <strong> {user?.first_name} {user?.last_name} </strong></p>
      <p>البريد الإلكتروني: <strong> {user?.email} </strong></p>
      <p>الدور: <strong> {getUserRole()} </strong> </p>
      <Link to={'/dashboard/settings'} className="text-center p-2 rounded-md dark:bg-emerald-800 dark:hover:bg-emerald-900 bg-emerald-50 hover:bg-emerald-100 w-full block"> تعديل الملف الشخصي </Link>
    </div>
  );
}
