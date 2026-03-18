import axios from 'axios';

// Определяем режим работы
const isProduction = !window.location.hostname.includes('localhost');
const baseURL = isProduction 
  ? 'https://umni-domik.onrender.com//api'
  : 'http://localhost:5002/api';

console.log('🚀 Режим:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
console.log('🌐 API URL:', baseURL);
console.log('📍 Хост:', window.location.hostname);

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Добавление токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Обработка ответов
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status);
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Сервер недоступен. Проверьте:', baseURL);
    }
    console.error('❌ Response error:', error.message);
    return Promise.reject(error);
  }
);

export default api; 