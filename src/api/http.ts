import axios, { AxiosHeaders } from 'axios';

const http = axios.create({
  timeout: 5000,
});

// إضافة التحقق من الدومين في `http` وتحديث `baseURL` حسب الدومين الموجود في Vuex
http.interceptors.request.use(config => {
  const domain = localStorage.getItem('brandk_domain');
  const token = localStorage.getItem('brandk_token');
  const tenant = localStorage.getItem('brandk_tenant') || {};  // تأكد من تحويل البيانات إلى كائن
  const branch = localStorage.getItem('brandk_branch') || {};  // تأكد من تحويل البيانات إلى كائن
  // إعداد رؤوس الطلب
  const headers = {
    ...(tenant?.id ? { 'X-Tenant-ID': tenant.id } : {}),
    ...(branch?.id ? { 'X-Branch-ID': branch.id } : {}),
    ...(domain ? { 'X-Tenant-Domain': domain } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (domain) {
    // تحديث baseURL بناءً على الدومين
    console.log(domain);
    config.baseURL = `https://${domain.replace(/\/$/, '')}/api`; // إضافة "https://" لتأكيد استخدام البروتوكول الصحيح
  }

  // إضافة رؤوس الطلب
  config.headers = new AxiosHeaders({
    ...config.headers,
    ...headers,
  });

  return config;
});

export default http;
