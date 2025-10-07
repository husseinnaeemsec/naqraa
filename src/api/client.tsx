import axios from "axios";

export const BASE_API_URL = 'http://localhost:8000/api';

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

export default api;
