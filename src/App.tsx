import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import NotificationsPopUp from './components/NotificationsPopUp';
import UserPreferencePopup from './components/UserPreferencePopup';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import AuthProvider from './AuthProvider';




gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(useGSAP)

const App = () => {
  const location = useLocation();
  const [showPreferencePopup, setShowPreferencePopup] = useState(false);

  // Scroll to top on route change
  useGSAP(() => {
    gsap.to(window, {
      duration: 0.5,
      scrollTo: { y: 0, autoKill: true },
      ease: 'power2.out'
    });
  }, [location.pathname]);





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
