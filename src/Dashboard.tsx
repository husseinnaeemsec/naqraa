import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardTopNavbar from './components/DashboardTopNavbar';
import { useAppSelector } from './store/store';
import { FloatingTasksMenu } from './components/FloatingTasksMenu';
import { ToastContainer } from './components/ToastContainer';

const Dashboard = () => {

  
  const {showSidebarLables} = useAppSelector(state=>state.ui);
  
  
  return (
    <div className={`h-screen overflow-hidden grid ${showSidebarLables ? "lg:grid-cols-[280px_1fr]" : "lg:grid-cols-[80px_1fr]"}`}>
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className="flex flex-col h-full overflow-hidden">
        <DashboardTopNavbar />
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
      {/* Floating Tasks Menu */}
      <FloatingTasksMenu />
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
