export default function OrganizationNotificationsWidget() {
  const notifications = [
    "تم تحديث جدول الدورات",
    "هناك دورة جديدة متاحة",
    "تمت الموافقة على تسجيلك في منتدى النقاش",
  ];

  return (
    <div className="p-4 bg-slate-100 dark:bg-emerald-950 dark:text-white rounded-xl shadow">
      <h1 className="font-bold text-lg mb-2">إشعارات المؤسسة</h1>
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
