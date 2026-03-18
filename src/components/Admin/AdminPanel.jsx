import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import NotificationModal from '../Modals/NotificationModal';
import api from '../../services/api';
import styles from './Admin.module.css';

const AdminPanel = ({ onNavigate, activePage }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (userId, title, message, type) => {
    try {
      await api.post('/admin/notifications', {
        userId,
        title,
        message,
        type
      });
      alert('Уведомление отправлено');
    } catch (error) {
      alert('Ошибка отправки уведомления');
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { isActive });
      loadUsers();
    } catch (error) {
      alert('Ошибка изменения статуса');
    }
  };

  const handleOpenNotificationModal = (user) => {
    setSelectedUser(user);
    setShowNotificationModal(true);
  };

  return (
    <div className={styles.adminPanel}>
      <div className={styles.navColumn}>
        <button 
          className={`${styles.navButton} ${activePage === 'main' ? styles.active : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          ← На главную
        </button>
        <button className={`${styles.navButton} ${styles.active}`}>
          Управление пользователями
        </button>
      </div>

      <div className={styles.adminContent}>
        <h2 className={styles.adminTitle}>Панель администратора</h2>
        
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : (
          <UserList 
            users={users}
            onSendNotification={handleOpenNotificationModal}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      {showNotificationModal && selectedUser && (
        <NotificationModal
          user={selectedUser}
          onClose={() => {
            setShowNotificationModal(false);
            setSelectedUser(null);
          }}
          onSend={handleSendNotification}
        />
      )}
    </div>
  );
};

export default AdminPanel;