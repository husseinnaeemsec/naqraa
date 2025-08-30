import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import StudentNavbar from './components/StudentNavbar';

const Dashboard = () => {
  return (
    <div className="overflow-hidden grid lg:grid-cols-[280px_1fr]">
      <div className="lg:col-span-12"><StudentNavbar /></div>
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className="h-dynamic overflow-hidden ">
        {/* Main content */}
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
