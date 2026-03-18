import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { validateName, validatePhone, validatePassword, validateLogin, formatPhone } from '../../utils/validators';
import styles from './Auth.module.css';

const RegisterForm = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    individualKey: '',
    phone: '',
    login: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateName(formData.lastName)) {
      newErrors.lastName = 'Фамилия должна содержать только буквы (макс. 15)';
    }
    if (!validateName(formData.firstName)) {
      newErrors.firstName = 'Имя должно содержать только буквы (макс. 15)';
    }
    if (formData.middleName && !validateName(formData.middleName)) {
      newErrors.middleName = 'Отчество должно содержать только буквы (макс. 15)';
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Телефон должен быть в формате +7 или 8 и содержать 11 цифр';
    }
    if (!validateLogin(formData.login)) {
      newErrors.login = 'Логин должен содержать минимум 3 символа';
    }
    if (!formData.individualKey.trim()) {
      newErrors.individualKey = 'Индивидуальный ключ обязателен';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      const formattedPhone = formatPhone(formData.phone);
      const result = await register({
        ...formData,
        phone: formattedPhone
      });
      
      if (result.success) {
        onRegisterSuccess();
      } else {
        if (result.field) {
          setErrors({ [result.field]: result.message });
        } else {
          setErrors({ general: result.message });
        }
      }
      
      setIsLoading(false);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>Регистрация</h2>

        {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}

        <div className={styles.formGroup}>
          <label>Фамилия</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? styles.error : ''}
            maxLength={15}
            required
            disabled={isLoading}
          />
          {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Имя</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? styles.error : ''}
            maxLength={15}
            required
            disabled={isLoading}
          />
          {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Отчество</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            className={errors.middleName ? styles.error : ''}
            maxLength={15}
            disabled={isLoading}
          />
          {errors.middleName && <span className={styles.errorMessage}>{errors.middleName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Индивидуальный ключ</label>
          <input
            type="text"
            name="individualKey"
            value={formData.individualKey}
            onChange={handleChange}
            className={errors.individualKey ? styles.error : ''}
            required
            disabled={isLoading}
          />
          {errors.individualKey && <span className={styles.errorMessage}>{errors.individualKey}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Номер телефона</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+7XXXXXXXXXX"
            className={errors.phone ? styles.error : ''}
            required
            disabled={isLoading}
          />
          {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Логин</label>
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            className={errors.login ? styles.error : ''}
            required
            disabled={isLoading}
          />
          {errors.login && <span className={styles.errorMessage}>{errors.login}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Пароль</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? styles.error : ''}
            required
            disabled={isLoading}
          />
          {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Повторите пароль</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? styles.error : ''}
            required
            disabled={isLoading}
          />
          {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <button 
          type="button" 
          onClick={onSwitchToLogin}
          className={styles.switchButton}
          disabled={isLoading}
        >
          Уже есть аккаунт? Войти
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;