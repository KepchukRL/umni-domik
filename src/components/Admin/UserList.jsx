import React, { useState } from 'react';
import styles from './Admin.module.css';

const UserList = ({ users, onSendNotification, onToggleStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className={styles.userList}>
      <input className={styles.Search}
        type="text"
        placeholder="Поиск пользователей..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className={styles.userGrid}>
        {filteredUsers.map(user => (
          <div key={user.id} className={styles.userCard}>
            <h3>{user.lastName} {user.firstName}</h3>
            <p>Логин:{user.login}</p>
            <p>Тел: {user.phone}</p>
            <p>Роль: {user.role === 'admin' ? 'Админ' : 'Пользователь'}</p>
            <p>Статус: {user.isActive ? '✅ Активен' : '❌ Заблокирован'}</p>
            <button onClick={() => onSendNotification(user)}>Уведомление</button>
            <button onClick={() => onToggleStatus(user.id, !user.isActive)}>
              {user.isActive ? 'Заблокировать' : 'Разблокировать'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;