// hooks/useServerWorker.tsx
import { useEffect } from "react";
import { urlBase64ToUint8Array } from "../utils/urlBase64ToUint8Array";

export default function useServerWorker() {
  useEffect(() => {
    async function registerAndSubscribe() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("Push not supported");
        return;
      }

      // register service worker (path must match your build)
      const reg = await navigator.serviceWorker.register("/service-worker.js");
      console.log("SW registered");

      // request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Push permission not granted");
        return;
      }

      // get VAPID public key from server or settings endpoint
      const r = await fetch("http://localhost:8000/api/notifications/vapid/");
      const { publicKey } = await r.json();

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

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
