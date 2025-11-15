import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/store';
import { useEffect } from 'react';
import { setupUserPrefrences } from './utils/functions';
import api from './api/client';
import { endpoints } from './api/routes';
import { setNotifications } from './store/authSlice';
import NotificationsPopUp from './components/NotificationsPopUp';
import useServerWorker from './hooks/use-server-worker';

const App = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const {} = useServerWorker();
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (isAuthenticated && user) {
      api.get(endpoints.notifications.list).then( res => dispatch(setNotifications(res.data.results)))

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
    <Outlet />
    </>
  );
};

export default App;
