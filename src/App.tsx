import { Menu } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const MobileMenu = ()=>{

  return (
    <div className='flex lg:hidden items-center justify-between p-3 bg-white'>
      <Menu size={30} />
      <h1 className='text-5xl  font-handjet'> نقرأ </h1>
      <span></span>
    </div>
  )
}

const App = () => {
  const location = useLocation();
  const currentPath = location.pathname;




  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path) && path.length === currentPath.length;



  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="lg:flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <MobileMenu />
        <aside
          className={`w-64 lg:sticky fixed lg:right-0 right-[100%] bg-white text-gray-800 h-screen overflow-y-auto  top-0 shadow-lg transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-200`}
        >
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to={'/'}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive('/') ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>لوحة التحكم</span>
                </Link>
              </li>
              <li>
                <Link
                  to={'/courses'}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive("/courses") ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>المحاضرات</span>
                </Link>
              </li>
              <li>
                <Link
                  to={'/classroom'}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive("/classroom") ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>فصل الدراسة</span>
                </Link>
              </li>
              <li>
                <Link
                  to={'/org'}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive("/org") ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>المؤسسة التعليمية</span>
                </Link>
              </li>
              <li>
                <Link
                  to={'/exams'}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive("/exams") ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>الاختبارات</span>
                </Link>
              </li>
              <li>
                <Link
                  to={'/chat'}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive("/chat") ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h.01M12 16h.01M15 16h.01M8 13h.01M12 13h.01M16 13h.01M9 19h.01M12 19h.01M15 19h.01" />
                  </svg>
                  <span>الدردشة</span>
                </Link>
              </li>
              <li>
                <Link
                  to={'/community'}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive("/community") ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.336 2.146M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>المجتمعات</span>
                </Link>
              </li>
              <li>
                <Link
                  to={'/files'}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive("/files") ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>الملفات</span>
                </Link>
              </li>
              <li>
                <Link
                  to={'/settings'}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive("/settings") ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.638 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>الإعدادات</span>
                </Link>
              </li>
              <li>
                <Link
                  to={'/board'}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive("/board") ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span>لوحات التخطيط</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 h-screen overflow-y-auto  bg-white">
          {/* Main content */}
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
