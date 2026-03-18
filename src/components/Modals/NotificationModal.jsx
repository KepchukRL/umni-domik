import React, { useState } from 'react';
import styles from './Modals.module.css';

const NotificationModal = ({ user, onClose, onSend }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Валидация заголовка
    if (!title.trim()) {
      newErrors.title = 'Заголовок обязателен для заполнения';
    } else if (title.length > 25) {
      newErrors.title = `Заголовок не должен превышать 25 символов (сейчас ${title.length})`;
    }

    // Валидация сообщения
    if (!message.trim()) {
      newErrors.message = 'Сообщение обязательно для заполнения';
    } else if (message.length > 100) {
      newErrors.message = `Сообщение не должно превышать 100 символов (сейчас ${message.length})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSend(user.id, title, message, type);
      onClose();
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    
    // Очищаем ошибку при вводе
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    
    // Очищаем ошибку при вводе
    if (errors.message) {
      setErrors(prev => ({ ...prev, message: '' }));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Отправка уведомления</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          <p className={styles.notificationUser}>
            Пользователь: {user.lastName} {user.firstName} (@{user.login})
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Заголовок {title.length}/25</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Например: Важное уведомление"
                className={errors.title ? styles.inputError : ''}
                maxLength={26} // Немного больше для плавного UI
                required
              />
              {errors.title && (
                <span className={styles.errorMessage}>{errors.title}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Тип уведомления</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="info">ℹ️ Информация</option>
                <option value="success">✅ Успех</option>
                <option value="warning">⚠️ Предупреждение</option>
                <option value="alert">🔴 Срочное</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Сообщение {message.length}/100</label>
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Введите текст уведомления..."
                rows="4"
                className={errors.message ? styles.inputError : ''}
                maxLength={101} // Немного больше для плавного UI
                required
              />
              {errors.message && (
                <span className={styles.errorMessage}>{errors.message}</span>
              )}
            </div>

            <div className={styles.modalActions}>
              <button 
                type="submit" 
                className={styles.primaryButton}
                disabled={title.length > 25 || message.length > 100}
              >
                Отправить
              </button>
              <button type="button" className={styles.secondaryButton} onClick={onClose}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;