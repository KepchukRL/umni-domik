import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Применяем сохраненную тему при загрузке
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  document.body.classList.add('dark-theme');
} else {
  document.documentElement.setAttribute('data-theme', 'light');
  document.body.classList.add('light-theme');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);