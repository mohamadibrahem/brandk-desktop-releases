import axios, { AxiosHeaders } from 'axios';

const http = axios.create({
  timeout: 5000,
});

// إضافة التحقق من الدومين في `http` وتحديث `baseURL` حسب الدومين الموجود في Vuex
http.interceptors.request.use(config => {
  const domain = localStorage.getItem('brandk_domain');
  const token = localStorage.getItem('brandk_token');
  if (domain) {
    // تحديث baseURL بناءً على الدومين
    config.baseURL = `https://${domain.replace(/\/$/, '')}/api`; // إضافة "https://" لتأكيد استخدام البروتوكول الصحيح
  }
  if (token) {
    // استخدام AxiosHeaders لتحديث الهيدر
    config.headers = new AxiosHeaders({
      ...config.headers,
      Authorization: `Bearer ${token}`,
    });
  }
  return config;
});

export default http;
