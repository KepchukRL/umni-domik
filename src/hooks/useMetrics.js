import { useEffect } from 'react';

export const useMetrics = (metrics, setMetrics) => {
  useEffect(() => {
    const updateConsumption = () => {
      setMetrics(prev => {
        const change = Math.floor(Math.random() * 121) - 60;
        let newValue = prev.consumption + change;
        
        if (newValue < 250) newValue = 250;
        if (newValue > 1150) newValue = 1150;
        
        if (Math.abs(newValue - prev.consumption) > 60) {
          newValue = prev.consumption + (change > 0 ? 60 : -60);
        }
        
        return { ...prev, consumption: newValue };
      });
    };

    const updateOutsideTemp = () => {
      setMetrics(prev => {
        const change = (Math.random() * 2 - 1);
        let newValue = prev.outsideTemp + change;
        
        if (newValue < -10) newValue = -10;
        if (newValue > 0) newValue = 0;
        
        if (Math.abs(newValue - prev.outsideTemp) > 1) {
          newValue = prev.outsideTemp + (change > 0 ? 1 : -1);
        }
        
        return { ...prev, outsideTemp: Math.round(newValue * 10) / 10 };
      });
    };

    const updateInsideTemp = () => {
      setMetrics(prev => {
        const change = (Math.random() * 4 - 2);
        let newValue = prev.insideTemp + change;
        
        if (newValue < 16) newValue = 16;
        if (newValue > 28) newValue = 28;
        
        if (Math.abs(newValue - prev.insideTemp) > 2) {
          newValue = prev.insideTemp + (change > 0 ? 2 : -2);
        }
        
        return { ...prev, insideTemp: Math.round(newValue * 10) / 10 };
      });
    };

    const updateHumidity = () => {
      setMetrics(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        let newValue = prev.humidity + change;
        
        if (newValue < 40) newValue = 40;
        if (newValue > 60) newValue = 60;
        
        if (Math.abs(newValue - prev.humidity) > 2) {
          newValue = prev.humidity + (change > 0 ? 2 : -2);
        }
        
        return { ...prev, humidity: newValue };
      });
    };

    const updateInternetSpeed = () => {
      setMetrics(prev => {
        const change = Math.floor(Math.random() * 21) - 10;
        let newValue = prev.internetSpeed + change;
        
        if (newValue < 95) newValue = 95;
        if (newValue > 125) newValue = 125;
        
        if (Math.abs(newValue - prev.internetSpeed) > 10) {
          newValue = prev.internetSpeed + (change > 0 ? 10 : -10);
        }
        
        return { ...prev, internetSpeed: newValue };
      });
    };

    const consumptionInterval = setInterval(updateConsumption, 5000);
    const outsideTempInterval = setInterval(updateOutsideTemp, 600000);
    const insideTempInterval = setInterval(updateInsideTemp, 120000);
    const humidityInterval = setInterval(updateHumidity, 120000);
    const internetInterval = setInterval(updateInternetSpeed, 10000);

    return () => {
      clearInterval(consumptionInterval);
      clearInterval(outsideTempInterval);
      clearInterval(insideTempInterval);
      clearInterval(humidityInterval);
      clearInterval(internetInterval);
    };
  }, [setMetrics]);

  return metrics;
};