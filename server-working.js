const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5002;

// Настройки CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ============== ТЕСТОВЫЕ МАРШРУТЫ ==============

app.get('/api/test', (req, res) => {
  console.log('✅ GET /api/test вызван');
  res.json({ 
    message: 'Сервер работает!', 
    port: PORT,
    time: new Date().toISOString()
  });
});

app.get('/test', (req, res) => {
  console.log('✅ GET /test вызван');
  res.send('Сервер работает!');
});

// ============== АУТЕНТИФИКАЦИЯ ==============

app.post('/api/auth/login', (req, res) => {
  console.log('📝 POST /api/auth/login вызван', req.body);
  const { login, password } = req.body;
  
  if (login === 'admin' && password === 'Admin123') {
    res.json({
      token: 'test-token-123',
      user: {
        id: 1,
        login: 'admin',
        lastName: 'Админов',
        firstName: 'Админ',
        middleName: 'Админович',
        phone: '+79990000001',
        individualKey: 'ADMIN001',
        role: 'admin'
      }
    });
  } else if (login === 'test' && password === 'Test123') {
    res.json({
      token: 'test-token-456',
      user: {
        id: 2,
        login: 'test',
        lastName: 'Иванов',
        firstName: 'Иван',
        middleName: 'Иванович',
        phone: '+79991234567',
        individualKey: 'HOME123',
        role: 'user'
      }
    });
  } else {
    res.status(401).json({ message: 'Неверный логин или пароль' });
  }
});

app.post('/api/auth/register', (req, res) => {
  console.log('📝 POST /api/auth/register вызван', req.body);
  const { login, lastName, firstName } = req.body;
  
  res.status(201).json({
    token: 'new-user-token',
    user: {
      id: Date.now(),
      login,
      lastName,
      firstName,
      middleName: req.body.middleName || '',
      phone: req.body.phone,
      individualKey: req.body.individualKey,
      role: 'user'
    }
  });
});

app.get('/api/auth/check', (req, res) => {
  console.log('✅ GET /api/auth/check вызван');
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Нет токена' });
  }
  
  // Простая проверка для теста
  res.json({
    user: {
      id: 1,
      login: 'admin',
      lastName: 'Админов',
      firstName: 'Админ',
      middleName: 'Админович',
      phone: '+79990000001',
      individualKey: 'ADMIN001',
      role: 'admin'
    }
  });
});

// ============== ЗАПУСК СЕРВЕРА ==============

app.listen(PORT, () => {
  console.log(`✅ Сервер успешно запущен на порту ${PORT}`);
  console.log(`📝 Тестовые эндпоинты:`);
  console.log(`   - http://localhost:${PORT}/test`);
  console.log(`   - http://localhost:${PORT}/api/test`);
  console.log(`🔐 Тестовые учетные записи:`);
  console.log(`   - admin / Admin123`);
  console.log(`   - test / Test123`);
});