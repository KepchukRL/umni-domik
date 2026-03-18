import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import styles from './Modals.module.css';

const UserInfoModal = ({ onClose }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Информация о пользователе</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Фамилия:</span>
            <span className={styles.infoValue}>{user?.lastName || '—'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Имя:</span>
            <span className={styles.infoValue}>{user?.firstName || '—'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Отчество:</span>
            <span className={styles.infoValue}>{user?.middleName || '—'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Логин:</span>
            <span className={styles.infoValue}>{user?.login || '—'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Телефон:</span>
            <span className={styles.infoValue}>{user?.phone || '—'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Индивидуальный ключ:</span>
            <span className={styles.infoValue}>{user?.individualKey || '—'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Роль:</span>
            <span className={styles.infoValue}>
              {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
            </span>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button className={styles.primaryButton} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;