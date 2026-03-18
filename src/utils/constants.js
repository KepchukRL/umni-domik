export const ROOMS = {
  kitchen: 'Кухня',
  living: 'Зал',
  bedroom: 'Спальня',
  bathroom: 'Ванная',
  toilet: 'Туалет',
  hallway: 'Коридор',
  general: 'Общее'
};

export const ROOM_COLORS = {
  kitchen: '#FF6B6B',
  living: '#4ECDC4',
  bedroom: '#FFEAA7',
  bathroom: '#45B7D1',
  toilet: '#96CEB4',
  hallway: '#D4A5A5',
  general: '#9F75EE'
};

export const WIDGET_TYPES = [
  { value: 'lamp', label: 'Лампа', icon: '💡' },
  { value: 'socket', label: 'Розетка', icon: '⚡' },
  { value: 'humidity', label: 'Влажность', icon: '💧' },
  { value: 'motion', label: 'Датчик движения', icon: '🚶' },
  { value: 'power', label: 'Потребление', icon: '📊' },
  { value: 'battery', label: 'Аккумулятор', icon: '🔋' },
  { value: 'lock', label: 'Замок', icon: '🔒' }
];

export const METRIC_RANGES = {
  consumption: { min: 250, max: 1150, step: 60 },
  outsideTemp: { min: -10, max: 0, step: 1 },
  insideTemp: { min: 16, max: 28, step: 2 },
  humidity: { min: 40, max: 60, step: 2 },
  internetSpeed: { min: 95, max: 125, step: 10 }
};

export const TIMEZONES = [
  'Europe/Moscow',
  'Europe/Kaliningrad',
  'Europe/Samara',
  'Asia/Yekaterinburg',
  'Asia/Omsk',
  'Asia/Krasnoyarsk',
  'Asia/Irkutsk',
  'Asia/Yakutsk',
  'Asia/Vladivostok',
  'Asia/Kamchatka'
];