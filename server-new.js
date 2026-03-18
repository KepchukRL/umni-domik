const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, User, Widget, UserWidget, Notification, Op } = require('./src/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = 5002; // Используем другой порт

// Настройки CORS для браузера
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Authorization']
}));

// Ограничиваем размер заголовков и тела запроса
app.use(express.json({ 
  limit: '1mb',
  type: 'application/json'
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '1mb' 
}));

// Логирование всех запросов для отладки
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Опции запросы (preflight)
app.options('*', cors());

// ============== ТЕСТОВЫЕ МАРШРУТЫ ==============

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Сервер работает!', 
    port: PORT,
    time: new Date().toISOString()
  });
});

// ============== АУТЕНТИФИКАЦИЯ ==============

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    
    const { lastName, firstName, middleName, phone, login, password, individualKey } = req.body;

    // Валидация
    if (!login || !password || !lastName || !firstName || !phone || !individualKey) {
      return res.status(400).json({ 
        message: 'Все поля обязательны для заполнения' 
      });
    }

    // Проверка уникальности
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { login },
          { phone },
          { individual_key: individualKey }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.login === login) {
        return res.status(400).json({ field: 'login', message: 'Логин уже занят' });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({ field: 'phone', message: 'Телефон уже зарегистрирован' });
      }
      if (existingUser.individual_key === individualKey) {
        return res.status(400).json({ field: 'individualKey', message: 'Индивидуальный ключ уже используется' });
      }
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = await User.create({
      last_name: lastName,
      first_name: firstName,
      middle_name: middleName || '',
      phone,
      login,
      password: hashedPassword,
      individual_key: individualKey,
      role: 'user'
    });

    // Генерация токена
    const token = jwt.sign(
      { id: user.id, login: user.login, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        login: user.login,
        lastName: user.last_name,
        firstName: user.first_name,
        middleName: user.middle_name,
        phone: user.phone,
        individualKey: user.individual_key,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// Вход
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ 
        message: 'Логин и пароль обязательны' 
      });
    }

    const user = await User.findOne({ where: { login } });
    if (!user) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'Аккаунт заблокирован' });
    }

    // Обновление времени последнего входа
    await user.update({ last_login: new Date() });

    const token = jwt.sign(
      { id: user.id, login: user.login, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        login: user.login,
        lastName: user.last_name,
        firstName: user.first_name,
        middleName: user.middle_name,
        phone: user.phone,
        individualKey: user.individual_key,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// Проверка токена
app.get('/api/auth/check', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Недействительный токен' });
      }

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Пользователь не найден' });
      }

      res.json({
        user: {
          id: user.id,
          login: user.login,
          lastName: user.last_name,
          firstName: user.first_name,
          middleName: user.middle_name,
          phone: user.phone,
          individualKey: user.individual_key,
          role: user.role
        }
      });
    });
  } catch (error) {
    console.error('Check error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// Запуск сервера
sequelize.sync({ alter: true }).then(async () => {
  console.log('✅ База данных синхронизирована');

  // Создаем администратора по умолчанию, если его нет
  const adminExists = await User.findOne({ where: { role: 'admin' } });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin123', 10);
    await User.create({
      login: 'admin',
      password: hashedPassword,
      last_name: 'Админов',
      first_name: 'Админ',
      middle_name: 'Админович',
      phone: '+79990000001',
      individual_key: 'ADMIN001',
      role: 'admin'
    });
    console.log('✅ Создан администратор: admin / Admin123');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📝 Тестовый эндпоинт: http://localhost:${PORT}/api/test`);
  });
}).catch(err => {
  console.error('❌ Ошибка синхронизации БД:', err);
});