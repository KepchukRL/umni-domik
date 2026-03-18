import axios from 'axios';

// Определяем базовый URL в зависимости от окружения
const getBaseURL = () => {
  // Если мы на Render (или другом хостинге)
  if (process.env.NODE_ENV === 'production') {
    // Здесь должен быть URL вашего сервера на Render
    return 'https://umni-domik.onrender.com/api';
  }
  // Для локальной разработки
  return 'http://localhost:5002/api';
};

const API_URL = getBaseURL();

console.log('🌐 API URL:', API_URL, 'Mode:', process.env.NODE_ENV);

const api = axios.create({
  baseURL: API_URL,
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
    console.error('❌ Response error:', error.message);
    return Promise.reject(error);
  }
);

export default api;