import React, { useState } from 'react';
import PinCodeModal from '../Modals/PinCodeModal';
import styles from './Widgets.module.css';

const LockWidget = ({ id, name, onRemove, settings = {} }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);
  
  // Получаем пин-код из настроек виджета или используем значение по умолчанию
  const correctPin = settings.pin || '1234';

  const handleUnlock = () => {
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    setIsLocked(false);
    alert('Дверь успешно открыта');
    
    // Автоматически закрываем через 5 секунд
    setTimeout(() => {
      setIsLocked(true);
    }, 5000);
  };

  const handlePinError = () => {
    alert('Неверный пин-код');
  };

  return (
    <>
      <div 
        className={`${styles.widget} ${isLocked ? styles.locked : styles.unlocked}`}
        onClick={handleUnlock}
      >
        <div className={styles.widgetHeader}>
          <span className={styles.widgetName} title={name}>
            {name.length > 15 ? name.substring(0, 12) + '...' : name}
          </span>
          <button 
            className={styles.removeButton} 
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            🗑️
          </button>
        </div>
        
        <div className={styles.widgetContent}>
          <div className={styles.lockIcon}>
            {isLocked ? '🔒' : '🔓'}
          </div>
          <div className={styles.lockStatus}>
            {isLocked ? 'Закрыто' : 'Открыто'}
          </div>
        </div>
      </div>

      {showPinModal && (
        <PinCodeModal
          onClose={() => setShowPinModal(false)}
          onSuccess={handlePinSuccess}
          onError={handlePinError}
          widgetName={name}
          correctPin={correctPin} // Передаем правильный пин-код
        />
      )}
    </>
  );
};

export default LockWidget;