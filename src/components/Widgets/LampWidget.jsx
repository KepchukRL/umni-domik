import React, { useState } from 'react';
import styles from './Widgets.module.css';

const LampWidget = ({ id, name, onRemove, initialBrightness = 50, initialWarmth = 50 }) => {
  const [isOn, setIsOn] = useState(false);
  const [brightness, setBrightness] = useState(initialBrightness);
  const [warmth, setWarmth] = useState(initialWarmth);

  const getLightColor = () => {
    if (!isOn) return '#666';
    const warmColor = [255, 200, 100];
    const coldColor = [200, 230, 255];
    const mixed = warmColor.map((warm, i) => 
      Math.round(warm * (1 - warmth/100) + coldColor[i] * (warmth/100))
    );
    return `rgb(${mixed.join(',')})`;
  };

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
          className={styles.lampIcon}
          style={{
            color: getLightColor(),
            textShadow: isOn ? `0 0 10px ${getLightColor()}` : 'none'
          }}
        >
          💡
        </div>
        
        <div className={styles.lampControls}>
          <label className={styles.switch}>
            <input 
              type="checkbox" 
              checked={isOn}
              onChange={(e) => setIsOn(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
          
          {isOn && (
            <div className={styles.lampSliders}>
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className={styles.smallSlider}
                title="Яркость"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={warmth}
                onChange={(e) => setWarmth(Number(e.target.value))}
                className={styles.smallSlider}
                title="Теплота"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LampWidget;