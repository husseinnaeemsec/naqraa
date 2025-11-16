import axios from "axios";

export const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// 🔹 دالة للحصول على الـ CSRF من الكوكيز
export function getCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,  // 🔹 يسمح بإرسال الكوكيز
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 إضافة CSRF Token تلقائياً قبل أي طلب
api.interceptors.request.use(
  (config) => {
    const token = getCookie("csrftoken");  // Django يحفظه باسم csrftoken
    if (token) {
      config.headers["X-CSRFToken"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 إضافة معالج للاستجابة للتعامل مع 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any stored auth data
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Get current path for redirect after login
      const currentPath = window.location.pathname + window.location.search;
      const unauthorizedPath = `/unauthorized?next=${encodeURIComponent(currentPath)}`;
      
      // Redirect to unauthorized page
      window.location.href = unauthorizedPath;
    }
    return Promise.reject(error);
  }
);

export default api;
