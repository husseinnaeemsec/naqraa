import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/store';
import { useEffect, useState } from 'react';
import { setupUserPrefrences } from './utils/functions';
import api from './api/client';
import { endpoints } from './api/routes';
import { setNotifications } from './store/authSlice';
import NotificationsPopUp from './components/NotificationsPopUp';
import UserPreferencePopup from './components/UserPreferencePopup';
import useServerWorker from './hooks/use-server-worker';

const App = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const {} = useServerWorker();
  const dispatch = useAppDispatch();
  const [showPreferencePopup, setShowPreferencePopup] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      api.get(endpoints.notifications.list).then( res => dispatch(setNotifications(res.data.results)))

      // Check if user needs to set up preferences
      if (!user.preference || !user.preference.completed_onboarding) {
        setShowPreferencePopup(true);
      }

      try {
        setupUserPrefrences(user);
      } catch (err) {
        // Error setting up user preferences - handle silently or log to service
      }
    }
  }, [isAuthenticated, user]);


  return (
    <>
    <NotificationsPopUp />
    <UserPreferencePopup 
      isOpen={showPreferencePopup} 
      onClose={() => setShowPreferencePopup(false)}
    />
    <Outlet />
    </>
  );
};

export default App;
