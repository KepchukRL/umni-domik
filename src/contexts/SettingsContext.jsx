import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : {
      temperatureUnit: 'celsius',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const convertTemperature = (celsius) => {
    if (settings.temperatureUnit === 'fahrenheit') {
      return Math.round((celsius * 9/5) + 32);
    }
    return celsius;
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      convertTemperature
    }}>
      {children}
    </SettingsContext.Provider>
  );
};