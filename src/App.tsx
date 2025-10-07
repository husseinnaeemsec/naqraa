import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/store';
import { useEffect } from 'react';
import { setupUserPrefrences } from './utils/functions';
import useNotifications from './hooks/use-notifications';
import api from './api/client';
import { endpoints } from './api/routes';
import { setNotifications } from './store/authSlice';
import NotificationsPopUp from './components/NotificationsPopUp';

const App = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const {ready,sendMessage,loading:ws_loading} = useNotifications();
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isAuthenticated && user) {
      api.get(endpoints.notifications.list).then( res => dispatch(setNotifications(res.data.results)))

      if(!ws_loading){
        console.log("Ready")
        sendMessage({
          title:"Test message"
        })
      }
      try {
        setupUserPrefrences(user);
      } catch (err) {
        console.error('Error setting up user preferences:', err);
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
