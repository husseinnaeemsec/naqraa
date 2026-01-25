import { Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/store';
import { useEffect, useState } from 'react';
import { setupUserPrefrences } from './utils/functions';
import NotificationsPopUp from './components/NotificationsPopUp';
import UserPreferencePopup from './components/UserPreferencePopup';
import useServerWorker from './hooks/use-server-worker';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import AuthProvider from './AuthProvider';
import AsyncOperationsWidget from './components/AsyncOperationsWidget';
import { getStudentEnrollments } from './store/student/actions';




gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(useGSAP)

const App = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { } = useServerWorker();
  const location = useLocation();
  const [showPreferencePopup, setShowPreferencePopup] = useState(false);
  const dispatch = useAppDispatch();

  // Scroll to top on route change
  useGSAP(() => {
    gsap.to(window, {
      duration: 0.5,
      scrollTo: { y: 0, autoKill: true },
      ease: 'power2.out'
    });
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated && user) {

      // Check if user needs to set up preferences
      if (!user.preferences || !user?.student?.preferences?.completed_onboarding) {
        setShowPreferencePopup(true);
      }
      
      dispatch(getStudentEnrollments());

      try {
        setupUserPrefrences(user);
      } catch (err) {
        // Error setting up user preferences - handle silently or log to service
      }
    }
  }, [isAuthenticated, user]);




  return (
    <AuthProvider>
      <div>
        <NotificationsPopUp />
        <UserPreferencePopup
          isOpen={showPreferencePopup}
          onClose={() => setShowPreferencePopup(false)}
        />
        <Outlet />
      </div>
    </AuthProvider>
  );
};

export default App;
