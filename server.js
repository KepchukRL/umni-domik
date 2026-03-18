const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes, Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002; // Render задает PORT

// Создаем директорию для базы данных, если её нет
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Настройки CORS для продакшена
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://your-frontend.onrender.com'
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// ============== НАСТРОЙКА БАЗЫ ДАННЫХ ==============

// Используем путь внутри контейнера, но с persistent disk
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '/tmp/smart_home.db',
  logging: false
});

// ... остальные модели остаются без изменений ...

// ============== ИНИЦИАЛИЗАЦИЯ БД ==============

sequelize.sync({ force: process.env.NODE_ENV !== 'production' }).then(async () => {
  console.log('✅ База данных создана');

  // Проверяем, есть ли уже админ
  const adminExists = await User.findOne({ where: { role: 'admin' } });

  if (!adminExists) {
    // Создаем виджеты только если их нет
    const widgetsCount = await Widget.count();
    if (widgetsCount === 0) {
      await Widget.bulkCreate([
        { name: 'Лампа', type: 'lamp', icon: '💡', default_settings: '{"brightness":50,"warmth":50}' },
        { name: 'Розетка', type: 'socket', icon: '⚡', default_settings: '{}' },
        { name: 'Влажность', type: 'humidity', icon: '💧', default_settings: '{}' },
        { name: 'Датчик движения', type: 'motion', icon: '🚶', default_settings: '{"sensitivity":80}' },
        { name: 'Потребление', type: 'power', icon: '📊', default_settings: '{}' },
        { name: 'Аккумулятор', type: 'battery', icon: '🔋', default_settings: '{"capacity":3000}' },
        { name: 'Замок', type: 'lock', icon: '🔒', default_settings: '{}' }
      ]);
    }

    // Создаем админа
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123', 10);
    await User.create({
      login: process.env.ADMIN_LOGIN || 'admin',
      password: hashedPassword,
      last_name: 'Админов',
      first_name: 'Админ',
      middle_name: 'Админович',
      phone: process.env.ADMIN_PHONE || '+79990000001',
      individual_key: process.env.ADMIN_KEY || 'ADMIN001',
      role: 'admin'
    });

    // Создаем тестового пользователя (только для разработки)
    if (process.env.NODE_ENV !== 'production') {
      const userPassword = await bcrypt.hash('Test123', 10);
      const user = await User.create({
        login: 'test',
        password: userPassword,
        last_name: 'Иванов',
        first_name: 'Иван',
        middle_name: 'Иванович',
        phone: '+79991234567',
        individual_key: 'HOME123',
        role: 'user'
      });

      await UserWidget.create({
        user_id: user.id,
        widget_id: 1,
        custom_name: 'Люстра',
        settings: '{"brightness":50,"warmth":50}',
        room: 'living',
        position: 1
      });
    }

    console.log('✅ Начальные данные созданы');
  }

  app.listen(PORT, '0.0.0.0', () => { // Важно: слушаем все интерфейсы
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Ошибка:', err);
  process.exit(1);
});