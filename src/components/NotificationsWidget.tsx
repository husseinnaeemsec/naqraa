export default function NotificationsWidget() {
  const notifications = [
    "لقد تم تسجيل الدخول بنجاح",
    "تم تحديث ملفك الشخصي",
    "لديك رسالة جديدة من المشرف",
  ];

  return (
    <div className="p-4 bg-slate-100 dark:bg-emerald-950 dark:text-white rounded-xl shadow">
      <h1 className="font-bold text-lg mb-2">الإشعارات</h1>
      <ul className="space-y-2">
        {notifications.map((note, idx) => (
          <li key={idx} className="p-2 bg-slate-200 dark:bg-emerald-900 rounded-md">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
