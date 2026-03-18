const { sequelize, User, Widget, UserWidget, Notification } = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('Очистка базы данных...');
    await sequelize.sync({ force: true });

    console.log('Создание виджетов...');
    const widgets = await Widget.bulkCreate([
      {
        name: 'Лампа',
        type: 'lamp',
        icon: '💡',
        default_settings: { brightness: 50, warmth: 50 },
        description: 'Управление освещением'
      },
      {
        name: 'Розетка',
        type: 'socket',
        icon: '⚡',
        default_settings: {},
        description: 'Умная розетка'
      },
      {
        name: 'Влажность',
        type: 'humidity',
        icon: '💧',
        default_settings: { alert_threshold: 70 },
        description: 'Датчик влажности'
      },
      {
        name: 'Датчик движения',
        type: 'motion',
        icon: '🚶',
        default_settings: { sensitivity: 80 },
        description: 'Детектор движения'
      },
      {
        name: 'Потребление',
        type: 'power',
        icon: '📊',
        default_settings: {},
        description: 'Измерение энергопотребления'
      },
      {
        name: 'Аккумулятор',
        type: 'battery',
        icon: '🔋',
        default_settings: { capacity: 3000 },
        description: 'Уровень заряда батареи'
      },
      {
        name: 'Замок',
        type: 'lock',
        icon: '🔒',
        default_settings: {},
        description: 'Умный замок'
      }
    ]);

    console.log('Создание администратора...');
    const adminPassword = await bcrypt.hash('Admin123', 10);
    const admin = await User.create({
      login: 'admin',
      password: adminPassword,
      last_name: 'Админов',
      first_name: 'Админ',
      middle_name: 'Админович',
      phone: '+79990000001',
      individual_key: 'ADMIN001',
      role: 'admin'
    });

    console.log('Создание тестового пользователя...');
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

    console.log('Создание виджетов для пользователя...');
    await UserWidget.bulkCreate([
      {
        user_id: user.id,
        widget_id: widgets[0].id,
        custom_name: 'Люстра кухонная',
        settings: { brightness: 50, warmth: 50 },
        room: 'kitchen',
        position: 1
      },
      {
        user_id: user.id,
        widget_id: widgets[0].id,
        custom_name: 'Торшер',
        settings: { brightness: 30, warmth: 70 },
        room: 'living',
        position: 2
      },
      {
        user_id: user.id,
        widget_id: widgets[6].id,
        custom_name: 'Входная дверь',
        settings: { pin: '1234' },
        room: 'hallway',
        position: 3
      },
      {
        user_id: user.id,
        widget_id: widgets[3].id,
        custom_name: 'Датчик в зале',
        settings: { sensitivity: 80 },
        room: 'living',
        position: 4
      }
    ]);

    console.log('Создание тестовых уведомлений...');
    await Notification.bulkCreate([
      {
        user_id: user.id,
        title: 'Добро пожаловать!',
        message: 'Рады видеть вас в системе УмныйДом',
        type: 'success'
      },
      {
        user_id: user.id,
        title: 'Обновление системы',
        message: 'Доступно новое обновление',
        type: 'info'
      },
      {
        user_id: admin.id,
        title: 'Новый пользователь',
        message: 'Зарегистрирован новый пользователь: test',
        type: 'info'
      }
    ]);

    console.log('✅ База данных успешно заполнена!');
    console.log('📊 Администратор: admin / Admin123');
    console.log('👤 Пользователь: test / Test123');

  } catch (error) {
    console.error('❌ Ошибка заполнения БД:', error);
  } finally {
    process.exit();
  }
}

seed();