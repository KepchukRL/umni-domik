import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './Modals.module.css';

const AddWidgetModal = ({ onClose, onAdd }) => {
  const [step, setStep] = useState(1);
  const [catalog, setCatalog] = useState([]);
  const [widgetData, setWidgetData] = useState({
    name: '',
    type: 'Лампа',
    widgetId: null,
    brightness: 50,
    warmth: 50,
    showLastMotion: false,
    batteryCapacity: '',
    pin: '',
    confirmPin: '',
    room: 'general'
  });

  const widgetTypes = [
    'Лампа', 'Розетка', 'Влажность', 'Датчик движения',
    'Потребление', 'Ёмкость аккумулятора', 'Замок'
  ];

  // Загрузка каталога виджетов из БД
  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      const response = await api.get('/widgets/catalog');
      setCatalog(response.data);
    } catch (error) {
      console.error('Ошибка загрузки каталога виджетов:', error);
    }
  };

  // Соответствие типов на русском и английском для БД
  const typeMapping = {
    'Лампа': 'lamp',
    'Розетка': 'socket',
    'Влажность': 'humidity',
    'Датчик движения': 'motion',
    'Потребление': 'power',
    'Ёмкость аккумулятора': 'battery',
    'Замок': 'lock'
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setWidgetData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (step === 1 && widgetData.name.trim()) {
      // Находим ID виджета в каталоге по выбранному типу
      const selectedType = typeMapping[widgetData.type];
      const selectedWidget = catalog.find(w => w.type === selectedType);

      if (selectedWidget) {
        setWidgetData(prev => ({
          ...prev,
          widgetId: selectedWidget.id,
          // Загружаем настройки по умолчанию из БД
          ...(selectedWidget.default_settings ? JSON.parse(selectedWidget.default_settings) : {})
        }));
      }
      setStep(2);
    }
  };

  const handleAdd = async () => {
    // Валидация для замка
    if (widgetData.type === 'Замок') {
      if (widgetData.pin !== widgetData.confirmPin) {
        alert('Пин-коды не совпадают');
        return;
      }
      if (!widgetData.pin || widgetData.pin.length !== 4) {
        alert('Пин-код должен состоять из 4 цифр');
        return;
      }
    }

    // Валидация для аккумулятора
    if (widgetData.type === 'Ёмкость аккумулятора' && !widgetData.batteryCapacity) {
      alert('Введите ёмкость аккумулятора');
      return;
    }

    // Формируем данные для отправки на сервер
    const widgetToAdd = {
      widgetId: widgetData.widgetId,
      customName: widgetData.name,
      room: widgetData.room,
      settings: {}
    };

    // Добавляем специфичные настройки в зависимости от типа
    switch (widgetData.type) {
      case 'Лампа':
        widgetToAdd.settings = {
          brightness: widgetData.brightness,
          warmth: widgetData.warmth
        };
        break;
      case 'Датчик движения':
        widgetToAdd.settings = {
          showLastMotion: widgetData.showLastMotion,
          sensitivity: 80 // значение по умолчанию
        };
        break;
      case 'Ёмкость аккумулятора':
        widgetToAdd.settings = {
          capacity: parseInt(widgetData.batteryCapacity)
        };
        break;
      case 'Замок':
        widgetToAdd.settings = {
          pin: widgetData.pin
        };
        break;
      default:
        widgetToAdd.settings = {};
    }

    // Вызываем функцию добавления из пропсов
    const result = await onAdd(widgetToAdd);
    if (result && result.success) {
      onClose();
    }
  };

  const renderTypeSpecificFields = () => {
    switch (widgetData.type) {
      case 'Лампа':
        return (
          <div className={styles.slidersContainer}>
            <div className={styles.sliderGroup}>
              <label>Яркость: {widgetData.brightness}%</label>
              <input
                type="range"
                name="brightness"
                min="0"
                max="100"
                value={widgetData.brightness}
                onChange={handleChange}
                className={styles.slider}
              />
            </div>
            <div className={styles.sliderGroup}>
              <label>Теплота: {widgetData.warmth}%</label>
              <input
                type="range"
                name="warmth"
                min="0"
                max="100"
                value={widgetData.warmth}
                onChange={handleChange}
                className={styles.slider}
              />
            </div>
          </div>
        );

      case 'Датчик движения':
        return (
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                name="showLastMotion"
                checked={widgetData.showLastMotion}
                onChange={handleChange}
              />
              Указывать последний момент движения
            </label>
          </div>
        );

      case 'Ёмкость аккумулятора':
        return (
          <div className={styles.formGroup}>
            <label>Ёмкость (мАч)</label>
            <input
              type="number"
              name="batteryCapacity"
              value={widgetData.batteryCapacity}
              onChange={handleChange}
              placeholder="Введите ёмкость"
              min="0"
            />
          </div>
        );

      case 'Замок':
        return (
          <>
            <div className={styles.formGroup}>
              <label>Пин-код (4 цифры)</label>
              <input
                type="password"
                name="pin"
                value={widgetData.pin}
                onChange={handleChange}
                maxLength="4"
                pattern="\d*"
                placeholder="Введите пин-код"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Повторите пин-код</label>
              <input
                type="password"
                name="confirmPin"
                value={widgetData.confirmPin}
                onChange={handleChange}
                maxLength="4"
                pattern="\d*"
                placeholder="Повторите пин-код"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Добавление виджета {step === 2 && `- ${widgetData.type}`}</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          {step === 1 ? (
            <>
              <div className={styles.formGroup}>
                <label>Название виджета</label>
                <input
                  type="text"
                  name="name"
                  value={widgetData.name}
                  onChange={handleChange}
                  placeholder="Введите название"
                  maxLength="20"
                  autoFocus
                />
              </div>

              <div className={styles.formGroup}>
                <label>Тип виджета</label>
                <select
                  name="type"
                  value={widgetData.type}
                  onChange={handleChange}
                  className={styles.select}
                >
                  {widgetTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Комната</label>
                <select
                  name="room"
                  value={widgetData.room}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="kitchen">Кухня</option>
                  <option value="living">Зал</option>
                  <option value="bedroom">Спальня</option>
                  <option value="bathroom">Ванная</option>
                  <option value="toilet">Туалет</option>
                  <option value="hallway">Коридор</option>
                  <option value="general">Общее</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className={styles.widgetTypeInfo}>
                <strong>Название:</strong> {widgetData.name}
              </div>
              <div className={styles.widgetTypeInfo}>
                <strong>Комната:</strong> {
                  widgetData.room === 'kitchen' ? 'Кухня' :
                    widgetData.room === 'living' ? 'Зал' :
                      widgetData.room === 'bedroom' ? 'Спальня' :
                        widgetData.room === 'bathroom' ? 'Ванная' :
                          widgetData.room === 'toilet' ? 'Туалет' :
                            widgetData.room === 'hallway' ? 'Коридор' : 'Общее'
                }
              </div>
              {renderTypeSpecificFields()}
            </>
          )}
        </div>

        <div className={styles.modalFooter}>
          {step === 1 ? (
            <>
              <button className={styles.secondaryButton} onClick={onClose}>
                Отмена
              </button>
              <button
                className={styles.primaryButton}
                onClick={handleNext}
                disabled={!widgetData.name.trim()}
              >
                Далее
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.secondaryButton}
                onClick={() => setStep(1)}
              >
                Назад
              </button>
              <button
                className={styles.primaryButton}
                onClick={handleAdd}
              >
                Добавить
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddWidgetModal;