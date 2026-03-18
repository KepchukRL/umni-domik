import { useState, useEffect } from 'react';
import api from '../services/api';

export const useWidgets = () => {
  const [widgets, setWidgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWidgets();
  }, []);

  const loadWidgets = async () => {
    try {
      const response = await api.get('/widgets');
      setWidgets(response.data);
    } catch (err) {
      setError('Ошибка загрузки виджетов');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addWidget = async (widgetData) => {
    try {
      const response = await api.post('/widgets', widgetData);
      setWidgets(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Ошибка добавления виджета' 
      };
    }
  };

  const removeWidget = async (id) => {
    try {
      await api.delete(`/widgets/${id}`);
      setWidgets(prev => prev.filter(w => w.id !== id));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Ошибка удаления виджета' 
      };
    }
  };

  const updateWidget = async (id, updates) => {
    try {
      const response = await api.put(`/widgets/${id}`, updates);
      setWidgets(prev => prev.map(w => w.id === id ? response.data : w));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Ошибка обновления виджета' 
      };
    }
  };

  return {
    widgets,
    loading,
    error,
    addWidget,
    removeWidget,
    updateWidget,
    refresh: loadWidgets
  };
};