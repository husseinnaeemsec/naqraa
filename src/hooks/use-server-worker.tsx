// hooks/useServerWorker.tsx
import { useEffect, useState } from "react";
import { urlBase64ToUint8Array } from "../utils/urlBase64ToUint8Array";
import { useAppSelector } from "../store/store";
import { endpoints } from "../api/routes";
import api from "../api/client";

const PPK = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export default function useServerWorker() {
  const {isAuthenticated} = useAppSelector(state=>state.auth);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'subscribing' | 'subscribed' | 'error'>('idle');

  // Check if subscription already exists
  const checkExistingSubscription = async (registration: ServiceWorkerRegistration) => {
    try {
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        // Verify if subscription is still valid on server
        const response = await api.post(endpoints.notifications.subscription.verify,{endpoint:existingSubscription});
        
        if (response.data) {
          
          return response.data ? existingSubscription : null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error checking existing subscription:', error);
      return null;
    }
  };

  useEffect(() => {
    if(!isAuthenticated || subscriptionStatus === 'subscribing' || subscriptionStatus === 'subscribed') return;
    
    async function registerAndSubscribe() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setSubscriptionStatus('error');
        return;
      }

      setSubscriptionStatus('subscribing');

      try {
        // register service worker (path must match your build)
        const reg = await navigator.serviceWorker.register("/service-worker.js", {scope:'/'});

        // Check if subscription already exists
        const existingSubscription = await checkExistingSubscription(reg);
        if (existingSubscription) {
          setSubscriptionStatus('subscribed');
          return;
        }

        // request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setSubscriptionStatus('error');
          return;
        }
        
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PPK),
        });
        
        // send subscription to server
        const response = await api.post(endpoints.notifications.subscription.subscribe, {subscription});

        if (response.data) {
          console.log('Push subscription registered successfully');
          setSubscriptionStatus('subscribed');
        } else {
          console.error('Failed to register push subscription on server');
          setSubscriptionStatus('error');
        }
      } catch (error) {
        console.error('Error during service worker registration:', error);
        setSubscriptionStatus('error');
      }
    }

    registerAndSubscribe();
  }, [isAuthenticated, subscriptionStatus, checkExistingSubscription,endpoints]);

  return {
    subscriptionStatus,
    isSubscribed: subscriptionStatus === 'subscribed',
    isSubscribing: subscriptionStatus === 'subscribing',
    hasError: subscriptionStatus === 'error'
  }
}
