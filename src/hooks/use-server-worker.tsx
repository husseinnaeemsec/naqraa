// hooks/useServerWorker.tsx
import { useEffect } from "react";
import { urlBase64ToUint8Array } from "../utils/urlBase64ToUint8Array";

const PPK = 'BKBqLHq78vADus1WZXiTDwXz-79jpRzjpINFHxLY4n93sJOLtIS17cv_Ge6xuPfcJTxZBsBscvnzpGzYKkdawbU';

export default function useServerWorker() {
  useEffect(() => {
    async function registerAndSubscribe() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        return;
      }

      // register service worker (path must match your build)
      const reg = await navigator.serviceWorker.register("/service-worker.js",{scope:'/'});

      // request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return;
      }
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PPK),
      });
      console.log(subscription);
      // send subscription to server
      await fetch("http://localhost:8000/api/notifications/subscribe/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
        credentials: "include", // For Cookie-base authentication
      });

      console.log("Subscribed");
    }

    registerAndSubscribe().catch((e) => console.error(e));
  }, []);

  return {}
}
