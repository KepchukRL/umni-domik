import React, { useState, useContext } from 'react';
import { useMetrics } from '../../hooks/useMetrics';
import { SettingsContext } from '../../contexts/SettingsContext';
import styles from './MetricsBar.module.css';

const MetricsBar = () => {
  const { convertTemperature } = useContext(SettingsContext);
  const [metrics, setMetrics] = useState({
    consumption: 700,
    outsideTemp: -5,
    insideTemp: 22,
    humidity: 50,
    internetSpeed: 110
  });

  const updatedMetrics = useMetrics(metrics, setMetrics);

  return (
    <div className={styles.metricsBar}>
      <div className={styles.metric}>
        <span className={styles.metricLabel}>Потребление</span>
        <span className={styles.metricValue}>{updatedMetrics.consumption} Вт</span>
      </div>
      
      <div className={styles.metric}>
        <span className={styles.metricLabel}>Темп. снаружи</span>
        <span className={styles.metricValue}>
          {convertTemperature(updatedMetrics.outsideTemp)}°
          {convertTemperature(0) !== 0 ? 'F' : 'C'}
        </span>
      </div>
      
      <div className={styles.metric}>
        <span className={styles.metricLabel}>Темп. внутри</span>
        <span className={styles.metricValue}>
          {convertTemperature(updatedMetrics.insideTemp)}°
          {convertTemperature(0) !== 0 ? 'F' : 'C'}
        </span>
      </div>
      
      <div className={styles.metric}>
        <span className={styles.metricLabel}>Влажность</span>
        <span className={styles.metricValue}>{updatedMetrics.humidity}%</span>
      </div>
      
      <div className={styles.metric}>
        <span className={styles.metricLabel}>Скорость интернета</span>
        <span className={styles.metricValue}>{updatedMetrics.internetSpeed} Мбит/с</span>
      </div>
    </div>
  );
};

export default MetricsBar;