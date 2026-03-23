import axios from "axios";


export const BASE_API_URL = 'http://localhost:8000/v1';




const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,  // 🔹 يسمح بإرسال الكوكيز
  xsrfCookieName: "csrftoken",    // اسم الـ cookie الذي يحتوي CSRF
  xsrfHeaderName: "X-CSRFToken",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});




// 🔹 إضافة معالج للاستجابة للتعامل مع 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith("/dashboard") ) {
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
