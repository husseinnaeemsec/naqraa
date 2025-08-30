import { Outlet } from 'react-router-dom';
import { useAppSelector } from './store/store';
import { useEffect } from 'react';
import { setupUserPrefrences } from './utils/functions';

const App = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);


  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        setupUserPrefrences(user);
      } catch (err) {
        console.error('Error setting up user preferences:', err);
      }
    }
  }, [isAuthenticated, user]);


  return <Outlet />;
};

export default App;
