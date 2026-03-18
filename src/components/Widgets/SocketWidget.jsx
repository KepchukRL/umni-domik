import React, { useState, useEffect } from 'react';
import styles from './Widgets.module.css';

const SocketWidget = ({ id, name, onRemove }) => {
  const [isOn, setIsOn] = useState(false);
  const [power, setPower] = useState(0);

  useEffect(() => {
    if (isOn) {
      setPower(Math.floor(Math.random() * 150) + 50);
    } else {
      setPower(0);
    }
  }, [isOn]);

  return (
    <div className={styles.widget} style={{ opacity: isOn ? 1 : 0.7 }}>
      <div className={styles.widgetHeader}>
        <span className={styles.widgetName} title={name}>
          {name.length > 15 ? name.substring(0, 12) + '...' : name}
        </span>
        <button className={styles.removeButton} onClick={onRemove}>
          🗑️
        </button>
      </div>
      
      <div className={styles.widgetContent}>
        <div 
          className={styles.socketIcon}
          style={{
            color: isOn ? '#FFD700' : '#666',
            textShadow: isOn ? '0 0 10px #FFD700' : 'none'
          }}
        >
          ⚡
        </div>
        
        <div className={styles.socketInfo}>
          <div className={styles.socketPower}>{power} Вт</div>
          <label className={styles.switch}>
            <input 
              type="checkbox" 
              checked={isOn}
              onChange={(e) => setIsOn(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SocketWidget;