import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardTopNavbar from './components/DashboardTopNavbar';
const Dashboard = () => {



  return (
    <div className="max-h-dvh  grid lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className="content">
        <DashboardTopNavbar />
        {/* Main content */}
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
