import React from 'react';
import styles from './History.module.css';

const History = ({ onNavigate, activePage = 'history' }) => {
  return (
    <div className={styles.history}>
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

      <div className={styles.historyContent}>
        <div className={styles.developmentMessage}>
          <h2>Функция в разработке</h2>
          <p>Раздел истории пока недоступен</p>
          <div className={styles.placeholderIcon}><img src="/img/rem.svg" alt="" /></div>
          <p className={styles.hint}>
            Здесь будет отображаться история изменений параметров, 
            события системы и действия пользователей
          </p>
        </div>
      </div>
    </div>
  );
};

export default History;