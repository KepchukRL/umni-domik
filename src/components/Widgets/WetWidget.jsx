import React, { useState, useEffect } from 'react';
import styles from './Widgets.module.css';

const WetWidget = ({ id, name, onRemove }) => {
  const [humidity, setHumidity] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setHumidity(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        let newValue = prev + change;
        
        if (newValue < 35) newValue = 35;
        if (newValue > 55) newValue = 55;
        
        if (Math.abs(newValue - prev) > 3) {
          newValue = prev + (change > 0 ? 3 : -3);
        }
        
        return newValue;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getHumidityColor = () => {
    if (humidity < 40) return '#4ECDC4';
    if (humidity < 50) return '#45B7D1';
    return '#96CEB4';
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
        <div className={styles.wetIcon}>💧</div>
        <div className={styles.wetInfo}>
          <div 
            className={styles.wetProgress}
            style={{
              background: `conic-gradient(${getHumidityColor()} ${humidity * 3.6}deg, var(--border-color) 0deg)`
            }}
          >
            <div className={styles.wetInner}>
              {humidity}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WetWidget;