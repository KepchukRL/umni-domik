import React, { useState, useContext, useCallback, useMemo, useEffect, useRef } from 'react';
import UserInfoModal from '../Modals/UserInfoModal';
import { AuthContext } from '../../contexts/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import styles from './Header.module.css';

const Header = ({ onNavigate, currentPage }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useContext(AuthContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useContext(NotificationContext);
  
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Закрытие дропдаунов при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (page) => {
    onNavigate(page);
    setShowUserMenu(false);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    onNavigate('login');
  };

  const handleNotificationClick = useCallback((notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  }, [markAsRead]);

  // Мемоизируем список уведомлений
  const notificationItems = useMemo(() => {
    return notifications.map(notification => (
      <div 
        key={notification.id}
        className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className={styles.notificationIcon}>
          {notification.type === 'success' && '✅'}
          {notification.type === 'warning' && '⚠️'}
          {notification.type === 'alert' && '🔴'}
          {notification.type === 'info' && 'ℹ️'}
        </div>
        <div className={styles.notificationContent}>
          <div className={styles.notificationTitle}>
            {notification.title}
          </div>
          <div className={styles.notificationMessage}>
            {notification.message}
          </div>
          <div className={styles.notificationTime}>
            {new Date(notification.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    ));
  }, [notifications, handleNotificationClick]);

  if (!isAuthenticated) {
    return (
      <header className={styles.header}>
        <div className={styles.logo}>УмныйДом</div>
        <div className={styles.rightSection}>
          <button 
            className={styles.loginButton}
            onClick={() => handleNavigation('login')}
          >
            Войти
          </button>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>УмныйДом</div>
        
        <div className={styles.rightSection}>
          {isAdmin && (
            <button 
              className={`${styles.navButton} ${currentPage === 'admin' ? styles.active : ''}`}
              onClick={() => handleNavigation('admin')}
            >
              Админ панель
            </button>
          )}
          
          <div className={styles.notificationContainer} ref={notificationRef}>
            <button 
              className={styles.iconButton}
              onClick={() => setShowNotifications(prev => !prev)}
            >
              <span role="img" aria-label="уведомления">
                <img className={styles.Uved} src="/img/uved.svg" alt="Уведомления" />
              </span>
              {unreadCount > 0 && (
                <span className={styles.badge}>{unreadCount}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className={styles.notificationDropdown}>
                <div className={styles.notificationHeader}>
                  <h4>Уведомления</h4>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className={styles.markAllRead}>
                      Отметить все
                    </button>
                  )}
                </div>
                
                <div className={styles.notificationList}>
                  {notifications.length === 0 ? (
                    <div className={styles.noNotifications}>
                      Нет уведомлений
                    </div>
                  ) : (
                    notificationItems
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.userMenuContainer} ref={userMenuRef}>
            <button 
              className={styles.userButton}
              onClick={() => setShowUserMenu(prev => !prev)}
            >
              <span className={styles.username}>{user?.login || 'Пользователь'}</span>
              {isAdmin && <span className={styles.adminBadge}>Admin</span>}
              <span className={`${styles.arrow} ${showUserMenu ? styles.arrowUp : ''}`}>▼</span>
            </button>
            
            {showUserMenu && (
              <div className={styles.userMenu}>
                <button onClick={() => { 
                  setShowUserInfo(true); 
                  setShowUserMenu(false); 
                }}>
                  Информация о пользователе
                </button>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showUserInfo && <UserInfoModal onClose={() => setShowUserInfo(false)} />}
    </>
  );
};

export default Header;