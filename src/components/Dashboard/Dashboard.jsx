import React, { useState, useEffect, useRef } from 'react';
import MetricsBar from './MetricsBar';
import WidgetsGrid from './WidgetsGrid';
import AddWidgetModal from '../Modals/AddWidgetModal';
import { useWidgets } from '../../hooks/useWidgets';
import styles from './Dashboard.module.css';

const Dashboard = ({ onNavigate, activePage = 'main' }) => {
  const [activePageInternal, setActivePageInternal] = useState('main');
  const [showAddWidget, setShowAddWidget] = useState(false);
  const { widgets, addWidget, removeWidget } = useWidgets();

  const [cameraUrl, setCameraUrl] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [savedCameraUrl, setSavedCameraUrl] = useState('');
  const iframeRef = useRef(null);

  // Загружаем сохраненную ссылку при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('cameraUrl');
    if (saved) {
      setSavedCameraUrl(saved);
      setCameraUrl(saved);
    }
  }, []);

  const [roomConsumption] = useState({
    kitchen: 35,
    living: 25,
    toilet: 10,
    bathroom: 15,
    bedroom: 12,
    hallway: 3
  });

  // Функция для извлечения URL из iframe кода OBS ninja
  const extractObsUrl = (input) => {
    // Если это уже прямой URL
    if (input.match(/^https?:\/\/.+/)) {
      return input;
    }
    
    // Если это iframe код, пытаемся извлечь src
    const srcMatch = input.match(/src="([^"]+)"/);
    if (srcMatch) {
      return srcMatch[1];
    }
    
    return input;
  };

  // Функция для обработки OBS ninja ссылок
  const processObsUrl = (url) => {
    // Очищаем URL от лишних параметров
    let processedUrl = url.trim();
    
    // Если это obs.ninja ссылка, добавляем параметры для лучшей совместимости
    if (processedUrl.includes('obs.ninja')) {
      // Добавляем параметры если их нет
      if (!processedUrl.includes('?')) {
        processedUrl += '?autostart=true&codec=h264';
      } else if (!processedUrl.includes('autostart')) {
        processedUrl += '&autostart=true';
      }
    }
    
    return processedUrl;
  };

  const handleCameraUrlChange = (e) => {
    setCameraUrl(e.target.value);
    setCameraError('');
  };

  const handleConnectCamera = () => {
    if (!cameraUrl.trim()) {
      setCameraError('Введите ссылку на камеру');
      return;
    }

    setIsCameraLoading(true);
    setCameraError('');

    try {
      // Извлекаем URL из введенных данных
      const extractedUrl = extractObsUrl(cameraUrl);
      const processedUrl = processObsUrl(extractedUrl);
      
      // Проверяем, что это валидный URL
      new URL(processedUrl);
      
      // Сохраняем URL
      setSavedCameraUrl(processedUrl);
      localStorage.setItem('cameraUrl', processedUrl);
      
      // Очищаем поле ввода после успешного подключения
      setCameraUrl('');
      
    } catch (error) {
      setCameraError('Неверный формат ссылки. Пожалуйста, введите корректный URL или iframe код из OBS ninja');
    } finally {
      setIsCameraLoading(false);
    }
  };

  const handleDisconnectCamera = () => {
    setSavedCameraUrl('');
    localStorage.removeItem('cameraUrl');
    setCameraError('');
  };

  const getCurrentDate = () => {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const date = new Date();
    return {
      day: days[date.getDay()],
      date: date.toLocaleDateString('ru-RU')
    };
  };

  const handleNavigate = (page) => {
    if (page === 'settings' || page === 'history' || page === 'admin') {
      onNavigate(page);
    } else {
      setActivePageInternal(page);
    }
  };

  const handleAddWidget = async (widgetData) => {
    const result = await addWidget(widgetData);
    if (!result.success) {
      alert(result.message);
    }
  };

  const handleRemoveWidget = async (id) => {
    const result = await removeWidget(id);
    if (!result.success) {
      alert(result.message);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.mainContent}>
        <div className={styles.firstLine}>
          <div className={styles.navColumn}>
            <button
              className={`${styles.navButton} ${activePageInternal === 'main' ? styles.active : ''}`}
              onClick={() => handleNavigate('main')}
            >
              Главная
            </button>
            <button
              className={`${styles.navButton} ${activePage === 'settings' ? styles.active : ''}`}
              onClick={() => handleNavigate('settings')}
            >
              Настройки
            </button>
            <button
              className={`${styles.navButton} ${activePage === 'history' ? styles.active : ''}`}
              onClick={() => handleNavigate('history')}
            >
              История
            </button>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <h3>Камера</h3>
              <div className={styles.cameraContainer}>
                {!savedCameraUrl ? (
                  <>
                    <div className={styles.cameraInputGroup}>
                      <input
                        type="text"
                        placeholder="Вставьте ссылку или iframe код из OBS ninja"
                        value={cameraUrl}
                        onChange={handleCameraUrlChange}
                        className={`${styles.cameraInput} ${cameraError ? styles.inputError : ''}`}
                      />
                      <button 
                        onClick={handleConnectCamera}
                        disabled={isCameraLoading || !cameraUrl.trim()}
                        className={styles.connectButton}
                      >
                        {isCameraLoading ? 'Подключение...' : 'Подключить'}
                      </button>
                    </div>
                    {cameraError && (
                      <div className={styles.errorMessage}>{cameraError}</div>
                    )}
                    <div className={styles.obsHint}>
                      <small>
                      </small>
                    </div>
                  </>
                ) : (
                  <div className={styles.cameraPreview}>
                    <div className={styles.cameraHeader}>
                      <span className={styles.cameraStatus}>
                        <span className={styles.statusDot}></span>
                        Подключено
                      </span>
                      <button 
                        onClick={handleDisconnectCamera}
                        className={styles.disconnectButton}
                      >
                        Отключить
                      </button>
                    </div>
                    <iframe
                      ref={iframeRef}
                      src={savedCameraUrl}
                      title="Camera feed"
                      width="100%"
                      height="200"
                      frameBorder="0"
                      allow="autoplay; camera; microphone; display-capture"
                      allowFullScreen
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-top-navigation"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.metricCard}>
              <h3>Потребление комнат</h3>
              <div className={styles.consumptionContainer}>
                <div className={styles.donutChart}>
                  <svg viewBox="0 0 100 100" className={styles.donut}>
                    {Object.entries(roomConsumption).map(([room, percent], index) => {
                      const colors = ['#06C985', '#FFAC4F', '#EE423C', '#833FA1', '#1E8EFA', '#FEEF06'];
                      const offset = Object.values(roomConsumption)
                        .slice(0, index)
                        .reduce((acc, val) => acc + val, 0);

                      return (
                        <circle
                          key={room}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={colors[index]}
                          strokeWidth="10"
                          strokeDasharray={`${percent} ${100 - percent}`}
                          strokeDashoffset={-offset}
                          transform="rotate(-90 50 50)"
                          style={{ transition: 'stroke-dashoffset 0.3s' }}
                        />
                      );
                    })}
                  </svg>
                </div>
                <div className={styles.roomList}>
                  {Object.entries(roomConsumption).map(([room, percent], index) => {
                    const colors = ['#06C985', '#FFAC4F', '#EE423C', '#833FA1', '#1E8EFA', '#FEEF06'];
                    const roomNames = {
                      kitchen: 'Кухня',
                      living: 'Зал',
                      toilet: 'Туалет',
                      bathroom: 'Ванна',
                      bedroom: 'Спальня',
                      hallway: 'Коридор'
                    };
                    return (
                      <div key={room} className={styles.roomItem}>
                        <span className={styles.colorDot} style={{ backgroundColor: colors[index] }} />
                        <span className={styles.roomName}>{roomNames[room]}</span>
                        <span className={styles.roomPercent}>{percent}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <h3>Календарь</h3>
              <div className={styles.calendar}>
                <div className={styles.day}>{getCurrentDate().day}</div>
                <div className={styles.date}>{getCurrentDate().date}</div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <h3>Количество виджетов</h3>
              <div className={styles.widgetCount}>
                <span className={styles.count}>{widgets.length}</span>
                <span className={styles.maxCount}>/5</span>
              </div>
            </div>

            <div className={`${styles.metricCard} ${styles.fullWidth}`}>
              <MetricsBar />
            </div>
          </div>
        </div>

        <div className={styles.secondLine}>
          <button
            className={styles.addWidgetButton}
            onClick={() => setShowAddWidget(true)}
          >
            <span className={styles.plusIcon}>+</span>
          </button>

          <WidgetsGrid
            widgets={widgets}
            onRemove={handleRemoveWidget}
          />
        </div>

        {showAddWidget && (
          <AddWidgetModal
            onClose={() => setShowAddWidget(false)}
            onAdd={handleAddWidget}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;