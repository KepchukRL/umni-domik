import React, { useState, useEffect } from 'react';
import styles from './Widgets.module.css';

const BatteryWidget = ({ id, name, onRemove, capacity = 3000 }) => {
  const [level, setLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLevel(prev => {
        if (isCharging) {
          const newLevel = Math.min(prev + 2, 100);
          if (newLevel === 100) setIsCharging(false);
          return newLevel;
        } else {
          const newLevel = Math.max(prev - 1, 5);
          if (newLevel === 5 && Math.random() > 0.8) {
            setIsCharging(true);
          }
          return newLevel;
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isCharging]);

  const getBatteryColor = () => {
    if (level < 20) return '#FF6B6B';
    if (level < 50) return '#FFD700';
    return '#4ECDC4';
  };

  const getBatteryIcon = () => {
    if (isCharging) return '🔌';
    if (level < 20) return '🪫';
    return '🔋';
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
        <div className={styles.batteryIcon}>
          {getBatteryIcon()}
        </div>
        
        <div className={styles.batteryInfo}>
          <div className={styles.batteryLevel}>
            <div 
              className={styles.batteryFill}
              style={{
                width: `${level}%`,
                backgroundColor: getBatteryColor()
              }}
            />
          </div>
          <div className={styles.batteryPercentage}>{level}%</div>
          <div className={styles.batteryCapacity}>{capacity} мАч</div>
        </div>
      </div>
    </div>
  );
};

export default BatteryWidget;