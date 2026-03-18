import React, { useState, useEffect } from 'react';
import styles from './Widgets.module.css';

const WattmetrWidget = ({ id, name, onRemove }) => {
  const [consumption, setConsumption] = useState(500);

  useEffect(() => {
    const interval = setInterval(() => {
      setConsumption(prev => {
        const change = Math.floor(Math.random() * 21) - 10;
        let newValue = prev + change;
        
        if (newValue < 352) newValue = 352;
        if (newValue > 758) newValue = 758;
        
        if (Math.abs(newValue - prev) > 10) {
          newValue = prev + (change > 0 ? 10 : -10);
        }
        
        return newValue;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getConsumptionColor = () => {
    if (consumption < 500) return '#4ECDC4';
    if (consumption < 650) return '#FFD700';
    return '#FF6B6B';
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
        <div className={styles.wattmetrIcon}>⚡</div>
        <div className={styles.wattmetrInfo}>
          <div 
            className={styles.wattmetrValue}
            style={{ color: getConsumptionColor() }}
          >
            {consumption}
          </div>
          <div className={styles.wattmetrUnit}>Вт</div>
        </div>
      </div>
    </div>
  );
};

export default WattmetrWidget;