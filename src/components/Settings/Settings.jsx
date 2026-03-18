import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { SettingsContext } from '../../contexts/SettingsContext';
import { TIMEZONES } from '../../utils/constants';
import styles from './Settings.module.css';

const Settings = ({ onNavigate, activePage = 'settings' }) => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const { settings, updateSettings, convertTemperature } = useContext(SettingsContext);
  
  const [localSettings, setLocalSettings] = useState({
    temperatureUnit: settings.temperatureUnit,
    timezone: settings.timezone
  });

  useEffect(() => {
    setLocalSettings({
      temperatureUnit: settings.temperatureUnit,
      timezone: settings.timezone
    });
  }, [settings]);

  const handleThemeChange = (theme) => {
    if ((theme === 'light' && isDarkTheme) || (theme === 'dark' && !isDarkTheme)) {
      toggleTheme();
    }
  };

  const handleTemperatureChange = (unit) => {
    setLocalSettings(prev => ({ ...prev, temperatureUnit: unit }));
  };

  const handleTimezoneChange = (e) => {
    setLocalSettings(prev => ({ ...prev, timezone: e.target.value }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
  };

  const handleCancel = () => {
    setLocalSettings({
      temperatureUnit: settings.temperatureUnit,
      timezone: settings.timezone
    });
  };

  const previewTemp = 22;

  return (
    <div className={styles.settings}>
      <div className={styles.navColumn}>
        <button 
          className={`${styles.navButton} ${activePage === 'main' ? styles.active : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          Главная
        </button>
        <button 
          className={`${styles.navButton} ${activePage === 'settings' ? styles.active : ''}`}
          onClick={() => onNavigate('settings')}
        >
          Настройки
        </button>
        <button 
          className={`${styles.navButton} ${activePage === 'history' ? styles.active : ''}`}
          onClick={() => onNavigate('history')}
        >
          История
        </button>
      </div>

      <div className={styles.settingsContent}>
        <h2 className={styles.settingsTitle}>Настройки системы</h2>
        
        <div className={styles.settingsSection}>
          <h3 className={styles.sectionTitle}>Оформление</h3>
          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>Тема оформления</span>
            <div className={styles.themeToggle}>
              <button 
                className={`${styles.themeButton} ${!isDarkTheme ? styles.active : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                Светлая
              </button>
              <button 
                className={`${styles.themeButton} ${isDarkTheme ? styles.active : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                Темная
              </button>
            </div>
          </div>
        </div>

        <div className={styles.settingsSection}>
          <h3 className={styles.sectionTitle}>Единицы измерения</h3>
          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>Температура</span>
            <div className={styles.unitToggle}>
              <button 
                className={`${styles.unitButton} ${localSettings.temperatureUnit === 'celsius' ? styles.active : ''}`}
                onClick={() => handleTemperatureChange('celsius')}
              >
                °C (Цельсий)
              </button>
              <button 
                className={`${styles.unitButton} ${localSettings.temperatureUnit === 'fahrenheit' ? styles.active : ''}`}
                onClick={() => handleTemperatureChange('fahrenheit')}
              >
                °F (Фаренгейт)
              </button>
            </div>
            <div className={styles.preview}>
              Предпросмотр: {previewTemp}°C = {convertTemperature(previewTemp)}°
              {localSettings.temperatureUnit === 'celsius' ? 'C' : 'F'}
            </div>
          </div>
        </div>

        <div className={styles.settingsSection}>
          <h3 className={styles.sectionTitle}>Часовой пояс</h3>
          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>Регион</span>
            <select 
              className={styles.timezoneSelect}
              value={localSettings.timezone}
              onChange={handleTimezoneChange}
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>
                  {tz.replace('/', ' / ')}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.preview}>
            Текущее время: {new Date().toLocaleString('ru-RU', { timeZone: localSettings.timezone })}
          </div>
        </div>

        <div className={styles.settingsActions}>
          <button 
            className={styles.saveButton}
            onClick={handleSave}
          >
            Сохранить изменения
          </button>
          <button 
            className={styles.cancelButton}
            onClick={handleCancel}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;