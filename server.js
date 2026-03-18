const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
// Импортируем модели из index.js
const { sequelize, User, Widget, UserWidget, Notification, Op } = require('./src/models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002; // Используем PORT из окружения Render

// Настройки CORS - обновляем для Render
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://umni-domik.onrender.com/'] // замените на ваш URL
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());




// Обслуживание статических файлов из папки build
app.use(express.static(path.join(__dirname, 'build')));

// Все маршруты, не начинающиеся с /api, отдают index.html
app.get('/*splat', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  }
});


// ============== МИДЛВЕРЫ ==============

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Требуется авторизация' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Недействительный токен' });
    req.userId = user.id;
    req.userRole = user.role;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Требуются права администратора' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============== ТЕСТОВЫЕ МАРШРУТЫ ==============

app.get('/api/test', (req, res) => {
  res.json({ message: 'Сервер работает!', port: PORT });
});

// ============== АУТЕНТИФИКАЦИЯ ==============

app.post('/api/auth/register', async (req, res) => {
  try {
    const { lastName, firstName, middleName, phone, login, password, individualKey } = req.body;

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ login }, { phone }, { individual_key: individualKey }] }
    });

    if (existingUser) {
      if (existingUser.login === login) return res.status(400).json({ field: 'login', message: 'Логин уже занят' });
      if (existingUser.phone === phone) return res.status(400).json({ field: 'phone', message: 'Телефон уже зарегистрирован' });
      if (existingUser.individual_key === individualKey) return res.status(400).json({ field: 'individualKey', message: 'Ключ уже используется' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      last_name: lastName,
      first_name: firstName,
      middle_name: middleName,
      phone,
      login,
      password: hashedPassword,
      individual_key: individualKey,
      role: 'user'
    });

    const token = jwt.sign(
      { id: user.id, login: user.login, role: user.role },
      process.env.JWT_SECRET || 'secret-key',
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
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ where: { login } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'Аккаунт заблокирован' });
    }

    const token = jwt.sign(
      { id: user.id, login: user.login, role: user.role },
      process.env.JWT_SECRET || 'secret-key',
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
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/auth/check', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
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
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ============== ВИДЖЕТЫ ==============

// Получение каталога виджетов
app.get('/api/widgets/catalog', authenticateToken, async (req, res) => {
  try {
    const widgets = await Widget.findAll();
    res.json(widgets);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки каталога' });
  }
});

// Получение виджетов пользователя
app.get('/api/widgets', authenticateToken, async (req, res) => {
  try {
    const userWidgets = await UserWidget.findAll({
      where: { user_id: req.userId },
      include: [{ model: Widget, as: 'widget' }],
      order: [['position', 'ASC']]
    });

    res.json(userWidgets.map(uw => ({
      id: uw.id,
      widgetId: uw.widget_id,
      name: uw.custom_name || uw.widget.name,
      type: uw.widget.type,
      settings: uw.settings || {},
      position: uw.position,
      room: uw.room
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка загрузки виджетов' });
  }
});

// Добавление виджета
app.post('/api/widgets', authenticateToken, async (req, res) => {
  try {
    const { widgetId, customName, settings, room } = req.body;

    const count = await UserWidget.count({ where: { user_id: req.userId } });
    if (count >= 5) {
      return res.status(400).json({ message: 'Максимум 5 виджетов' });
    }

    const maxPosition = await UserWidget.max('position', { where: { user_id: req.userId } }) || 0;

    const userWidget = await UserWidget.create({
      user_id: req.userId,
      widget_id: widgetId,
      custom_name: customName,
      settings: settings || {},
      room: room || 'general',
      position: maxPosition + 1
    });

    const widget = await Widget.findByPk(widgetId);

    res.status(201).json({
      id: userWidget.id,
      widgetId: userWidget.widget_id,
      name: userWidget.custom_name || widget.name,
      type: widget.type,
      settings: userWidget.settings || {},
      position: userWidget.position,
      room: userWidget.room
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка добавления виджета' });
  }
});

// Удаление виджета
app.delete('/api/widgets/:id', authenticateToken, async (req, res) => {
  try {
    await UserWidget.destroy({
      where: { id: req.params.id, user_id: req.userId }
    });
    res.json({ message: 'Виджет удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления виджета' });
  }
});

// ============== АДМИН ПАНЕЛЬ ==============

// Получение всех пользователей
app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json(users.map(u => ({
      id: u.id,
      login: u.login,
      lastName: u.last_name,
      firstName: u.first_name,
      middleName: u.middle_name,
      phone: u.phone,
      individualKey: u.individual_key,
      role: u.role,
      isActive: u.is_active,
      createdAt: u.createdAt
    })));
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки пользователей' });
  }
});

// Отправка уведомления
app.post('/api/admin/notifications', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    await Notification.create({
      user_id: userId,
      title,
      message,
      type: type || 'info'
    });
    res.json({ message: 'Уведомление отправлено' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка отправки уведомления' });
  }
});

// Блокировка/разблокировка пользователя
app.patch('/api/admin/users/:userId/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    await User.update(
      { is_active: isActive },
      { where: { id: req.params.userId } }
    );
    res.json({ message: `Пользователь ${isActive ? 'разблокирован' : 'заблокирован'}` });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка изменения статуса' });
  }
});

// ============== УВЕДОМЛЕНИЯ ==============

app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.userId },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json(notifications.map(n => ({
      ...n.toJSON(),
      isRead: n.is_read
    })));
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки уведомлений' });
  }
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { id: req.params.id, user_id: req.userId } }
    );
    res.json({ message: 'OK' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка' });
  }
});

// ============== ИНИЦИАЛИЗАЦИЯ БД ==============

// Функция для создания начальных данных
async function seedDatabase() {
  try {
    // Проверяем, есть ли уже виджеты
    const widgetCount = await Widget.count();
    if (widgetCount === 0) {
      console.log('📦 Создание начальных данных...');
      
      // Создаем виджеты
      await Widget.bulkCreate([
        { name: 'Лампа', type: 'lamp', icon: '💡', default_settings: { brightness: 50, warmth: 50 } },
        { name: 'Розетка', type: 'socket', icon: '⚡', default_settings: {} },
        { name: 'Влажность', type: 'humidity', icon: '💧', default_settings: {} },
        { name: 'Датчик движения', type: 'motion', icon: '🚶', default_settings: { sensitivity: 80 } },
        { name: 'Потребление', type: 'power', icon: '📊', default_settings: {} },
        { name: 'Аккумулятор', type: 'battery', icon: '🔋', default_settings: { capacity: 3000 } },
        { name: 'Замок', type: 'lock', icon: '🔒', default_settings: {} }
      ]);

      // Создаем админа
      const hashedPassword = await bcrypt.hash('Admin123', 10);
      const admin = await User.create({
        login: 'admin',
        password: hashedPassword,
        last_name: 'Админов',
        first_name: 'Админ',
        middle_name: 'Админович',
        phone: '+79990000001',
        individual_key: 'ADMIN001',
        role: 'admin',
        is_active: true
      });

      // Создаем тестового пользователя
      const userPassword = await bcrypt.hash('Test123', 10);
      const user = await User.create({
        login: 'test',
        password: userPassword,
        last_name: 'Иванов',
        first_name: 'Иван',
        middle_name: 'Иванович',
        phone: '+79991234567',
        individual_key: 'HOME123',
        role: 'user',
        is_active: true
      });

      // Добавляем виджеты тестовому пользователю
      const lampWidget = await Widget.findOne({ where: { type: 'lamp' } });
      if (lampWidget) {
        await UserWidget.create({
          user_id: user.id,
          widget_id: lampWidget.id,
          custom_name: 'Люстра',
          settings: { brightness: 50, warmth: 50 },
          room: 'living',
          position: 1
        });
      }

      console.log('✅ Тестовые данные созданы');
      console.log('👤 Админ: admin / Admin123');
      console.log('👤 Пользователь: test / Test123');
    } else {
      console.log('📊 Данные уже существуют, пропускаем инициализацию');
    }
  } catch (error) {
    console.error('❌ Ошибка при создании начальных данных:', error);
  }
}

// Синхронизация с базой данных
sequelize.sync({ force: true }).then(async () => {
  console.log('✅ База данных синхронизирована');
  
  // Создаем начальные данные
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`🌍 URL: http://localhost:${PORT}`);
    if (process.env.NODE_ENV === 'production') {
      console.log(`📡 Production mode: ${process.env.RENDER_EXTERNAL_URL || 'onrender.com'}`);
    }
  });
}).catch(err => {
  console.error('❌ Ошибка подключения к БД:', err);
  process.exit(1);
});