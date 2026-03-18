import React, { useState, useEffect } from 'react';
import styles from './Widgets.module.css';

const MovingWidget = ({ id, name, onRemove, showLastMotion = true }) => {
  const [lastMotion, setLastMotion] = useState(new Date());
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsMoving(true);
        setLastMotion(new Date());
        
        setTimeout(() => {
          setIsMoving(false);
        }, 2000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatLastMotion = () => {
    return lastMotion.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ' ' + lastMotion.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <span className={styles.widgetName} title={name}>
          {name.length > 15 ? name.substring(0, 12) + '...' : name}
        </span>
        <button className={styles.removeButton} onClick={onRemove}>
          🗑️
        </button>
      </div>
      
      <div className={styles.widgetContent}>
        <div className={styles.movingIcon}>
          <span className={isMoving ? styles.moving : ''}>🚶</span>
        </div>
        
        {showLastMotion && (
          <div className={styles.movingInfo}>
            <div className={styles.movingText}>
              Последнее движение было в
            </div>
            <div className={styles.movingTime}>
              {formatLastMotion()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovingWidget;